// ============================================================
// CART SCREEN — Apana Store (Customer App)
//
// Slim orchestrator. All state + mutation logic lives here;
// all UI is delegated to components/cart/.
//
// State:
//   cart            — list of CartStore (local; migrate to Zustand later)
//   promoInput      — current promo code text
//   appliedPromo    — validated promo key or null
//   promoError      — validation message
//   showLoginPrompt — guards checkout for guest users
//
// Data: INITIAL_CART, PROMO_CODES, DELIVERY_FEE (cartData.ts)
// Backend: POST /cart, POST /orders when ready
// ============================================================

import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { useAuth } from "../../context/AuthContext";
import {
  INITIAL_CART, PROMO_CODES, DELIVERY_FEE,
  CartStore, FulfillmentMode,
} from "../../data/cartData";
import LoginPromptModal  from "../../components/auth/LoginPromptModal";
import CartHeader        from "../../components/cart/CartHeader";
import CartEmptyState    from "../../components/cart/CartEmptyState";
import CartStoreCard     from "../../components/cart/CartStoreCard";
import CartPromoCard     from "../../components/cart/CartPromoCard";
import CartPriceBreakdown from "../../components/cart/CartPriceBreakdown";
import CartTrustInfo     from "../../components/cart/CartTrustInfo";
import CartCheckoutBar   from "../../components/cart/CartCheckoutBar";

export default function CartScreen() {
  const { colors, isDark } = useTheme();
  const { isLoggedIn }     = useAuth();
  const router             = useRouter();

  // ── Cart state ────────────────────────────────────────────
  const [cart,            setCart]            = useState<CartStore[]>(INITIAL_CART);
  const [promoInput,      setPromoInput]      = useState("");
  const [appliedPromo,    setAppliedPromo]    = useState<string | null>(null);
  const [promoError,      setPromoError]      = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // ── Derived totals ────────────────────────────────────────
  const subtotal      = cart.reduce((s, st) => s + st.items.reduce((si, i) => si + i.price * i.qty, 0), 0);
  const deliveryTotal = cart.reduce((s, st) => s + DELIVERY_FEE[st.fulfillment], 0);
  const promoData     = appliedPromo ? PROMO_CODES[appliedPromo] : null;
  const discountAmt   = promoData ? Math.round(subtotal * promoData.discount) : 0;
  const total         = subtotal + deliveryTotal - discountAmt;
  const totalItems    = cart.reduce((s, st) => s + st.items.reduce((si, i) => si + i.qty, 0), 0);

  // ── Item quantity mutation ────────────────────────────────
  function updateQty(storeId: string, itemId: string, delta: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCart(prev => prev.map(store => store.id !== storeId ? store : {
      ...store,
      items: store.items.map(item =>
        item.id !== itemId ? item : { ...item, qty: Math.max(1, item.qty + delta) }
      ),
    }));
  }

  // ── Remove item (removes store if last item gone) ─────────
  function removeItem(storeId: string, itemId: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCart(prev =>
      prev.map(store => store.id !== storeId ? store : {
        ...store, items: store.items.filter(i => i.id !== itemId),
      }).filter(store => store.items.length > 0)
    );
  }

  // ── Fulfillment mode change per store ─────────────────────
  function setFulfillment(storeId: string, mode: FulfillmentMode) {
    setCart(prev => prev.map(s => s.id === storeId ? { ...s, fulfillment: mode } : s));
  }

  // ── Clear entire cart ─────────────────────────────────────
  function clearCart() {
    Alert.alert("Clear Cart", "Remove all items from cart?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => {
        setCart([]);
        setAppliedPromo(null);
        setPromoInput("");
      }},
    ]);
  }

  // ── Promo code apply / remove ─────────────────────────────
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

  // ── Checkout action ───────────────────────────────────────
  function handleCheckout() {
    if (!isLoggedIn) { setShowLoginPrompt(true); return; }
    router.push("/checkout");
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

  // ── Filled cart ───────────────────────────────────────────
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />

      {/* Header */}
      <SafeAreaView style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <CartHeader totalItems={totalItems} onClear={clearCart} />
      </SafeAreaView>

      {/* Scrollable content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Store cards */}
        {cart.map(store => (
          <CartStoreCard
            key={store.id}
            store={store}
            onUpdateQty={updateQty}
            onRemoveItem={removeItem}
            onSetFulfillment={setFulfillment}
          />
        ))}

        {/* Promo code */}
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

        {/* Price breakdown */}
        <CartPriceBreakdown
          subtotal={subtotal}
          deliveryTotal={deliveryTotal}
          discountAmt={discountAmt}
          appliedPromo={appliedPromo}
          total={total}
        />

        {/* Trust info */}
        <CartTrustInfo />

        {/* Spacer for sticky checkout bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky checkout bar */}
      <CartCheckoutBar
        total={total}
        cartLength={cart.length}
        totalItems={totalItems}
        onCheckout={handleCheckout}
      />

      {/* Auth guard modal */}
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
