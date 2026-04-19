// ============================================================
// CHECKOUT PAYMENT SCREEN — Apana Store (Customer App)
//
// Step 3 of 4 in checkout flow: Cart → Review → Payment → Track
//
// Receives from checkout (Review) screen via URL params:
//   mode, addressId, promoCode, discount, note, total
//
// Shows:
//   Progress steps (Payment step active)
//   Order total summary card
//   Payment method selector (radio list)
//   Security assurance strip
//   "Pay ₹X" sticky CTA → calls placeOrder() → navigates to:
//     Pickup:          /order-qr
//     Delivery / Ride: /order-tracking
//
// Backend: POST /customer/orders  →  PlaceOrderResponse
// ============================================================

import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView }      from "react-native-safe-area-context";
import { Ionicons }          from "@expo/vector-icons";
import * as Haptics          from "expo-haptics";
import { useRouter, useLocalSearchParams } from "expo-router";

import useTheme              from "../../theme/useTheme";
import { typography }        from "../../theme/typography";
import { FulfillmentMode, FULFILLMENT_CONFIG, DELIVERY_FEE } from "../../data/cartData";
import { CHECKOUT_STEPS }    from "../../data/checkoutData";
import { MOCK_PAYMENT_METHODS, PaymentMethod } from "../../data/paymentData";
import { useCart }           from "../../context/CartContext";
import {
  placeOrder, PlaceOrderRequest, StoreOrderInput, StoreOrderResult,
} from "../../services/checkoutService";

import CheckoutPaymentSelector from "../../components/checkout/CheckoutPaymentSelector";

// ── COD is available for delivery/ride (partner collects cash),
//    but NOT for pickup (no one collects cash at the store counter).
function getEligibleMethods(mode: FulfillmentMode) {
  if (mode === "pickup") return MOCK_PAYMENT_METHODS.filter(m => m.type !== "cod");
  return MOCK_PAYMENT_METHODS;
}

const ACTIVE_STEP = "payment";

