// ============================================================
// CHECKOUT SCREEN — Apana Store (Customer App)
//
// Sections (top → bottom):
//   Progress Steps         — Cart → Review → Payment → Track
//   Delivery Address Card  — selected address + change modal
//   Order Summary          — per-store collapsible rows
//   Delivery Notes         — optional note to delivery partner
//   Payment Method Card    — selected method + change modal
//   Price Breakdown        — subtotal, delivery, discount, total
//   Place Order CTA        — sticky bottom bar
//
// Data: reads INITIAL_CART + SAVED_ADDRESSES + MOCK_PAYMENT_METHODS
// Note: cart state is local (no global store yet). When Zustand /
//       CartContext is added, swap INITIAL_CART for the shared state.
// ============================================================

import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, StatusBar, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

import { INITIAL_CART, DELIVERY_FEE } from "../../data/cartData";
import { SAVED_ADDRESSES, UserAddress } from "../../data/addressData";
import { MOCK_PAYMENT_METHODS, PaymentMethod } from "../../data/paymentData";
import { CHECKOUT_STEPS } from "../../data/checkoutData";

import CheckoutAddressCard    from "../../components/checkout/CheckoutAddressCard";
import CheckoutAddressPicker  from "../../components/checkout/CheckoutAddressPicker";
import CheckoutStoreRow       from "../../components/checkout/CheckoutStoreRow";
import CheckoutPaymentCard    from "../../components/checkout/CheckoutPaymentCard";
import CheckoutPaymentPicker  from "../../components/checkout/CheckoutPaymentPicker";
import CheckoutPriceBreakdown from "../../components/checkout/CheckoutPriceBreakdown";

