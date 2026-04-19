// ============================================================
// ORDER TRACKING SCREEN — Apana Store (Customer App)
//
// Step 4 of 4 in checkout flow: Cart → Review → Payment → Track
//
// Shows:
//   Progress steps (Track step active)
//   Mappls live map placeholder (animated partner dot)
//   ETA card (big minutes remaining)
//   Status steps stepper (current step highlighted + pulsing)
//   Partner card (name, vehicle, rating, call/chat)
//   Order summary (items count + stores + total)
//
// Route: /order-tracking?orderId=...&mode=...&total=...
//
// Backend:
//   GET /customer/orders/:orderId/tracking  (polling)
//   WS  /ws/tracking/:orderId               (live socket)
// ============================================================

import React, { useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from "react-native";
import { SafeAreaView }          from "react-native-safe-area-context";
import { Ionicons }              from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import useTheme                  from "../../theme/useTheme";
import { typography }            from "../../theme/typography";
import { FulfillmentMode }       from "../../data/cartData";
import { CHECKOUT_STEPS }        from "../../data/checkoutData";
import {
  TRACKING_STEPS, MOCK_ACTIVE_STEP, MOCK_ETA,
  MOCK_PARTNERS, TRACKING_MODE_CONFIG,
} from "../../data/orderTrackingData";

import TrackingProgress         from "../../components/order-tracking/TrackingProgress";
import TrackingMapPlaceholder   from "../../components/order-tracking/TrackingMapPlaceholder";
import TrackingPartnerCard      from "../../components/order-tracking/TrackingPartnerCard";
import TrackingEtaCard          from "../../components/order-tracking/TrackingEtaCard";

// ── Progress step bar — reused from checkout.tsx ──────────────
const ACTIVE_STEP = "track";

export default function OrderTrackingScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();

  const {
    orderId          = "APX-MOCK-001",
    mode:  modeParam = "delivery",
    total            = "0",
    storeOrdersJson  = "",
  } = useLocalSearchParams<{
    orderId?:         string;
    mode?:            string;
    total?:           string;
    storeOrdersJson?: string;
  }>();

  const mode    = modeParam as FulfillmentMode;
  const totalAmt= parseFloat(total);

  // ── QR navigation — forwards storeOrdersJson to QR screen ──
  function handleShowQR() {
    router.push(
      `/order-qr?mode=${mode}&orderId=${orderId}&total=${total}&storeOrdersJson=${storeOrdersJson}`,
    );
  }

  const cfg     = TRACKING_MODE_CONFIG[mode];
  const steps   = TRACKING_STEPS[mode];
  const activeStep = MOCK_ACTIVE_STEP[mode];
  const eta     = MOCK_ETA[mode];
  const partner = MOCK_PARTNERS[mode];

  // ── Resolve progress step indices ───────────────────────────
  const activeProgressIdx = useMemo(
    () => CHECKOUT_STEPS.findIndex(s => s.key === ACTIVE_STEP),
    [],
  );

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
            {cfg.actionLabel}
          </Text>

          {/* Help button */}
          <TouchableOpacity
            style={[styles.helpBtn, { backgroundColor: colors.background }]}
            onPress={() => router.push("/help-support")}
            activeOpacity={0.75}
          >
            <Ionicons name="help-circle-outline" size={20} color={colors.subText} />
          </TouchableOpacity>
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
        showsVerticalScrollIndicator={false}
      >
        {/* ── Big ETA card ── */}
        <TrackingEtaCard
          mode={mode}
          minutes={eta.minutes}
          label={eta.label}
          orderId={orderId}
          total={totalAmt}
        />

        {/* ── Live map placeholder ── */}
        <TrackingMapPlaceholder
          mode={mode}
          etaMinutes={eta.minutes}
          partnerInitials={partner.initials}
          partnerColor={partner.avatarColor}
        />

        {/* ── Status steps ── */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            Order Status
          </Text>
          <TrackingProgress steps={steps} activeStep={activeStep} />
        </View>

        {/* ── Partner card ── */}
        <TrackingPartnerCard partner={partner} mode={mode} />

        {/* ── Help row ── */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
            onPress={() => router.push("/help-support")}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubble-outline" size={16} color={colors.primary} />
            <Text style={[styles.secondaryBtnText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
              Help
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" }]}
            onPress={() => router.push("/order-history")}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
            <Text style={[styles.secondaryBtnText, { color: "#EF4444", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
              Cancel Order
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── Sticky QR CTA — always visible so customer can show QR anytime ── */}
      <SafeAreaView
        style={[styles.qrBar, { backgroundColor: cfg.color }]}
        edges={["bottom"]}
      >
        <TouchableOpacity
          style={styles.qrBarInner}
          onPress={handleShowQR}
          activeOpacity={0.85}
        >
          <View style={[styles.qrIconCircle, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Ionicons name="qr-code-outline" size={22} color="#fff" />
          </View>
          <View style={styles.qrBarText}>
            <Text style={[styles.qrBarTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              {mode === "pickup" ? "Show Pickup QR at Counter" :
               mode === "ride"   ? "Show Ride QR to Driver"   :
                                   "Show QR for Delivery"}
            </Text>
            <Text style={[styles.qrBarSub, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              Tap to open your verification QR code
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
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
  helpBtn: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },
  headerTitle: { flex: 1 },

  // Progress steps
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
  content: {
    padding: 16,
    gap:     14,
  },

  card: {
    borderRadius: 16,
    borderWidth:  1,
    padding:      16,
    gap:          14,
  },
  cardTitle: {},

  actionRow: {
    flexDirection: "row",
    gap:           12,
  },
  secondaryBtn: {
    flex:              1,
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               7,
    paddingVertical:   13,
    borderRadius:      14,
    borderWidth:       1,
  },
  secondaryBtnText: {},

  bottomSpacer: { height: 100 },

  // Sticky QR bar
  qrBar: {},
  qrBarInner: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    paddingHorizontal: 16,
    paddingVertical:   14,
  },
  qrIconCircle: {
    width:          48,
    height:         48,
    borderRadius:   14,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  qrBarText: { flex: 1, gap: 2 },
  qrBarTitle: { color: "#fff" },
  qrBarSub:   { color: "rgba(255,255,255,0.75)" },
});
