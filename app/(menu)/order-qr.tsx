// ============================================================
// ORDER QR HANDSHAKE SCREEN — Apana Store (Customer App)
//
// Shown immediately after placing an order. The customer
// presents this QR code to complete the handshake:
//   Pickup   → Show to store counter staff to collect order
//   Delivery → Show to delivery partner at the door
//   Ride     → Show to rider to start the ride
//
// Share buttons:
//   Share QR Code      — QRShareButton → expo-sharing (PNG image)
//   Share Order as Text — Share.share() with itemised order list
// ============================================================

import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme         from "../../theme/useTheme";
import { typography }   from "../../theme/typography";

import { FulfillmentMode, FULFILLMENT_CONFIG } from "../../data/cartData";
import { ORDER_QR_CONFIG, generateOrderId }    from "../../data/orderQrData";
import { useCart }                             from "../../context/CartContext";

import OrderQrCode         from "../../components/order-qr/OrderQrCode";
import OrderQrStatus       from "../../components/order-qr/OrderQrStatus";
import OrderQrInstructions from "../../components/order-qr/OrderQrInstructions";
import OrderQrSummary      from "../../components/order-qr/OrderQrSummary";
import QRGenerator         from "../../components/qr/QRGenerator";
import QRShareButton       from "../../components/qr/QRShareButton";

export default function OrderQrScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();
  const { cart }           = useCart();

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

  const orderId  = useMemo(() => orderIdParam ?? generateOrderId(), [orderIdParam]);
  const placedAt = useMemo(() => new Date(), []);

  const cfg     = ORDER_QR_CONFIG[mode];
  const modeCfg = FULFILLMENT_CONFIG[mode];

  // ── QR PNG file path — null until QRGenerator finishes ───
  const [qrFilePath, setQrFilePath] = useState<string | null>(null);

  // ── QR payload ────────────────────────────────────────────
  const qrValue = JSON.stringify({
    type:    "apana_order",
    orderId,
    mode,
    ts:      placedAt.getTime(),
  });

  // ── Share order as text — itemised list of what was ordered ──
  // Calculates total directly from cart items so it's never ₹0.
  async function handleShareOrderText() {
    const modeStores = cart.filter(s => s.fulfillment === mode);

    let body = "";
    if (modeStores.length === 0) {
      body =
        `${modeCfg.label} order placed.\n` +
        `Order ID: ${orderId}\n` +
        `Total: ₹${totalAmt}`;
    } else {
      // Build per-store item lines and compute subtotal from cart
      let cartSubtotal = 0;
      const storeLines = modeStores.map(store => {
        const itemLines = store.items.map(i => {
          cartSubtotal += i.price * i.qty;
          return `  • ${i.name} × ${i.qty}  —  ₹${i.price * i.qty}`;
        }).join("\n");
        return `🏪 ${store.name}\n${itemLines}`;
      }).join("\n\n");

      // Use cart-computed total; fall back to URL param if cart is empty
      const displayTotal = cartSubtotal > 0 ? cartSubtotal : totalAmt;

      body =
        `Order ID: ${orderId}\n` +
        `Mode: ${modeCfg.label}\n\n` +
        `${storeLines}\n\n` +
        `────────────────\n` +
        `Total: ₹${displayTotal}\n\n` +
        `Placed via Apana Store`;
    }

    await Share.share({
      title:   `My ${modeCfg.label} Order — Apana Store`,
      message: body,
    });
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={modeCfg.color} />

      {/* ── QRGenerator — hidden PNG builder (not inside Modal) ── */}
      <QRGenerator
        value={qrValue}
        cacheKey={`order-${orderId}`}
        label={`Order ID: ${orderId}`}
        sublabel={`Apana Store · ${modeCfg.label} Order · ₹${totalAmt}`}
        onReady={(path) => setQrFilePath(path)}
        onError={(msg)  => console.warn("[OrderQR] gen error:", msg)}
      />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: modeCfg.color }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => router.replace("/(tabs)")}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
              {cfg.title}
            </Text>
            <View style={[styles.modeBadge, { backgroundColor: "rgba(255,255,255,0.20)" }]}>
              <Ionicons name={modeCfg.icon as any} size={11} color="#fff" />
              <Text style={[styles.modeBadgeText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
                {modeCfg.label}
              </Text>
            </View>
          </View>

          <View style={styles.headerBtn} />
        </View>
      </SafeAreaView>

      {/* ── Scrollable content ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <View style={[styles.subtitleCard, { backgroundColor: modeCfg.color + "14", borderColor: modeCfg.color + "30" }]}>
          <Ionicons name="shield-checkmark-outline" size={16} color={modeCfg.color} />
          <Text style={[styles.subtitle, { color: modeCfg.color, fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm }]}>
            {cfg.subtitle}
          </Text>
        </View>

        <OrderQrCode
          orderId={orderId}
          mode={mode}
          modeColor={modeCfg.color}
          qrLabel={cfg.qrLabel}
        />

        <OrderQrStatus
          steps={cfg.steps}
          activeStep={cfg.activeStep}
          modeColor={modeCfg.color}
        />

        <OrderQrInstructions
          instructions={cfg.instructions}
          modeColor={modeCfg.color}
          modeIcon={modeCfg.icon}
        />

        <OrderQrSummary
          mode={mode}
          storeCount={storeCount}
          totalAmount={totalAmt}
          validityHours={cfg.validityHours}
          placedAt={placedAt}
        />

        {/* ── Share QR as PNG image ── */}
        <QRShareButton
          filePath={qrFilePath}
          dialogTitle={`Share Order QR — ${orderId}`}
          color={modeCfg.color}
          style={styles.shareBtn}
        />

        {/* ── Share itemised order list as text ── */}
        <TouchableOpacity
          style={[styles.shareTextBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={handleShareOrderText}
          activeOpacity={0.8}
        >
          <Ionicons name="list-outline" size={18} color={colors.text} />
          <Text style={[styles.shareTextLabel, {
            color:      colors.text,
            fontFamily: typography.fontFamily.semiBold,
            fontSize:   typography.size.sm,
          }]}>
            Share Item List
          </Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Sticky bottom bar ── */}
      <SafeAreaView
        style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}
        edges={["bottom"]}
      >
        <View style={styles.bottomContent}>
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
  root: { flex: 1 },

  header: {},
  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 12,
    paddingVertical:   12,
    gap:               8,
  },
  headerBtn: {
    width:           40,
    height:          40,
    borderRadius:    12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems:      "center",
    justifyContent:  "center",
  },
  headerCenter: {
    flex:       1,
    alignItems: "center",
    gap:        4,
  },
  headerTitle:    { color: "#fff" },
  modeBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 10,
    paddingVertical:   3,
    borderRadius:      20,
  },
  modeBadgeText: { color: "#fff" },

  scroll: { padding: 16, gap: 16 },

  subtitleCard: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               8,
    padding:           14,
    borderRadius:      14,
    borderWidth:       1,
  },
  subtitle: { flex: 1, lineHeight: 20 },

  shareBtn: { marginTop: 4 },

  // Share item list as text button
  shareTextBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               8,
    paddingVertical:   13,
    borderRadius:      14,
    borderWidth:       1,
  },
  shareTextLabel: {},

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
    flex:           1,
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            7,
    paddingVertical: 13,
    borderRadius:   14,
    borderWidth:    1,
  },
  ordersBtnText: {},
  doneBtn: {
    flex:           1,
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            7,
    paddingVertical: 13,
    borderRadius:   14,
  },
  doneBtnText: { color: "#fff" },
});
