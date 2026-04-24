// ============================================================
// ORDER TRACKING SCREEN — Apana Store (Customer App)
//
// Step 4 of 4 in checkout flow: Cart → Review → Payment → Track
//
// Flow split by mode:
//
//   PICKUP — flexible multi-store sequence
//     Customer reorders stores via ↑↓ arrows, taps "QR" on any
//     pending row → /order-qr (single store) → /order-collected
//     → router.replace back to here with that storeId added to
//     `visitedJson`. Repeats until all stores collected. Then
//     "Order Complete" CTA → home.
//
//   DELIVERY / RIDE — single combined QR
//     Sticky bottom bar with one "Show QR" button → /order-qr
//     (combined) → /order-collected → home.
//
// Route params:
//   mode             — "pickup" | "delivery" | "ride"
//   orderId          — master order ID
//   total            — grand total ₹
//   storeOrdersJson  — full StoreOrderResult[] (URL-encoded JSON)
//   visitedJson      — JSON array of collected storeIds (default [])
//   sequenceJson     — JSON array of storeIds in customer order
//                      (default = original order from checkout)
//
// Backend:
//   GET /customer/orders/:orderId/tracking  (polling)
//   WS  /ws/tracking/:orderId               (live socket)
// ============================================================

import React, { useMemo, useCallback } from "react";
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
import { StoreOrderResult }      from "../../services/checkoutService";
import { CHECKOUT_STEPS }        from "../../data/checkoutData";
import {
  TRACKING_STEPS, MOCK_ACTIVE_STEP, MOCK_ETA,
  MOCK_PARTNERS, TRACKING_MODE_CONFIG,
} from "../../data/orderTrackingData";

import TrackingProgress         from "../../components/order-tracking/TrackingProgress";
import TrackingMapPlaceholder   from "../../components/order-tracking/TrackingMapPlaceholder";
import TrackingPartnerCard      from "../../components/order-tracking/TrackingPartnerCard";
import TrackingEtaCard          from "../../components/order-tracking/TrackingEtaCard";
import PickupStoreList          from "../../components/order-tracking/PickupStoreList";

const ACTIVE_STEP = "track";

