// ============================================================
// ORDER QR HANDSHAKE SCREEN — Apana Store (Customer App)
//
// Shown immediately after placing an order. The customer
// presents this QR code to complete the handshake:
//
//   Pickup   → Show to store counter staff to collect order
//   Delivery → Show to delivery partner at the door
//   Ride     → Show to rider to start the ride
//
// Params (from checkout.tsx):
//   mode    — "pickup" | "delivery" | "ride"
//   orderId — server-generated ID (or mock-generated here)
//   total   — order total in ₹
//   stores  — number of stores in this order
//
// Layout:
//   Header: back + mode badge + share icon
//   Mode banner: colored strip with mode title + subtitle
//   OrderQrCode: actual QR code card (tap to brighten)
//   OrderQrStatus: animated status timeline
//   OrderQrInstructions: numbered step guide
//   OrderQrSummary: order details + expiry
//   Bottom bar: "View Orders" CTA
// ============================================================

import React, { useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

import { FulfillmentMode, FULFILLMENT_CONFIG } from "../../data/cartData";
import { ORDER_QR_CONFIG, generateOrderId } from "../../data/orderQrData";

import OrderQrCode         from "../../components/order-qr/OrderQrCode";
import OrderQrStatus       from "../../components/order-qr/OrderQrStatus";
import OrderQrInstructions from "../../components/order-qr/OrderQrInstructions";
import OrderQrSummary      from "../../components/order-qr/OrderQrSummary";

export default function OrderQrScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();

  // ── Params from checkout ──────────────────────────────────
  const {
    mode:     modeParam,
    orderId:  orderIdParam,
    total:    totalParam,
    stores:   storesParam,
  } = useLocalSearchParams<{
    mode?:    string;
    orderId?: string;
    total?:   string;
    stores?:  string;
  }>();

  const mode       = (modeParam  ?? "delivery") as FulfillmentMode;
  const totalAmt   = parseInt(totalParam  ?? "0", 10);
  const storeCount = parseInt(storesParam ?? "1", 10);

  // ── Generate order ID if backend hasn't provided one yet ──
  const orderId = useMemo(() => orderIdParam ?? generateOrderId(), [orderIdParam]);

  // ── Timestamp when this screen was opened (= order placed) ─
  const placedAt = useMemo(() => new Date(), []);

  const cfg      = ORDER_QR_CONFIG[mode];
  const modeCfg  = FULFILLMENT_CONFIG[mode];

  // ── Share order details ───────────────────────────────────
  async function handleShare() {
    await Share.share({
      title:   `Apana Store Order — ${orderId}`,
      message: `My ${modeCfg.label} order from Apana Store.\nOrder ID: ${orderId}\nTotal: ₹${totalAmt}\n\nTrack with the Apana Store app.`,
    });
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={modeCfg.color} />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: modeCfg.color }]} edges={["top"]}>
        <View style={styles.headerRow}>
          {/* Back */}
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => router.replace("/(tabs)")}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
              {cfg.title}
            </Text>
            {/* Mode badge */}
            <View style={[styles.modeBadge, { backgroundColor: "rgba(255,255,255,0.20)" }]}>
              <Ionicons name={modeCfg.icon as any} size={11} color="#fff" />
              <Text style={[styles.modeBadgeText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
                {modeCfg.label}
              </Text>
            </View>
          </View>

          {/* Share */}
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ── Scrollable content ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Mode subtitle ── */}
        <View style={[styles.subtitleCard, { backgroundColor: modeCfg.color + "14", borderColor: modeCfg.color + "30" }]}>
          <Ionicons name="shield-checkmark-outline" size={16} color={modeCfg.color} />
          <Text style={[styles.subtitle, { color: modeCfg.color, fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm }]}>
            {cfg.subtitle}
          </Text>
        </View>

        {/* ── QR Code ── */}
        <OrderQrCode
          orderId={orderId}
          mode={mode}
          modeColor={modeCfg.color}
          qrLabel={cfg.qrLabel}
        />

        {/* ── Status timeline ── */}
        <OrderQrStatus
          steps={cfg.steps}
          activeStep={cfg.activeStep}
          modeColor={modeCfg.color}
        />

        {/* ── How it works instructions ── */}
        <OrderQrInstructions
          instructions={cfg.instructions}
          modeColor={modeCfg.color}
          modeIcon={modeCfg.icon}
        />

        {/* ── Order summary ── */}
        <OrderQrSummary
          mode={mode}
          storeCount={storeCount}
          totalAmount={totalAmt}
          validityHours={cfg.validityHours}
          placedAt={placedAt}
        />

        {/* Spacer for sticky bottom bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Sticky bottom bar ── */}
      <SafeAreaView
        style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}
        edges={["bottom"]}
      >
        <View style={styles.bottomContent}>
          {/* View Orders */}
          <TouchableOpacity
            style={[styles.ordersBtn, { borderColor: colors.border }]}
            onPress={() => router.push("/order-history")}
            activeOpacity={0.8}
          >
            <Ionicons name="receipt-outline" size={16} color={colors.text} />
            <Text style={[styles.ordersBtnText, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
              View Orders
            </Text>
          </TouchableOpacity>

          {/* Done / Back to Home */}
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: modeCfg.color }]}
            onPress={() => router.replace("/(tabs)")}
            activeOpacity={0.85}
          >
            <Ionicons name="home-outline" size={16} color="#fff" />
            <Text style={[styles.doneBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1 },

  // Header (mode-coloured background)
  header: {},
  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 12,
    paddingVertical:   12,
    gap:               8,
  },
  headerBtn: {
    width:          40,
    height:         40,
    borderRadius:   12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems:     "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex:       1,
    alignItems: "center",
    gap:        4,
  },
  headerTitle: { color: "#fff" },
  modeBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 10,
    paddingVertical:   3,
    borderRadius:      20,
  },
  modeBadgeText: { color: "#fff" },

  // Scroll
  scroll: {
    padding: 16,
    gap:     16,
  },

  // Subtitle banner
  subtitleCard: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               8,
    padding:           14,
    borderRadius:      14,
    borderWidth:       1,
  },
  subtitle: { flex: 1, lineHeight: 20 },

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
  ordersBtn: {
    flex:              1,
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               7,
    paddingVertical:   13,
    borderRadius:      14,
    borderWidth:       1,
  },
  ordersBtnText: {},
  doneBtn: {
    flex:              1,
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               7,
    paddingVertical:   13,
    borderRadius:      14,
  },
  doneBtnText: { color: "#fff" },
});
