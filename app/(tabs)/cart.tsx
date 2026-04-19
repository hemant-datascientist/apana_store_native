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
import {
  PROMO_CODES, DELIVERY_FEE, FulfillmentMode, storeSubtotal,
} from "../../data/cartData";
import LoginPromptModal   from "../../components/auth/LoginPromptModal";
import CartHeader         from "../../components/cart/CartHeader";
import CartEmptyState     from "../../components/cart/CartEmptyState";
import CartStoreCard      from "../../components/cart/CartStoreCard";
import CartPromoCard      from "../../components/cart/CartPromoCard";
import CartPriceBreakdown from "../../components/cart/CartPriceBreakdown";
import CartTrustInfo      from "../../components/cart/CartTrustInfo";
import CartCheckoutBar, { FulfillmentGroup } from "../../components/cart/CartCheckoutBar";

export default function CartScreen() {
  const { colors, isDark } = useTheme();
  const { isLoggedIn }     = useAuth();
  const router             = useRouter();

  // ── Cart state from shared context ───────────────────────
  const { cart, updateQty, removeItem, setFulfillment, clearCart } = useCart();

  // ── Local-only UI state ───────────────────────────────────
  const [promoInput,      setPromoInput]      = useState("");
  const [appliedPromo,    setAppliedPromo]    = useState<string | null>(null);
  const [promoError,      setPromoError]      = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // ── Derived totals ────────────────────────────────────────
  const subtotal      = cart.reduce((s, st) => s + storeSubtotal(st), 0);
  const deliveryTotal = cart.reduce((s, st) => s + DELIVERY_FEE[st.fulfillment], 0);
  const promoData     = appliedPromo ? PROMO_CODES[appliedPromo] : null;
  const discountAmt   = promoData ? Math.round(subtotal * promoData.discount) : 0;
  const total         = subtotal + deliveryTotal - discountAmt;
  const totalItems    = cart.reduce((s, st) => s + st.items.reduce((si, i) => si + i.qty, 0), 0);

  // ── Fulfillment groups for the per-mode checkout bar ──────
  const fulfillmentGroups = useMemo<FulfillmentGroup[]>(() => {
    const map = new Map<FulfillmentMode, FulfillmentGroup>();
    cart.forEach(store => {
      const sub      = storeSubtotal(store) + DELIVERY_FEE[store.fulfillment];
      const items    = store.items.reduce((s, i) => s + i.qty, 0);
      const existing = map.get(store.fulfillment);
      if (existing) {
        existing.storeCount++;
        existing.itemCount += items;
        existing.total     += sub;
      } else {
        map.set(store.fulfillment, { mode: store.fulfillment, storeCount: 1, itemCount: items, total: sub });
      }
    });
    return Array.from(map.values());
  }, [cart]);

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
      { text: "Clear", style: "destructive", onPress: () => {
        clearCart();
        setAppliedPromo(null);
        setPromoInput("");
      }},
    ]);
  }

  // ── Promo code ────────────────────────────────────────────
  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (!code) { setPromoError("Enter a promo code."); return; }
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoError("");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setPromoError("Invalid promo code.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  function removePromo() {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError("");
  }

  // ── Checkout: passes mode — checkout reads from CartContext ─
  function handleCheckout(mode: FulfillmentMode) {
    if (!isLoggedIn) { setShowLoginPrompt(true); return; }
    router.push(`/checkout?mode=${mode}`);
  }

  // ── Empty state ───────────────────────────────────────────
  if (cart.length === 0) {
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
          />
        ))}

        <CartPromoCard
          promoInput={promoInput}
          onInputChange={t => { setPromoInput(t); setPromoError(""); }}
          appliedPromo={appliedPromo}
          promoError={promoError}
          discountAmt={discountAmt}
          promoLabel={promoData?.label ?? ""}
          onApply={applyPromo}
          onRemove={removePromo}
        />

        <CartPriceBreakdown
          subtotal={subtotal}
          deliveryTotal={deliveryTotal}
          discountAmt={discountAmt}
          appliedPromo={appliedPromo}
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