export default function OrderTrackingScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();

  const {
    orderId          = "APX-MOCK-001",
    mode:  modeParam = "delivery",
    total            = "0",
    storeOrdersJson  = "",
    visitedJson      = "",
    sequenceJson     = "",
  } = useLocalSearchParams<{
    orderId?:         string;
    mode?:            string;
    total?:           string;
    storeOrdersJson?: string;
    visitedJson?:     string;
    sequenceJson?:    string;
  }>();

  const mode    = modeParam as FulfillmentMode;
  const totalAmt= parseFloat(total);

  // ── Parse storeOrders (expo-router already URL-decoded) ─────
  const storeOrdersRaw = useMemo<StoreOrderResult[]>(() => {
    if (!storeOrdersJson) return [];
    try { return JSON.parse(storeOrdersJson); }
    catch { return []; }
  }, [storeOrdersJson]);

  // ── Parse visited set ───────────────────────────────────────
  const visitedIds = useMemo<Set<string>>(() => {
    if (!visitedJson) return new Set();
    try { return new Set(JSON.parse(visitedJson) as string[]); }
    catch { return new Set(); }
  }, [visitedJson]);

  // ── Parse customer-defined sequence (storeId order) ─────────
  // Default sequence = original storeOrders order.
  const sequence = useMemo<string[]>(() => {
    if (sequenceJson) {
      try { return JSON.parse(sequenceJson) as string[]; }
      catch { /* fall through */ }
    }
    return storeOrdersRaw.map(s => s.storeId);
  }, [sequenceJson, storeOrdersRaw]);

  // ── Apply sequence to storeOrders → ordered list ────────────
  const orderedStores = useMemo<StoreOrderResult[]>(() => {
    const byId = new Map(storeOrdersRaw.map(s => [s.storeId, s]));
    const out: StoreOrderResult[] = [];
    sequence.forEach(id => { const s = byId.get(id); if (s) out.push(s); });
    // Append any storeOrders not in sequence (defensive against stale params)
    storeOrdersRaw.forEach(s => { if (!sequence.includes(s.storeId)) out.push(s); });
    return out;
  }, [storeOrdersRaw, sequence]);

  // ── Pickup completion check ─────────────────────────────────
  const isPickup     = mode === "pickup";
  const allCollected = isPickup
    && orderedStores.length > 0
    && orderedStores.every(s => visitedIds.has(s.storeId));

  // ── Reorder handler: swap two adjacent rows ─────────────────
  // Encodes the new sequence into the URL via router.replace so
  // it survives screen re-mounts (e.g. coming back from order-qr).
  const handleReorder = useCallback((from: number, to: number) => {
    if (from === to) return;
    const next = orderedStores.map(s => s.storeId);
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    router.replace(buildTrackingUrl({
      mode, orderId, total,
      storeOrdersJson, visitedJson,
      sequenceJson: JSON.stringify(next),
    }) as any);
  }, [orderedStores, mode, orderId, total, storeOrdersJson, visitedJson, router]);

  // ── Show QR handler — hands a single store to /order-qr ────
  // Pass full storeOrdersJson + visitedJson + sequenceJson through
  // so order-collected can navigate back here with the new visited
  // entry merged in.
  const handleShowQR = useCallback((store: StoreOrderResult) => {
    const single = encodeURIComponent(JSON.stringify([store]));
    const ctx    = encodeURIComponent(storeOrdersJson || "[]");
    const vis    = encodeURIComponent(visitedJson || "[]");
    const seq    = encodeURIComponent(sequenceJson || JSON.stringify(orderedStores.map(s => s.storeId)));
    router.push(
      `/order-qr?mode=${mode}&orderId=${orderId}&total=${total}` +
      `&storeOrdersJson=${single}` +
      `&trackingStoreOrdersJson=${ctx}` +
      `&trackingVisitedJson=${vis}` +
      `&trackingSequenceJson=${seq}`,
    );
  }, [mode, orderId, total, storeOrdersJson, visitedJson, sequenceJson, orderedStores, router]);

  // ── Show QR handler for delivery / ride (single combined QR) ─
  const handleShowCombinedQR = useCallback(() => {
    const ctx = encodeURIComponent(storeOrdersJson || "[]");
    router.push(
      `/order-qr?mode=${mode}&orderId=${orderId}&total=${total}&storeOrdersJson=${ctx}`,
    );
  }, [mode, orderId, total, storeOrdersJson, router]);

  const cfg     = TRACKING_MODE_CONFIG[mode];
  const steps   = TRACKING_STEPS[mode];
  const activeStep = MOCK_ACTIVE_STEP[mode];
  const eta     = MOCK_ETA[mode];
  const partner = MOCK_PARTNERS[mode];

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
                    isDone   && { backgroundColor: colors.success, borderColor: colors.success },
                    !isActive && !isDone && { borderColor: colors.border },
                  ]}>
                    {isDone
                      ? <Ionicons name="checkmark" size={11} color="#fff" />
                      : <Ionicons name={step.icon as any} size={11} color={isActive ? "#fff" : colors.subText} />
                    }
                  </View>
                  <Text style={[styles.stepLabel, {
                    color:      isActive ? colors.primary : isDone ? colors.success : colors.subText,
                    fontFamily: isActive ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                    fontSize:   typography.size.ss,
                  }]}>
                    {step.label}
                  </Text>
                </View>
                {idx < CHECKOUT_STEPS.length - 1 && (
                  <View style={[styles.stepLine, { backgroundColor: isDone ? colors.success : colors.border }]} />
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

        {/* ── Live map ── */}
        <TrackingMapPlaceholder
          mode={mode}
          etaMinutes={eta.minutes}
          partnerInitials={partner.initials}
          partnerColor={partner.avatarColor}
        />

        {/* ── Pickup-only: reorderable store list ── */}
        {isPickup && orderedStores.length > 0 && (
          <PickupStoreList
            stores={orderedStores}
            visitedIds={visitedIds}
            onReorder={handleReorder}
            onShowQR={handleShowQR}
          />
        )}

        {/* ── Status steps (delivery + ride) ── */}
        {!isPickup && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              Order Status
            </Text>
            <TrackingProgress steps={steps} activeStep={activeStep} />
          </View>
        )}

        {/* ── Partner card (delivery + ride) ── */}
        {!isPickup && <TrackingPartnerCard partner={partner} mode={mode} />}

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
            style={[styles.secondaryBtn, { borderColor: colors.danger + "60", backgroundColor: colors.danger + "10" }]}
            onPress={() => router.push("/order-history")}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle-outline" size={16} color={colors.danger} />
            <Text style={[styles.secondaryBtnText, { color: colors.danger, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
              Cancel Order
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── Sticky bottom bar ── */}
      {/*
        For PICKUP we surface "Done — Back to Home" once all stores
        are collected. While stores are pending, the per-row "QR"
        button is the call-to-action — no sticky bar needed.

        For DELIVERY + RIDE we keep the single combined-QR sticky
        button (unchanged behaviour from before this refactor).
      */}
      {isPickup && allCollected && (
        <SafeAreaView
          style={[styles.qrBar, { backgroundColor: colors.success }]}
          edges={["bottom"]}
        >
          <TouchableOpacity
            style={styles.qrBarInner}
            onPress={() => router.replace("/(tabs)" as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.qrIconCircle, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
            </View>
            <View style={styles.qrBarText}>
              <Text style={[styles.qrBarTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                Order Complete
              </Text>
              <Text style={[styles.qrBarSub, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                All {orderedStores.length} stores collected — tap to go home
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>
        </SafeAreaView>
      )}

      {!isPickup && (
        <SafeAreaView
          style={[styles.qrBar, { backgroundColor: cfg.color }]}
          edges={["bottom"]}
        >
          <TouchableOpacity
            style={styles.qrBarInner}
            onPress={handleShowCombinedQR}
            activeOpacity={0.85}
          >
            <View style={[styles.qrIconCircle, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <Ionicons name="qr-code-outline" size={22} color="#fff" />
            </View>
            <View style={styles.qrBarText}>
              <Text style={[styles.qrBarTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                {mode === "ride" ? "Show Ride QR to Driver" : "Show QR for Delivery"}
              </Text>
              <Text style={[styles.qrBarSub, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                Tap to open your verification QR code
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </View>
  );
}

// ── URL builder for self-replace navigations (reorder + visited merge) ──
// Keeps the order-tracking deep link canonical — every consumer
// uses this helper so we never drift on param names.
export function buildTrackingUrl(opts: {
  mode:             string;
  orderId:          string;
  total:            string;
  storeOrdersJson:  string;          // already JSON-encoded (NOT URL-encoded)
  visitedJson:      string;          // already JSON-encoded
  sequenceJson?:    string;          // already JSON-encoded
}): string {
  const enc = (s: string) => encodeURIComponent(s);
  let url =
    `/order-tracking?mode=${opts.mode}` +
    `&orderId=${opts.orderId}` +
    `&total=${opts.total}` +
    `&storeOrdersJson=${enc(opts.storeOrdersJson || "[]")}` +
    `&visitedJson=${enc(opts.visitedJson || "[]")}`;
  if (opts.sequenceJson) url += `&sequenceJson=${enc(opts.sequenceJson)}`;
  return url;
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

  // Sticky bottom bar
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
  qrBarText:  { flex: 1, gap: 2 },
  qrBarTitle: { color: "#fff" },
  qrBarSub:   { color: "rgba(255,255,255,0.75)" },
});
