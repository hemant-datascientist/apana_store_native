// ============================================================
// CART SCREEN — Apana Store (Customer App)
//
// Slim orchestrator. Reads cart state from CartContext (shared
// with checkout) so mutations here are visible to checkout.
//
// Key design decision:
//   Each fulfillment mode (Pickup / Delivery / Ride) produces a
//   SEPARATE checkout flow. The sticky bar shows one "Checkout"
//   button per mode group.
//
// Data: CartContext → useCart()
// Backend: POST /cart, POST /orders when ready
// ============================================================

import React, { useState, useMemo } from "react";
import { View, ScrollView, StyleSheet, Alert, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { FulfillmentMode, storeSubtotal } from "../../data/cartData";
import { useLocation } from "../../context/LocationContext";
import { useCartFees } from "../../hooks/useCartFees";
import { resolveStoreDiscount, storeCharged } from "../../lib/discount";
import LoginPromptModal   from "../../components/auth/LoginPromptModal";
import CartHeader         from "../../components/cart/CartHeader";
import CartEmptyState     from "../../components/cart/CartEmptyState";
import CartStoreCard      from "../../components/cart/CartStoreCard";
import CartPriceBreakdown from "../../components/cart/CartPriceBreakdown";
import CartTrustInfo      from "../../components/cart/CartTrustInfo";
import CartCheckoutBar, { FulfillmentGroup } from "../../components/cart/CartCheckoutBar";

export default function CartScreen() {
  const { colors, isDark } = useTheme();
  const { isLoggedIn }     = useAuth();
  const router             = useRouter();

  // ── Cart state from shared context ───────────────────────
  const { cart, hydrated, updateQty, removeItem, setFulfillment, clearCart } = useCart();

  // ── Local-only UI state ───────────────────────────────────
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // ── Derived totals ────────────────────────────────────────
  // subtotal = everyday prices. Two saving buckets, labelled separately:
  //   bulkSavings  = stop-loss floors (seller-funded, basket-unlocked)
  //   brandSavings = brand-funded markdowns (brand pays, seller kept whole)
  // chargedSubtotal = subtotal − both.
  const subtotal        = cart.reduce((s, st) => s + storeSubtotal(st), 0);
  const discs           = useMemo(() => cart.map(resolveStoreDiscount), [cart]);
  const bulkSavings     = discs.reduce((s, d) => s + d.savings, 0);
  const brandSavings    = discs.reduce((s, d) => s + d.brandSavings, 0);
  const chargedSubtotal = subtotal - bulkSavings - brandSavings;
  // Fees come from the server (the same rule checkout charges with), priced to
  // the delivery address the header shows. Unknown until priced → "—".
  const { selectedAddress } = useLocation();
  const dropPin = selectedAddress.lat != null && selectedAddress.lng != null
    ? { lat: selectedAddress.lat, lng: selectedAddress.lng } : null;
  const fees            = useCartFees(cart, dropPin);
  const deliveryTotal   = fees.deliveryTotal;
  const total           = deliveryTotal == null ? null : chargedSubtotal + deliveryTotal + fees.platformTotal;
  const totalItems      = cart.reduce((s, st) => s + st.items.reduce((si, i) => si + i.qty, 0), 0);

  // ── Fulfillment groups for the per-mode checkout bar ──────
  const fulfillmentGroups = useMemo<FulfillmentGroup[]>(() => {
    const map = new Map<FulfillmentMode, FulfillmentGroup>();
    cart.forEach(store => {
      const f        = fees.feeOf(store.id);
      const sub      = f && f.delivery != null ? storeCharged(store) + f.delivery + f.platform : null;
      const items    = store.items.reduce((s, i) => s + i.qty, 0);
      const existing = map.get(store.fulfillment);
      if (existing) {
        existing.storeCount++;
        existing.itemCount += items;
        existing.total      = existing.total == null || sub == null ? null : existing.total + sub;
      } else {
        map.set(store.fulfillment, { mode: store.fulfillment, storeCount: 1, itemCount: items, total: sub });
      }
    });
    return Array.from(map.values());
  }, [cart, fees]);

  // ── Dynamic spacer ────────────────────────────────────────
  const barHeight = useMemo(
    () => fulfillmentGroups.length * 64 + (fulfillmentGroups.length - 1) * 8 + 24,
    [fulfillmentGroups.length],
  );

  // ── Wrappers that add haptics ─────────────────────────────
  function handleUpdateQty(storeId: string, itemId: string, delta: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateQty(storeId, itemId, delta);
  }

  function handleRemoveItem(storeId: string, itemId: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    removeItem(storeId, itemId);
  }

  function handleClearCart() {
    Alert.alert("Clear Cart", "Remove all items from cart?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: clearCart },
    ]);
  }

  // ── Checkout: passes mode — checkout reads from CartContext ─
  function handleCheckout(mode: FulfillmentMode) {
    if (!isLoggedIn) { setShowLoginPrompt(true); return; }
    router.push(`/checkout?mode=${mode}`);
  }

  // ── Empty state ───────────────────────────────────────────
  // Only once the stored cart has been read back. Before that an empty array
  // means "not loaded yet", and showing "Your cart is empty" over a basket
  // that is about to appear reads as the app having lost it.
  if (cart.length === 0 && hydrated) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />
        <View style={[styles.emptyHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <CartHeader totalItems={0} onClear={() => {}} />
        </View>
        <CartEmptyState />
      </SafeAreaView>
    );
  }

  if (cart.length === 0) {
    // Hydrating — header only, no verdict either way.
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />
        <View style={[styles.emptyHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <CartHeader totalItems={0} onClear={() => {}} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />

      <SafeAreaView style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <CartHeader totalItems={totalItems} onClear={handleClearCart} />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {cart.map(store => (
          <CartStoreCard
            key={store.id}
            store={store}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onSetFulfillment={setFulfillment}
            deliveryBlock={fees.feeOf(store.id)?.block ?? null}
          />
        ))}

        <CartPriceBreakdown
          subtotal={subtotal}
          bulkSavings={bulkSavings}
          brandSavings={brandSavings}
          deliveryTotal={deliveryTotal}
          platformFee={fees.platformTotal}
          total={total}
        />

        <CartTrustInfo />

        <View style={{ height: barHeight + 20 }} />
      </ScrollView>

      <CartCheckoutBar groups={fulfillmentGroups} onCheckout={handleCheckout} />

      <LoginPromptModal
        visible={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => { setShowLoginPrompt(false); router.push("/login"); }}
        reason="checkout"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1 },
  safe:        { flex: 1 },
  emptyHeader: { borderBottomWidth: 1 },
  header:      { borderBottomWidth: 1 },
  scroll:      { padding: 16, gap: 12 },
});
