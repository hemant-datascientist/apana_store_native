// ============================================================
// CHECKOUT SCREEN — Apana Store (Customer App)
//
// Receives `mode` query param (pickup | delivery | ride) from
// the cart screen. Only shows stores whose fulfillment matches
// that mode — keeping each order type completely separate.
//
// Sections (top → bottom):
//   Progress Steps         — Cart → Review → Payment → Track
//   Mode banner            — coloured strip showing current mode
//   Delivery Address Card  — only shown for delivery/ride modes
//   Order Summary          — per-store collapsible rows (filtered)
//   Promo Code             — coupon entry; validatePromoCode() stub
//   Delivery Notes         — optional note to the partner/store
//   Payment Method Card    — selected method + change modal
//   Price Breakdown        — subtotal, delivery, discount, total
//   Place Order CTA        — sticky bottom bar
//
// Backend:
//   POST /api/orders → PlaceOrderResponse
//   POST /api/promo/validate → PromoValidateResponse
//   (see services/checkoutService.ts for typed interfaces + stubs)
// ============================================================

import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

import {
  DELIVERY_FEE, FulfillmentMode, FULFILLMENT_CONFIG,
  CartStore,
} from "../../data/cartData";
import { useCart } from "../../context/CartContext";
import { SAVED_ADDRESSES, UserAddress } from "../../data/addressData";
import { CHECKOUT_STEPS } from "../../data/checkoutData";
import { validatePromoCode } from "../../services/checkoutService";

import CheckoutAddressCard    from "../../components/checkout/CheckoutAddressCard";
import CheckoutAddressPicker  from "../../components/checkout/CheckoutAddressPicker";
import CheckoutStoreRow       from "../../components/checkout/CheckoutStoreRow";
import CheckoutPriceBreakdown from "../../components/checkout/CheckoutPriceBreakdown";
import CheckoutPromoInput     from "../../components/checkout/CheckoutPromoInput";

