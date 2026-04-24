// ============================================================
// ORDER COLLECTED SCREEN — Apana Store
//
// Shown immediately after the QR handshake succeeds.
// The store staff / delivery partner has scanned the customer's
// order QR code — this screen confirms the handover is complete.
//
// Route: /order-collected?orderId=...&storeOrderId=...&mode=...&total=...&storeName=...
//
// Three states:
//   pickup   → "Order Collected!" (store counter pickup)
//   delivery → "Order Picked Up!" (delivery partner collected)
//   ride     → "Ride Started!"    (rider confirmed the trip)
// ============================================================

import React, { useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { FulfillmentMode, FULFILLMENT_CONFIG } from "../../data/cartData";
import {
  COLLECTED_CONFIG, MOCK_AGENTS,
} from "../../data/orderCollectedData";
import { StoreOrderResult } from "../../services/checkoutService";

import HandshakeHero    from "../../components/order-collected/HandshakeHero";
import HandshakeDetails from "../../components/order-collected/HandshakeDetails";
import HandshakeRating  from "../../components/order-collected/HandshakeRating";

export default function OrderCollectedScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();

  // ── Params ────────────────────────────────────────────────
  // For pickup we receive a "tracking context" trio so we can
  // navigate back to /order-tracking with the just-collected
  // storeId merged into `visitedJson`. If `trackingStoreOrdersJson`
  // is absent we fall back to "Back to Home".
  const {
    orderId:                  orderIdParam,
    storeOrderId:             storeOrderIdParam,
    storeId:                  storeIdParam,
    mode:                     modeParam,
    total:                    totalParam,
    storeName:                storeNameParam,
    trackingStoreOrdersJson:  trackingStoreOrdersParam = "",
    trackingVisitedJson:      trackingVisitedParam     = "",
    trackingSequenceJson:     trackingSequenceParam    = "",
  } = useLocalSearchParams<{
    orderId?:                  string;
    storeOrderId?:             string;
    storeId?:                  string;
    mode?:                     string;
    total?:                    string;
    storeName?:                string;
    trackingStoreOrdersJson?:  string;
    trackingVisitedJson?:      string;
    trackingSequenceJson?:     string;
  }>();

  const mode         = (modeParam ?? "pickup") as FulfillmentMode;
  const orderId      = orderIdParam      ?? "APX000001";
  // storeOrderId and storeId are set for pickup (per-store handshake), null for delivery/ride
  const storeOrderId = storeOrderIdParam ?? null;
  const storeId      = storeIdParam      ?? null;
  const storeName    = storeNameParam    ? decodeURIComponent(storeNameParam) : null;
  const totalAmt     = parseInt(totalParam ?? "0", 10);

  const cfg      = COLLECTED_CONFIG[mode];
  const modeCfg  = FULFILLMENT_CONFIG[mode];
  const agent    = MOCK_AGENTS[mode];

  // ── Tracking context — drives "Next Store" vs "Back to Home" ──
  // Parse the full store list + previously-visited set we received.
  // After this collection, we add `storeId` to visited and pass
  // everything back to /order-tracking so the customer can resume.
  const allStores = useMemo<StoreOrderResult[]>(() => {
    if (!trackingStoreOrdersParam) return [];
    try { return JSON.parse(trackingStoreOrdersParam); }
    catch { return []; }
  }, [trackingStoreOrdersParam]);

  const previouslyVisited = useMemo<string[]>(() => {
    if (!trackingVisitedParam) return [];
    try { return JSON.parse(trackingVisitedParam) as string[]; }
    catch { return []; }
  }, [trackingVisitedParam]);

  // Merge this store into visited (idempotent — Set dedupes)
  const updatedVisited = useMemo<string[]>(() => {
    if (!storeId) return previouslyVisited;
    const set = new Set(previouslyVisited);
    set.add(storeId);
    return Array.from(set);
  }, [previouslyVisited, storeId]);

  const remainingCount = mode === "pickup"
    ? allStores.filter(s => !updatedVisited.includes(s.storeId)).length
    : 0;
  const hasNextStore = mode === "pickup" && remainingCount > 0;

  // Freeze timestamp to mount time
  const scannedAt = useMemo(() => new Date(), []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* ── Minimal top header ────────────────────────────────── */}
      <SafeAreaView style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <View style={styles.headerRow}>

          {/* Home shortcut */}
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: colors.background }]}
            onPress={() => router.replace("/(tabs)")}
            activeOpacity={0.75}
          >
            <Ionicons name="home-outline" size={20} color={colors.text} />
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            {cfg.title}
          </Text>

          {/* Mode badge */}
          <View style={[styles.modeBadge, { backgroundColor: cfg.heroColor + "18", borderColor: cfg.heroColor + "40" }]}>
            <Ionicons name={modeCfg.icon as any} size={12} color={cfg.heroColor} />
            <Text style={[styles.modeBadgeText, { color: cfg.heroColor, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
              {modeCfg.label}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* ── Scrollable content ───────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Animated hero ── */}
        <HandshakeHero
          icon={cfg.heroIcon}
          color={cfg.heroColor}
          bg={cfg.heroBg}
          title={cfg.title}
          subtitle={storeName ? `${cfg.subtitle.split(".")[0]} at ${storeName}.` : cfg.subtitle}
        />

        {/* ── Handshake details (agent + metadata) ── */}
        <HandshakeDetails
          agent={agent}
          agentLabel={cfg.agentLabel}
          orderId={orderId}
          modeLabel={modeCfg.label}
          modeColor={cfg.heroColor}
          scannedAt={scannedAt}
        />

        {/* ── Order total summary strip ── */}
        {totalAmt > 0 && (
          <View style={[styles.totalCard, { backgroundColor: cfg.heroColor + "12", borderColor: cfg.heroColor + "30" }]}>
            <Ionicons name="wallet-outline" size={18} color={cfg.heroColor} />
            <Text style={[styles.totalLabel, { color: cfg.heroColor, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
              Total paid
            </Text>
            <Text style={[styles.totalAmt, { color: cfg.heroColor, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
              ₹{totalAmt}
            </Text>
          </View>
        )}

        {/* ── Rate experience ── */}
        <HandshakeRating
          agentName={agent.name}
          agentRole={agent.role}
          modeColor={cfg.heroColor}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── Sticky bottom action bar ─────────────────────────── */}
      <SafeAreaView
        style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}
        edges={["bottom"]}
      >
        <View style={styles.bottomContent}>

          {/* Secondary: View Invoice — per-store (pickup) or master order (delivery/ride) */}
          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.border }]}
            onPress={() => {
              // storeId guarantees the correct store name in the invoice mock/backend
              const idPart = storeOrderId
                ? `storeOrderId=${storeOrderId}`
                : `orderId=${orderId}`;
              const sid = storeId ? `&storeId=${storeId}` : "";
              router.push(`/invoice?${idPart}${sid}` as any);
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text-outline" size={16} color={colors.text} />
            <Text style={[styles.secondaryText, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
              View Invoice
            </Text>
          </TouchableOpacity>

          {/* Primary CTA — back to /order-tracking with merged visited
               set (pickup), else "Back to Home" (delivery / ride / done). */}
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: cfg.heroColor }]}
            onPress={() => {
              if (mode === "pickup" && allStores.length > 0) {
                // Always return to tracking — even if all stores are
                // collected — so the customer sees the "Order Complete"
                // state with all rows ✓ before going home.
                const so  = encodeURIComponent(trackingStoreOrdersParam || "[]");
                const vis = encodeURIComponent(JSON.stringify(updatedVisited));
                const seq = trackingSequenceParam
                  ? `&sequenceJson=${encodeURIComponent(trackingSequenceParam)}`
                  : "";
                router.replace(
                  `/order-tracking?mode=pickup&orderId=${orderId}&total=${totalAmt}` +
                  `&storeOrdersJson=${so}&visitedJson=${vis}${seq}` as any,
                );
              } else {
                router.replace("/(tabs)");
              }
            }}
            activeOpacity={0.85}
          >
            <Ionicons name={hasNextStore ? "navigate-outline" : "home-outline"} size={16} color="#fff" />
            <Text style={[styles.primaryText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              {hasNextStore
                ? `Next Store (${remainingCount} left)`
                : mode === "pickup" && allStores.length > 0
                  ? "All Collected — View Order"
                  : "Back to Home"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: { borderBottomWidth: 1 },
  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 12,
    paddingVertical:   10,
    gap:               10,
  },
  headerBtn: {
    width:          38,
    height:         38,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  headerTitle: { flex: 1, textAlign: "center" },
  modeBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 9,
    paddingVertical:   4,
    borderRadius:      20,
    borderWidth:       1,
    flexShrink:        0,
  },
  modeBadgeText: {},

  // Scroll
  scroll: {
    padding:    16,
    gap:        14,
    paddingBottom: 20,
  },

  // Total strip
  totalCard: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    padding:           16,
    borderRadius:      16,
    borderWidth:       1,
  },
  totalLabel: { flex: 1 },
  totalAmt:   {},

  bottomSpacer: { height: 70 },

  // Bottom bar
  bottomBar: {
    position:       "absolute",
    bottom:         0,
    left:           0,
    right:          0,
    borderTopWidth: 1,
  },
  bottomContent: {
    flexDirection:     "row",
    gap:               10,
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  secondaryBtn: {
    flex:            1,
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             7,
    paddingVertical: 13,
    borderRadius:    14,
    borderWidth:     1,
  },
  secondaryText: {},
  primaryBtn: {
    flex:            1,
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             7,
    paddingVertical: 13,
    borderRadius:    14,
  },
  primaryText: { color: "#fff" },
});
