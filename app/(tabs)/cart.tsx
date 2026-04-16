// ============================================================
// CART SCREEN — Apana Store (Customer App)
//
// Multi-store cart with:
//   Store cards — fulfillment mode selector per store
//   Item rows   — quantity controls, swipe-to-remove trash
//   Promo code  — text input + validation
//   Price breakdown — subtotal, delivery, discount, total
//   Checkout button — sticky at bottom
//   Empty state — illustrated placeholder
//
// State is local (useState) — migrate to Zustand / Context
// and wire to POST /cart + POST /orders when backend ready.
// ============================================================

import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, StatusBar, Alert, Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { typography } from "../../theme/typography";
import useTheme from "../../theme/useTheme";
import {
  INITIAL_CART, PROMO_CODES, DELIVERY_FEE,
  CartStore, CartItem, FulfillmentMode,
} from "../../data/cartData";

const { width: SW } = Dimensions.get("window");

// ── Fulfillment labels & colors ───────────────────────────────
const FULFILLMENT_CONFIG: Record<FulfillmentMode, { label: string; icon: string; color: string; bg: string }> = {
  pickup:   { label: "Pickup",   icon: "walk-outline",     color: "#026451", bg: "#DCFCE7" },
  delivery: { label: "Delivery", icon: "bicycle-outline",  color: "#1D4ED8", bg: "#DBEAFE" },
  ride:     { label: "Ride",     icon: "car-outline",      color: "#7C3AED", bg: "#EDE9FE" },
};