export default function CheckoutPaymentScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();
  const { cart: fullCart } = useCart();

  // ── Route params passed from checkout (Review) screen ────────
  const {
    mode:       modeParam   = "delivery",
    addressId:  addrId      = "",
    promoCode:  promoParam  = "",
    discount:   discParam   = "0",
    note:       noteParam   = "",
    total:      totalParam  = "0",
  } = useLocalSearchParams<{
    mode?:      string;
    addressId?: string;
    promoCode?: string;
    discount?:  string;
    note?:      string;
    total?:     string;
  }>();

  const mode        = modeParam as FulfillmentMode;
  const discount    = parseFloat(discParam);
  const total       = parseFloat(totalParam);
  const note        = decodeURIComponent(noteParam);
  const promoCode   = promoParam || null;

  const modeCfg = FULFILLMENT_CONFIG[mode];

  // ── Filter cart to this mode ──────────────────────────────────
  const cart = useMemo(
    () => fullCart.filter(s => s.fulfillment === mode),
    [fullCart, mode],
  );

  const totalItems = useMemo(
    () => cart.reduce((s, st) => s + st.items.reduce((si, i) => si + i.qty, 0), 0),
    [cart],
  );

  // ── Payment method state ──────────────────────────────────────
  const eligibleMethods = useMemo(() => getEligibleMethods(mode), [mode]);
  const defaultMethod   = eligibleMethods.find(m => m.isDefault) ?? eligibleMethods[0];
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(defaultMethod);
  const isCod = selectedPayment.type === "cod";
  const [placing,  setPlacing]  = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // ── Progress step ─────────────────────────────────────────────
  const activeProgressIdx = useMemo(
    () => CHECKOUT_STEPS.findIndex(s => s.key === ACTIVE_STEP),
    [],
  );

  // ── Confirm payment → place order → navigate ─────────────────
  // placeOrder() → POST /customer/orders
  async function handlePay() {
    setPayError(null);
    setPlacing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const storeOrders: StoreOrderInput[] = cart.map(store => ({
        storeId:   store.id,
        storeName: store.name,
        items:     store.items.map(item => ({
          itemId:    item.id,
          name:      item.name,
          qty:       item.qty,
          unitPrice: item.price,
        })),
      }));

      const req: PlaceOrderRequest = {
        mode,
        addressId:       addrId || null,
        paymentMethodId: selectedPayment.id,
        storeOrders,
        promoCode,
        note,
      };

      const res = await placeOrder(req);

      if (!res.success) {
        setPayError(res.message ?? "Payment failed. Please try again.");
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // All modes go to Track first — QR is shown from there after order is ready.
      // storeOrdersJson is forwarded so Track can pass it to the QR screen.
      const storeOrdersJson = encodeURIComponent(JSON.stringify(res.storeOrders));
      router.replace(
        `/order-tracking?mode=${mode}&orderId=${res.orderId}&total=${total}&storeOrdersJson=${storeOrdersJson}`,
      );
    } catch (err: any) {
      setPayError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.background }]}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
            Payment
          </Text>

          {/* Lock badge */}
          <View style={[styles.lockBadge, { backgroundColor: "#22C55E" + "15", borderColor: "#22C55E" + "40" }]}>
            <Ionicons name="lock-closed" size={13} color="#22C55E" />
          </View>
        </View>

        {/* ── Progress steps ── */}
        <View style={styles.stepsRow}>
          {CHECKOUT_STEPS.map((step, idx) => {
            const isDone   = idx < activeProgressIdx;
            const isActive = step.key === ACTIVE_STEP;
            return (
              <React.Fragment key={step.key}>
                <View style={styles.stepNode}>
                  <View style={[
                    styles.stepCircle,
                    isActive && { backgroundColor: colors.primary, borderColor: colors.primary },
                    isDone   && { backgroundColor: "#22C55E",      borderColor: "#22C55E"      },
                    !isActive && !isDone && { borderColor: colors.border },
                  ]}>
                    {isDone
                      ? <Ionicons name="checkmark" size={11} color="#fff" />
                      : <Ionicons name={step.icon as any} size={11} color={isActive ? "#fff" : colors.subText} />
                    }
                  </View>
                  <Text style={[styles.stepLabel, {
                    color:      isActive ? colors.primary : isDone ? "#22C55E" : colors.subText,
                    fontFamily: isActive ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                    fontSize:   typography.size.ss,
                  }]}>
                    {step.label}
                  </Text>
                </View>
                {idx < CHECKOUT_STEPS.length - 1 && (
                  <View style={[styles.stepLine, { backgroundColor: isDone ? "#22C55E" : colors.border }]} />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </SafeAreaView>

      {/* ── Scrollable content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Error banner ── */}
        {!!payError && (
          <View style={[styles.errorBanner, { backgroundColor: "#FEE2E2", borderColor: "#FCA5A5" }]}>
            <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
            <Text style={[styles.errorText, { color: "#DC2626", fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs, flex: 1 }]}>
              {payError}
            </Text>
            <TouchableOpacity onPress={() => setPayError(null)}>
              <Ionicons name="close" size={16} color="#DC2626" />
            </TouchableOpacity>
          </View>
        )}

        {/* ── Order summary card ── */}
        <View style={[styles.summaryCard, { backgroundColor: modeCfg.bg }]}>
          <View style={styles.summaryTop}>
            <View style={[styles.modeIcon, { backgroundColor: modeCfg.color + "22" }]}>
              <Ionicons name={modeCfg.icon as any} size={22} color={modeCfg.color} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={[styles.summaryMode, { color: modeCfg.color, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                {modeCfg.label} Order
              </Text>
              <Text style={[styles.summarySub, { color: modeCfg.color + "CC", fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {cart.length} store{cart.length > 1 ? "s" : ""} · {totalItems} item{totalItems > 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          {/* Total amount */}
          <View style={[styles.totalRow, { borderTopColor: modeCfg.color + "25" }]}>
            <Text style={[styles.totalLabel, { color: modeCfg.color + "AA", fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
              Order Total
            </Text>
            <Text style={[styles.totalAmt, { color: modeCfg.color, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
              ₹{total.toFixed(2)}
            </Text>
          </View>

          {/* Discount strip */}
          {discount > 0 && (
            <View style={[styles.discountStrip, { backgroundColor: "#22C55E" + "18", borderColor: "#22C55E" + "30" }]}>
              <Ionicons name="pricetag-outline" size={13} color="#16A34A" />
              <Text style={[styles.discountText, { color: "#15803D", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                You save ₹{discount.toFixed(2)} with {promoCode}
              </Text>
            </View>
          )}
        </View>

        {/* ── Payment method selector ── */}
        <CheckoutPaymentSelector
          methods={eligibleMethods}
          selectedId={selectedPayment.id}
          onSelect={setSelectedPayment}
        />

        {/* ── COD info strip — shown only when Cash on Delivery is selected ── */}
        {isCod && (
          <View style={[styles.codStrip, { backgroundColor: "#FEF9C3", borderColor: "#FCD34D" }]}>
            <Ionicons name="cash-outline" size={18} color="#D97706" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.codTitle, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
                Pay with Cash on Delivery
              </Text>
              <Text style={[styles.codSub, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                Keep exact change ready (₹{total.toFixed(0)}). The delivery partner will collect cash when they arrive.
              </Text>
            </View>
          </View>
        )}

        {/* ── Security assurance ── */}
        <View style={[styles.securityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { icon: "shield-checkmark-outline", color: "#16A34A", text: "256-bit SSL encrypted transaction" },
            { icon: "lock-closed-outline",      color: "#F59E0B", text: "CVV and card data never stored"   },
            { icon: "checkmark-circle-outline", color: colors.primary, text: "PCI-DSS compliant payment gateway" },
          ].map((item, i) => (
            <View key={i} style={styles.securityRow}>
              <Ionicons name={item.icon as any} size={14} color={item.color} />
              <Text style={[styles.securityText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {item.text}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Sticky Pay CTA ── */}
      <SafeAreaView
        style={[styles.ctaBar, { backgroundColor: modeCfg.color }]}
        edges={["bottom"]}
      >
        <View style={styles.ctaContent}>
          <View>
            <Text style={[styles.ctaMethod, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
              via {selectedPayment.label}
            </Text>
            <Text style={[styles.ctaAmount, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
              {isCod ? "₹" + total.toFixed(2) + " COD" : "Pay ₹" + total.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: "rgba(255,255,255,0.2)", opacity: placing ? 0.6 : 1 }]}
            onPress={handlePay}
            disabled={placing}
            activeOpacity={0.85}
          >
            {placing
              ? <ActivityIndicator size="small" color="#fff" />
              : <Ionicons name={isCod ? "cash-outline" : "lock-closed-outline"} size={18} color="#fff" />
            }
            <Text style={[styles.ctaBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              {placing ? "Placing Order…" : isCod ? "Place Order (COD)" : "Confirm & Pay"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1 },
  header: { borderBottomWidth: 1 },

  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  backBtn: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },
  headerTitle: { flex: 1 },
  lockBadge: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
    borderWidth:    1,
  },

  stepsRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 20,
    paddingBottom:     14,
    paddingTop:        4,
  },
  stepNode:   { alignItems: "center", gap: 4 },
  stepCircle: {
    width:          26,
    height:         26,
    borderRadius:   13,
    borderWidth:    1.5,
    alignItems:     "center",
    justifyContent: "center",
  },
  stepLabel: {},
  stepLine: {
    flex:         1,
    height:       1.5,
    marginBottom: 14,
  },

  scroll:  { flex: 1 },
  content: { padding: 16, gap: 14 },

  // Error
  errorBanner: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           8,
    padding:       12,
    borderRadius:  12,
    borderWidth:   1,
  },
  errorText: {},

  // Summary
  summaryCard: {
    borderRadius: 16,
    padding:      16,
    gap:          12,
  },
  summaryTop: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           12,
  },
  modeIcon: {
    width:          48,
    height:         48,
    borderRadius:   14,
    alignItems:     "center",
    justifyContent: "center",
  },
  summaryInfo: { flex: 1 },
  summaryMode: {},
  summarySub:  { marginTop: 2 },
  totalRow: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
    borderTopWidth: 1,
    paddingTop:     12,
  },
  totalLabel: {},
  totalAmt:   {},
  discountStrip: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    padding:           10,
    borderRadius:      10,
    borderWidth:       1,
  },
  discountText: {},

  // COD info strip
  codStrip: {
    flexDirection:  "row",
    alignItems:     "flex-start",
    gap:            12,
    padding:        14,
    borderRadius:   14,
    borderWidth:    1,
  },
  codTitle: { color: "#92400E", marginBottom: 3 },
  codSub:   { color: "#92400E", lineHeight: 18 },

  // Security
  securityCard: {
    borderRadius: 14,
    borderWidth:  1,
    padding:      14,
    gap:          10,
  },
  securityRow: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           8,
  },
  securityText: { flex: 1, lineHeight: 17 },

  // CTA
  ctaBar: {
    position: "absolute",
    bottom:   0,
    left:     0,
    right:    0,
  },
  ctaContent: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    paddingVertical:   12,
    gap:               12,
  },
  ctaMethod: { color: "rgba(255,255,255,0.75)", marginBottom: 2 },
  ctaAmount: { color: "#fff" },
  ctaBtn: {
    flex:              1,
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               8,
    paddingVertical:   14,
    borderRadius:      14,
  },
  ctaBtnText: { color: "#fff" },
});