export default function CheckoutScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();

  // ── Fulfillment mode passed from the cart screen ──────────
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const mode = (modeParam ?? "delivery") as FulfillmentMode;

  // ── Cart from shared context — same state as CartScreen ───
  // Filtering by mode means only stores the user chose THIS mode
  // for are included; changes made on the cart page are reflected.
  const { cart: fullCart } = useCart();
  const cart = useMemo<CartStore[]>(
    () => fullCart.filter(s => s.fulfillment === mode),
    [fullCart, mode],
  );

  const modeCfg = FULFILLMENT_CONFIG[mode];

  // Pickup orders don't need a delivery address
  const needsAddress = mode !== "pickup";

  // ── UI state ──────────────────────────────────────────────
  const [selectedAddress,   setSelectedAddress]   = useState<UserAddress>(SAVED_ADDRESSES[0]);
  const [addressPickerOpen, setAddressPickerOpen] = useState(false);

  const [note, setNote] = useState("");

  // ── Promo code state ──────────────────────────────────────
  const [promoStatus,   setPromoStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [promoMessage,  setPromoMessage]  = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [appliedPromo,  setAppliedPromo]  = useState<string | null>(null);

  // ── Validation error shown before navigating to Payment ─────
  const [orderError, setOrderError] = useState<string | null>(null);

  // ── Derived totals ────────────────────────────────────────
  const { subtotal, deliveryTotal, total, totalItems } = useMemo(() => {
    const sub   = cart.reduce((s, st) => s + st.items.reduce((si, i) => si + i.price * i.qty, 0), 0);
    const del   = cart.reduce((s, st) => s + DELIVERY_FEE[st.fulfillment], 0);
    const items = cart.reduce((s, st) => s + st.items.reduce((si, i) => si + i.qty, 0), 0);
    return {
      subtotal:      sub,
      deliveryTotal: del,
      total:         Math.max(0, sub + del - promoDiscount),
      totalItems:    items,
    };
  }, [cart, promoDiscount]);

  // ── Progress: "checkout" step is active ──────────────────
  const ACTIVE_STEP = "checkout";

  // ── Apply promo code — delegates to service stub ─────────
  // validatePromoCode() → POST /api/promo/validate
  async function handleApplyPromo(code: string) {
    setPromoStatus("loading");
    setPromoMessage("");
    try {
      const result = await validatePromoCode({ code, subtotal, mode });
      if (result.valid) {
        setPromoStatus("success");
        setPromoDiscount(result.discountAmt);
        setAppliedPromo(code.toUpperCase());
        setPromoMessage(result.message);
      } else {
        setPromoStatus("error");
        setPromoDiscount(0);
        setAppliedPromo(null);
        setPromoMessage(result.message);
      }
    } catch {
      setPromoStatus("error");
      setPromoMessage("Could not validate promo. Try again.");
    }
  }

  // ── Clear applied promo ───────────────────────────────────
  function handleClearPromo() {
    setPromoStatus("idle");
    setPromoMessage("");
    setPromoDiscount(0);
    setAppliedPromo(null);
  }

  // ── Validate → navigate to Payment screen ────────────────────
  // Payment + order placement happens on the next screen (checkout-payment).
  function handleContinue() {
    setOrderError(null);
    if (cart.length === 0) {
      setOrderError("Your cart is empty for this fulfillment mode.");
      return;
    }
    if (needsAddress && !selectedAddress) {
      setOrderError("Please select a delivery address.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const params = new URLSearchParams({
      mode,
      addressId:  needsAddress ? selectedAddress.id : "",
      promoCode:  appliedPromo ?? "",
      discount:   String(promoDiscount),
      note:       encodeURIComponent(note.trim()),
      total:      String(total),
    });
    router.push(`/checkout-payment?${params.toString()}`);
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
            Checkout
          </Text>

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
                {idx < CHECKOUT_STEPS.length - 1 && (
                  <View style={[styles.stepLine, { backgroundColor: isDone ? "#22C55E" : colors.border }]} />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </SafeAreaView>

      {/* ── Scrollable content ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Error banner — shown when placeOrder() rejects ── */}
        {!!orderError && (
          <View style={[styles.errorBanner, { backgroundColor: "#FEE2E2", borderColor: "#FCA5A5" }]}>
            <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
            <Text style={[styles.errorText, {
              color:      "#DC2626",
              fontFamily: typography.fontFamily.medium,
              fontSize:   typography.size.xs,
            }]}>
              {orderError}
            </Text>
            <TouchableOpacity onPress={() => setOrderError(null)}>
              <Ionicons name="close" size={16} color="#DC2626" />
            </TouchableOpacity>
          </View>
        )}

        {/* ── Fulfillment mode banner ── */}
        <View style={[styles.modeBanner, { backgroundColor: modeCfg.bg }]}>
          <View style={[styles.modeIconCircle, { backgroundColor: modeCfg.color + "22" }]}>
            <Ionicons name={modeCfg.icon as any} size={20} color={modeCfg.color} />
          </View>
          <View>
            <Text style={[styles.modeBannerTitle, { color: modeCfg.color, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              {modeCfg.label} Order
            </Text>
            <Text style={[styles.modeBannerSub, { color: modeCfg.color + "CC", fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {cart.length} store{cart.length > 1 ? "s" : ""} · {totalItems} item{totalItems > 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        {/* ── Delivery address (delivery + ride only) ── */}
        {needsAddress && (
          <CheckoutAddressCard
            address={selectedAddress}
            onChangePress={() => setAddressPickerOpen(true)}
          />
        )}

        {/* ── Pickup info banner ── */}
        {mode === "pickup" && (
          <View style={[styles.pickupNote, { backgroundColor: "#DCFCE7", borderColor: "#16A34A" }]}>
            <Ionicons name="walk-outline" size={18} color="#16A34A" />
            <Text style={[styles.pickupNoteText, { color: "#15803D", fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
              You'll collect your order directly from the store. Show your order QR at the counter.
            </Text>
          </View>
        )}

        {/* ── Order summary — stores for this mode only ── */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            Your Order
          </Text>
          {cart.map(store => (
            <CheckoutStoreRow key={store.id} store={store} />
          ))}
        </View>

        {/* ── Promo code — validatePromoCode() from checkoutService ── */}
        <CheckoutPromoInput
          onApply={handleApplyPromo}
          onClear={handleClearPromo}
          status={promoStatus}
          message={promoMessage}
          discountAmt={promoDiscount}
        />

        {/* ── Delivery / pickup note ── */}
        <View style={[styles.noteCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.noteTitleRow}>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.primary} />
            <Text style={[styles.noteTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              {mode === "pickup" ? "Note to Store" : "Delivery Note"}
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
            placeholder={
              mode === "pickup"
                ? "e.g. Keep ready by 5 PM…"
                : "e.g. Leave at the gate, call on arrival…"
            }
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

        {/* ── Price breakdown — total reflects promo discount ── */}
        <CheckoutPriceBreakdown
          subtotal={subtotal}
          deliveryTotal={deliveryTotal}
          discountAmt={promoDiscount}
          appliedPromo={appliedPromo}
          total={total}
        />

        {/* ── Trust + policy ── */}
        <View style={[styles.trustCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { icon: "shield-checkmark-outline", color: "#16A34A",     text: "All orders verified & secured" },
            { icon: "refresh-outline",          color: colors.primary, text: "Cancel within 2 minutes of placing" },
            { icon: "lock-closed-outline",      color: "#F59E0B",     text: "100% safe payment — UPI, Card, COD" },
          ].map((tip, i) => (
            <View key={i} style={styles.trustRow}>
              <Ionicons name={tip.icon as any} size={14} color={tip.color} />
              <Text style={[styles.trustText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {tip.text}
              </Text>
            </View>
          ))}
        </View>

        <Text style={[styles.terms, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          By placing this order you agree to Apana Store's{" "}
          <Text style={{ color: colors.primary }}>Terms of Service</Text> and{" "}
          <Text style={{ color: colors.primary }}>Privacy Policy</Text>.
        </Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Sticky Place Order CTA ── */}
      <SafeAreaView
        style={[styles.ctaBar, { backgroundColor: modeCfg.color }]}
        edges={["bottom"]}
      >
        <View style={styles.ctaContent}>
          <View>
            <Text style={[styles.ctaTotal, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
              ₹{total}
            </Text>
            <Text style={[styles.ctaSub, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {modeCfg.label} · {cart.length} store{cart.length > 1 ? "s" : ""}
            </Text>
          </View>

          {/* Navigate to Payment screen — order is placed there */}
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Ionicons name="card-outline" size={18} color="#fff" />
            <Text style={[styles.ctaBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              Continue to Payment
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
  badge: {
    paddingHorizontal: 9,
    paddingVertical:   2,
    borderRadius:      20,
  },
  badgeText: { color: "#fff" },

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

  scroll: { padding: 16, gap: 14 },

  // Error banner
  errorBanner: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               8,
    padding:           12,
    borderRadius:      12,
    borderWidth:       1,
  },
  errorText: { flex: 1, lineHeight: 18 },

  // Mode banner
  modeBanner: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    paddingHorizontal: 14,
    paddingVertical:   12,
    borderRadius:      14,
  },
  modeIconCircle: {
    width:          40,
    height:         40,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  modeBannerTitle: {},
  modeBannerSub:   { marginTop: 2 },

  // Pickup note
  pickupNote: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               10,
    padding:           14,
    borderRadius:      14,
    borderWidth:       1,
  },
  pickupNoteText: { flex: 1, lineHeight: 18 },

  // Section
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
    borderWidth:       1,
    borderRadius:      10,
    padding:           12,
    minHeight:         72,
    textAlignVertical: "top",
  },
  noteCount: { textAlign: "right" },

  // Trust
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

  terms: { textAlign: "center", lineHeight: 18 },

  // CTA bar
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
  ctaTotal:   { color: "#fff" },
  ctaSub:     { color: "rgba(255,255,255,0.8)", marginTop: 2 },
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