// ── Helpers ───────────────────────────────────────────────────
function storeSubtotal(store: CartStore) {
  return store.items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export default function CartScreen() {
  const { colors, isDark } = useTheme();

  const [cart,          setCart]          = useState<CartStore[]>(INITIAL_CART);
  const [promoInput,    setPromoInput]    = useState("");
  const [appliedPromo,  setAppliedPromo]  = useState<string | null>(null);
  const [promoError,    setPromoError]    = useState("");

  // ── Derived totals ─────────────────────────────────────────
  const subtotal      = cart.reduce((s, store) => s + storeSubtotal(store), 0);
  const deliveryTotal = cart.reduce((s, store) => s + DELIVERY_FEE[store.fulfillment], 0);
  const promoData     = appliedPromo ? PROMO_CODES[appliedPromo] : null;
  const discountAmt   = promoData ? Math.round(subtotal * promoData.discount) : 0;
  const total         = subtotal + deliveryTotal - discountAmt;
  const totalItems    = cart.reduce((s, store) => s + store.items.reduce((si, i) => si + i.qty, 0), 0);

  // ── Cart mutations ─────────────────────────────────────────
  function updateQty(storeId: string, itemId: string, delta: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCart(prev => prev.map(store => {
      if (store.id !== storeId) return store;
      return {
        ...store,
        items: store.items.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, qty: Math.max(1, item.qty + delta) };
        }),
      };
    }));
  }

  function removeItem(storeId: string, itemId: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCart(prev => prev.map(store => {
      if (store.id !== storeId) return store;
      return { ...store, items: store.items.filter(i => i.id !== itemId) };
    }).filter(store => store.items.length > 0));
  }

  function setFulfillment(storeId: string, mode: FulfillmentMode) {
    setCart(prev => prev.map(s =>
      s.id === storeId ? { ...s, fulfillment: mode } : s
    ));
  }

  function clearCart() {
    Alert.alert("Clear Cart", "Remove all items from cart?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear",  style: "destructive", onPress: () => {
        setCart([]);
        setAppliedPromo(null);
        setPromoInput("");
      }},
    ]);
  }

  // ── Promo ──────────────────────────────────────────────────
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

  // ── Empty state ────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />

        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
            My Cart
          </Text>
        </View>

        {/* Empty */}
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyIconWrap, { backgroundColor: colors.primary + "12" }]}>
            <Ionicons name="bag-outline" size={56} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptySub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
            Browse stores and add items to get started. Your multi-store cart will appear here.
          </Text>
          <View style={styles.emptyTips}>
            {[
              { icon: "storefront-outline", text: "Shop from multiple stores" },
              { icon: "bicycle-outline",    text: "Choose Pickup, Delivery or Ride" },
              { icon: "shield-checkmark-outline", text: "Safe & verified local stores" },
            ].map((tip, i) => (
              <View key={i} style={styles.emptyTip}>
                <Ionicons name={tip.icon as any} size={16} color={colors.primary} />
                <Text style={[styles.emptyTipText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                  {tip.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Filled cart ────────────────────────────────────────────
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
              My Cart
            </Text>
            <View style={[styles.itemCountBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.itemCountText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
                {totalItems}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={clearCart} activeOpacity={0.7} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
            <Text style={[styles.clearText, { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
              Clear
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ── Scrollable content ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* ── Store cards ── */}
        {cart.map(store => (
          <View key={store.id} style={[styles.storeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>

            {/* Store header */}
            <View style={styles.storeHeader}>
              <View style={[styles.storeIconWrap, { backgroundColor: store.typeBg }]}>
                <Ionicons name="storefront-outline" size={18} color={store.typeColor} />
              </View>
              <View style={styles.storeInfo}>
                <Text style={[styles.storeName, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}
                  numberOfLines={1}>
                  {store.name}
                </Text>
                <View style={[styles.storeTypePill, { backgroundColor: store.typeBg }]}>
                  <Text style={[styles.storeTypeText, { color: store.typeColor, fontFamily: typography.fontFamily.semiBold, fontSize: 10 }]}>
                    {store.type}
                  </Text>
                </View>
              </View>
              <Text style={[styles.storeSubtotal, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                ₹{storeSubtotal(store)}
              </Text>
            </View>

            {/* Fulfillment selector */}
            <View style={[styles.fulfillmentRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
              {(["pickup", "delivery", "ride"] as FulfillmentMode[]).map(mode => {
                const cfg    = FULFILLMENT_CONFIG[mode];
                const active = store.fulfillment === mode;
                return (
                  <TouchableOpacity
                    key={mode}
                    style={[
                      styles.fulfillPill,
                      active
                        ? { backgroundColor: cfg.bg, borderColor: cfg.color }
                        : { backgroundColor: "transparent", borderColor: colors.border },
                    ]}
                    onPress={() => setFulfillment(store.id, mode)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name={cfg.icon as any} size={13} color={active ? cfg.color : colors.subText} />
                    <Text style={[styles.fulfillText, {
                      color:      active ? cfg.color : colors.subText,
                      fontFamily: active ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                      fontSize:   11,
                    }]}>
                      {cfg.label}
                    </Text>
                    {DELIVERY_FEE[mode] > 0 && (
                      <Text style={[styles.fulfillFee, { color: active ? cfg.color : colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 9.5 }]}>
                        +₹{DELIVERY_FEE[mode]}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Items */}
            {store.items.map((item, idx) => (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  idx < store.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
              >
                {/* Image placeholder */}
                <View style={[styles.itemImg, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon as any} size={26} color="rgba(0,0,0,0.25)" />
                </View>

                {/* Info */}
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}
                    numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemUnit, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                    {item.unit}
                  </Text>
                  <Text style={[styles.itemPrice, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                    ₹{item.price * item.qty}
                  </Text>
                </View>

                {/* Quantity controls + delete */}
                <View style={styles.itemControls}>
                  {/* Trash (remove) */}
                  <TouchableOpacity
                    style={[styles.trashBtn, { borderColor: "#FCA5A5" }]}
                    onPress={() => removeItem(store.id, item.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={14} color="#EF4444" />
                  </TouchableOpacity>

                  {/* − qty + */}
                  <View style={[styles.qtyRow, { borderColor: colors.border }]}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQty(store.id, item.id, -1)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="remove" size={16} color={item.qty === 1 ? colors.subText : colors.primary} />
                    </TouchableOpacity>

                    <Text style={[styles.qtyNum, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                      {item.qty}
                    </Text>

                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQty(store.id, item.id, +1)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="add" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

          </View>
        ))}

        {/* ── Promo code ── */}
        <View style={[styles.promoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.promoHeader}>
            <Ionicons name="pricetag-outline" size={16} color={colors.primary} />
            <Text style={[styles.promoTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              Promo Code
            </Text>
          </View>

          {appliedPromo ? (
            <View style={[styles.promoApplied, { backgroundColor: "#DCFCE7", borderColor: "#16A34A" }]}>
              <View style={styles.promoAppliedLeft}>
                <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                <View>
                  <Text style={[styles.promoAppliedCode, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm, color: "#15803D" }]}>
                    {appliedPromo}
                  </Text>
                  <Text style={[styles.promoAppliedLabel, { fontFamily: typography.fontFamily.regular, fontSize: 10.5, color: "#16A34A" }]}>
                    {PROMO_CODES[appliedPromo].label} — You save ₹{discountAmt}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={removePromo} activeOpacity={0.7}>
                <Ionicons name="close-circle-outline" size={20} color="#16A34A" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={[styles.promoInputRow, { borderColor: promoError ? "#EF4444" : colors.border }]}>
                <TextInput
                  style={[styles.promoInput, { color: colors.text, fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm }]}
                  placeholder="Enter promo code"
                  placeholderTextColor={colors.subText}
                  value={promoInput}
                  onChangeText={t => { setPromoInput(t); setPromoError(""); }}
                  autoCapitalize="characters"
                  returnKeyType="done"
                  onSubmitEditing={applyPromo}
                />
                <TouchableOpacity
                  style={[styles.promoApplyBtn, { backgroundColor: colors.primary }]}
                  onPress={applyPromo}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.promoApplyText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
              {promoError ? (
                <Text style={[styles.promoErrorText, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                  {promoError}
                </Text>
              ) : (
                <Text style={[styles.promoHint, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 10.5 }]}>
                  Try: APANA10 · SAVE20 · FIRST50
                </Text>
              )}
            </>
          )}
        </View>

        {/* ── Price breakdown ── */}
        <View style={[styles.priceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.priceCardTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            Price Details
          </Text>

          <View style={styles.priceDivider} />

          <PriceRow label="Item Subtotal" value={`₹${subtotal}`} textColor={colors.text} subColor={colors.subText} />
          <PriceRow label="Delivery Charges" value={deliveryTotal === 0 ? "FREE" : `₹${deliveryTotal}`}
            textColor={colors.text} subColor={deliveryTotal === 0 ? "#16A34A" : colors.subText} valueColor={deliveryTotal === 0 ? "#16A34A" : undefined} />

          {discountAmt > 0 && (
            <PriceRow label={`Promo (${appliedPromo})`} value={`−₹${discountAmt}`}
              textColor={colors.text} subColor={colors.subText} valueColor="#16A34A" />
          )}

          <View style={[styles.priceDivider, { marginTop: 10 }]} />

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
              Total Payable
            </Text>
            <Text style={[styles.totalValue, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
              ₹{total}
            </Text>
          </View>

          {discountAmt > 0 && (
            <View style={[styles.savingsBadge, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="happy-outline" size={14} color="#15803D" />
              <Text style={[styles.savingsText, { color: "#15803D", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                You're saving ₹{discountAmt} on this order!
              </Text>
            </View>
          )}
        </View>

        {/* Stores delivery info */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { icon: "shield-checkmark-outline", color: "#16A34A", text: "All stores are verified & LIVE" },
            { icon: "time-outline",             color: colors.primary, text: "Estimated time shown at checkout" },
            { icon: "lock-closed-outline",      color: "#F59E0B", text: "Secure payment — UPI, Card, COD" },
          ].map((tip, i) => (
            <View key={i} style={styles.infoRow}>
              <Ionicons name={tip.icon as any} size={15} color={tip.color} />
              <Text style={[styles.infoText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {tip.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Spacer for checkout button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Sticky checkout button ── */}
      <SafeAreaView
        style={[styles.checkoutBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}
        edges={["bottom"]}
      >
        <View style={styles.checkoutContent}>
          <View>
            <Text style={[styles.checkoutTotal, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
              ₹{total}
            </Text>
            <Text style={[styles.checkoutStores, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 10.5 }]}>
              {cart.length} store{cart.length > 1 ? "s" : ""} · {totalItems} item{totalItems > 1 ? "s" : ""}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
            onPress={() => Alert.alert("Checkout", "Order placement coming soon.")}
          >
            <Text style={[styles.checkoutBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              Proceed to Checkout
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

    </View>
  );
}

// ── Price row helper ──────────────────────────────────────────

function PriceRow({ label, value, textColor, subColor, valueColor }: {
  label: string; value: string;
  textColor: string; subColor: string; valueColor?: string;
}) {
  return (
    <View style={styles.priceRow}>
      <Text style={[styles.priceLabel, { color: textColor, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
        {label}
      </Text>
      <Text style={[styles.priceValue, { color: valueColor ?? subColor, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
        {value}
      </Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:  { flex: 1 },
  safe:  { flex: 1 },

  // Header
  header: {
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           10,
  },
  headerTitle:    {},
  itemCountBadge: {
    paddingHorizontal: 9,
    paddingVertical:   2,
    borderRadius:      20,
  },
  itemCountText: { color: "#fff" },
  clearBtn: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           4,
  },
  clearText: { color: "#EF4444" },

  // Scroll
  scroll: {
    padding:     16,
    gap:         12,
  },

  // Store card
  storeCard: {
    borderRadius: 14,
    borderWidth:  1,
    overflow:     "hidden",
  },
  storeHeader: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    padding:           12,
  },
  storeIconWrap: {
    width:          38,
    height:         38,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },
  storeInfo:     { flex: 1, gap: 3 },
  storeName:     {},
  storeTypePill: {
    alignSelf:         "flex-start",
    paddingHorizontal: 7,
    paddingVertical:   2,
    borderRadius:      20,
  },
  storeTypeText:  {},
  storeSubtotal:  {},

  // Fulfillment selector
  fulfillmentRow: {
    flexDirection:     "row",
    gap:               6,
    paddingHorizontal: 12,
    paddingVertical:   10,
    borderTopWidth:    1,
    borderBottomWidth: 1,
  },
  fulfillPill: {
    flex:              1,
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               4,
    paddingVertical:   7,
    borderRadius:      20,
    borderWidth:       1.5,
  },
  fulfillText: {},
  fulfillFee:  {},

  // Item row
  itemRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    paddingHorizontal: 12,
    paddingVertical:   10,
  },
  itemImg: {
    width:          60,
    height:         60,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  itemInfo:  { flex: 1, gap: 2 },
  itemName:  { lineHeight: 18 },
  itemUnit:  {},
  itemPrice: {},

  // Quantity controls
  itemControls: {
    alignItems: "flex-end",
    gap:        8,
  },
  trashBtn: {
    width:          28,
    height:         28,
    borderRadius:   8,
    borderWidth:    1,
    alignItems:     "center",
    justifyContent: "center",
  },
  qtyRow: {
    flexDirection:  "row",
    alignItems:     "center",
    borderWidth:    1,
    borderRadius:   10,
    overflow:       "hidden",
  },
  qtyBtn: {
    width:          30,
    height:         30,
    alignItems:     "center",
    justifyContent: "center",
  },
  qtyNum: {
    minWidth:  24,
    textAlign: "center",
  },

  // Promo card
  promoCard: {
    borderRadius: 14,
    borderWidth:  1,
    padding:      14,
    gap:          10,
  },
  promoHeader: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
  },
  promoTitle: {},
  promoInputRow: {
    flexDirection:  "row",
    alignItems:     "center",
    borderWidth:    1.5,
    borderRadius:   12,
    overflow:       "hidden",
  },
  promoInput: {
    flex:              1,
    paddingHorizontal: 12,
    paddingVertical:   10,
    letterSpacing:     1,
  },
  promoApplyBtn: {
    paddingHorizontal: 16,
    paddingVertical:   11,
  },
  promoApplyText:  { color: "#fff" },
  promoHint:       {},
  promoErrorText:  { color: "#EF4444" },
  promoApplied: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    padding:           12,
    borderRadius:      12,
    borderWidth:       1.5,
  },
  promoAppliedLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  promoAppliedCode:  {},
  promoAppliedLabel: {},

  // Price breakdown
  priceCard: {
    borderRadius: 14,
    borderWidth:  1,
    padding:      14,
    gap:          10,
  },
  priceCardTitle: {},
  priceDivider: {
    height:          1,
    backgroundColor: "#E5E7EB",
  },
  priceRow: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
  },
  priceLabel: {},
  priceValue: {},
  totalRow: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
    marginTop:      4,
  },
  totalLabel: {},
  totalValue: {},
  savingsBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    paddingHorizontal: 12,
    paddingVertical:    8,
    borderRadius:      10,
    marginTop:          4,
  },
  savingsText: {},

  // Info card
  infoCard: {
    borderRadius: 14,
    borderWidth:  1,
    padding:      14,
    gap:          10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
  },
  infoText: { flex: 1, lineHeight: 17 },

  // Checkout bar
  checkoutBar: {
    position:        "absolute",
    bottom:           0,
    left:             0,
    right:            0,
    borderTopWidth:   1,
  },
  checkoutContent: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    paddingVertical:   12,
    gap:               12,
  },
  checkoutTotal:  {},
  checkoutStores: {},
  checkoutBtn: {
    flex:              1,
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               8,
    paddingVertical:   13,
    borderRadius:      14,
  },
  checkoutBtnText: { color: "#fff" },

  // Empty state
  emptyWrap: {
    flex:              1,
    alignItems:        "center",
    justifyContent:    "center",
    paddingHorizontal: 32,
    gap:               14,
  },
  emptyIconWrap: {
    width:          110,
    height:         110,
    borderRadius:   32,
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   8,
  },
  emptyTitle: { textAlign: "center" },
  emptySub:   { textAlign: "center", lineHeight: 22 },
  emptyTips:  { gap: 10, marginTop: 6, alignSelf: "stretch" },
  emptyTip:   { flexDirection: "row", alignItems: "center", gap: 10 },
  emptyTipText: { flex: 1, lineHeight: 18 },
});