export default function CheckoutScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();

  // ── Cart data (from shared INITIAL_CART until global state added) ──
  const cart = INITIAL_CART;

  // ── Selected address (default: first saved address = Home) ────
  const [selectedAddress,   setSelectedAddress]   = useState<UserAddress>(SAVED_ADDRESSES[0]);
  const [addressPickerOpen, setAddressPickerOpen] = useState(false);

  // ── Selected payment (default: the method marked isDefault) ──
  const defaultMethod = MOCK_PAYMENT_METHODS.find(m => m.isDefault) ?? MOCK_PAYMENT_METHODS[0];
  const [selectedPayment,   setSelectedPayment]   = useState<PaymentMethod>(defaultMethod);
  const [paymentPickerOpen, setPaymentPickerOpen] = useState(false);

  // ── Delivery note ─────────────────────────────────────────────
  const [note, setNote] = useState("");

  // ── Derived totals ────────────────────────────────────────────
  const { subtotal, deliveryTotal, total } = useMemo(() => {
    const sub = cart.reduce(
      (s, store) => s + store.items.reduce((si, i) => si + i.price * i.qty, 0),
      0,
    );
    const del = cart.reduce((s, store) => s + DELIVERY_FEE[store.fulfillment], 0);
    return { subtotal: sub, deliveryTotal: del, total: sub + del };
  }, [cart]);

  const totalItems = useMemo(
    () => cart.reduce((s, store) => s + store.items.reduce((si, i) => si + i.qty, 0), 0),
    [cart],
  );

  // ── Place order handler ───────────────────────────────────────
  // Backend: POST /orders { cart, addressId, paymentMethodId, note }
  function handlePlaceOrder() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "Order Placed! 🎉",
      "Your order has been placed successfully. Track it live from the Orders tab.",
      [
        {
          text:    "Track Order",
          onPress: () => router.replace("/(tabs)"),
        },
      ],
    );
  }

  // ── Step indicator ────────────────────────────────────────────
  // Highlights the current step ("checkout") in the breadcrumb.
  const ACTIVE_STEP = "checkout";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <View style={styles.headerRow}>
          {/* Back button */}
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.background }]}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
            Checkout
          </Text>

          {/* Item count badge */}
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.badgeText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
              {totalItems}
            </Text>
          </View>
        </View>

        {/* ── Progress steps ── */}
        <View style={styles.stepsRow}>
          {CHECKOUT_STEPS.map((step, idx) => {
            const isDone   = idx < CHECKOUT_STEPS.findIndex(s => s.key === ACTIVE_STEP);
            const isActive = step.key === ACTIVE_STEP;
            return (
              <React.Fragment key={step.key}>
                {/* Step node */}
                <View style={styles.stepNode}>
                  <View style={[
                    styles.stepCircle,
                    isActive && { backgroundColor: colors.primary, borderColor: colors.primary },
                    isDone  && { backgroundColor: "#22C55E", borderColor: "#22C55E" },
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

                {/* Connector line (skip after last) */}
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* ── Delivery Address ── */}
        <CheckoutAddressCard
          address={selectedAddress}
          onChangePress={() => setAddressPickerOpen(true)}
        />

        {/* ── Order Summary — per store ── */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            Order from {cart.length} store{cart.length > 1 ? "s" : ""}
          </Text>
          {cart.map(store => (
            <CheckoutStoreRow key={store.id} store={store} />
          ))}
        </View>

        {/* ── Delivery note (optional) ── */}
        <View style={[styles.noteCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.noteTitleRow}>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.primary} />
            <Text style={[styles.noteTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              Delivery Note
            </Text>
            <Text style={[styles.noteOptional, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              (optional)
            </Text>
          </View>
          <TextInput
            style={[styles.noteInput, {
              color:           colors.text,
              borderColor:     colors.border,
              backgroundColor: colors.background,
              fontFamily:      typography.fontFamily.regular,
              fontSize:        typography.size.sm,
            }]}
            placeholder="e.g. Leave at the gate, call on arrival…"
            placeholderTextColor={colors.subText}
            value={note}
            onChangeText={setNote}
            multiline
            maxLength={200}
          />
          <Text style={[styles.noteCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
            {note.length}/200
          </Text>
        </View>

        {/* ── Payment Method ── */}
        <CheckoutPaymentCard
          method={selectedPayment}
          onChangePress={() => setPaymentPickerOpen(true)}
        />

        {/* ── Price Breakdown ── */}
        <CheckoutPriceBreakdown
          subtotal={subtotal}
          deliveryTotal={deliveryTotal}
          discountAmt={0}
          appliedPromo={null}
          total={total}
        />

        {/* ── Trust + policy footer ── */}
        <View style={[styles.trustCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { icon: "shield-checkmark-outline", color: "#16A34A", text: "All orders are verified & secured" },
            { icon: "refresh-outline",          color: colors.primary, text: "Easy cancellation within 2 minutes of placing" },
            { icon: "lock-closed-outline",      color: "#F59E0B", text: "100% safe payment — UPI, Card, COD" },
          ].map((tip, i) => (
            <View key={i} style={styles.trustRow}>
              <Ionicons name={tip.icon as any} size={14} color={tip.color} />
              <Text style={[styles.trustText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {tip.text}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Terms note ── */}
        <Text style={[styles.terms, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          By placing this order you agree to Apana Store's{" "}
          <Text style={{ color: colors.primary }}>Terms of Service</Text> and{" "}
          <Text style={{ color: colors.primary }}>Privacy Policy</Text>.
        </Text>

        {/* Spacer for sticky CTA */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Sticky Place Order CTA ── */}
      <SafeAreaView
        style={[styles.ctaBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}
        edges={["bottom"]}
      >
        <View style={styles.ctaContent}>
          {/* Total summary */}
          <View>
            <Text style={[styles.ctaTotal, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
              ₹{total}
            </Text>
            <Text style={[styles.ctaSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {cart.length} store{cart.length > 1 ? "s" : ""} · {totalItems} item{totalItems > 1 ? "s" : ""}
            </Text>
          </View>

          {/* Place Order button */}
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: colors.primary }]}
            onPress={handlePlaceOrder}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
            <Text style={[styles.ctaBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ── Address picker modal ── */}
      <CheckoutAddressPicker
        visible={addressPickerOpen}
        selectedId={selectedAddress.id}
        onSelect={addr => { setSelectedAddress(addr); setAddressPickerOpen(false); }}
        onClose={() => setAddressPickerOpen(false)}
      />

      {/* ── Payment picker modal ── */}
      <CheckoutPaymentPicker
        visible={paymentPickerOpen}
        selectedId={selectedPayment.id}
        onSelect={method => { setSelectedPayment(method); setPaymentPickerOpen(false); }}
        onClose={() => setPaymentPickerOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    borderBottomWidth: 1,
  },
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
  badge: {
    paddingHorizontal: 9,
    paddingVertical:   2,
    borderRadius:      20,
  },
  badgeText: { color: "#fff" },

  // Progress steps
  stepsRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 20,
    paddingBottom:     14,
    paddingTop:        4,
  },
  stepNode: {
    alignItems: "center",
    gap:        4,
  },
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
    flex:   1,
    height: 1.5,
    marginBottom: 14,
  },

  // Scroll
  scroll: {
    padding: 16,
    gap:     14,
  },

  // Section label above store rows
  sectionBlock: { gap: 10 },
  sectionLabel: {},

  // Delivery note card
  noteCard: {
    borderRadius: 14,
    borderWidth:  1,
    padding:      14,
    gap:          10,
  },
  noteTitleRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           7,
  },
  noteTitle:    {},
  noteOptional: {},
  noteInput: {
    borderWidth:   1,
    borderRadius:  10,
    padding:       12,
    minHeight:     72,
    textAlignVertical: "top",
  },
  noteCount: { textAlign: "right" },

  // Trust card
  trustCard: {
    borderRadius: 14,
    borderWidth:  1,
    padding:      14,
    gap:          10,
  },
  trustRow: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           8,
  },
  trustText: { flex: 1, lineHeight: 17 },

  // Terms
  terms: {
    textAlign:  "center",
    lineHeight: 18,
  },

  // Sticky CTA bar
  ctaBar: {
    position:        "absolute",
    bottom:          0,
    left:            0,
    right:           0,
    borderTopWidth:  1,
  },
  ctaContent: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    paddingVertical:   12,
    gap:               12,
  },
  ctaTotal: {},
  ctaSub:   {},
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
