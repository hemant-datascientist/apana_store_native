// ============================================================
// ORDER QR HANDSHAKE SCREEN — Apana Store (Customer App)
//
// Shown immediately after placing an order.
//
// PICKUP mode (one QR per store):
//   Each store gets its own QR card because the customer visits
//   each store separately. Staff scan that store's storeOrderId.
//   QR payload: { masterOrderId, storeOrderId, storeId, mode, ts }
//
// DELIVERY mode (one combined QR):
//   A single QR is shown — the delivery partner scans it at the
//   customer's door after collecting from all stores.
//   QR payload: { masterOrderId, mode, ts }
//
// RIDE mode (one combined QR):
//   Rider scans once to start the trip.
//
// Params from checkout.tsx:
//   mode            — "pickup" | "delivery" | "ride"
//   orderId         — master order ID (server-generated)
//   total           — grand total in ₹
//   storeOrdersJson — URL-encoded JSON of StoreOrderResult[]
// ============================================================

import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Share,
} from "react-native";
import { SafeAreaView }  from "react-native-safe-area-context";
import { Ionicons }      from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme          from "../../theme/useTheme";
import { typography }    from "../../theme/typography";

import { FulfillmentMode, FULFILLMENT_CONFIG } from "../../data/cartData";
import { ORDER_QR_CONFIG, generateOrderId }    from "../../data/orderQrData";
import { StoreOrderResult }                    from "../../services/checkoutService";
import { useCart }                             from "../../context/CartContext";

import OrderQrCode          from "../../components/order-qr/OrderQrCode";
import OrderQrStatus        from "../../components/order-qr/OrderQrStatus";
import OrderQrInstructions  from "../../components/order-qr/OrderQrInstructions";
import OrderQrSummary       from "../../components/order-qr/OrderQrSummary";
import OrderQrStoreCard     from "../../components/order-qr/OrderQrStoreCard";
import QRGenerator          from "../../components/qr/QRGenerator";
import QRShareButton        from "../../components/qr/QRShareButton";

export default function OrderQrScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();
  const { cart }           = useCart();

  // ── Params from checkout / tracking ───────────────────────
  // For pickup re-entries from /order-tracking we receive three
  // extra params (`trackingStoreOrdersJson`, `trackingVisitedJson`,
  // `trackingSequenceJson`) that we forward verbatim to
  // /order-collected so it can navigate back to the tracking screen
  // with the just-collected store added to `visitedJson`.
  const {
    mode:                       modeParam,
    orderId:                    orderIdParam,
    total:                      totalParam,
    storeOrdersJson:            storeOrdersParam,
    trackingStoreOrdersJson:    trackingStoreOrdersParam = "",
    trackingVisitedJson:        trackingVisitedParam     = "",
    trackingSequenceJson:       trackingSequenceParam    = "",
  } = useLocalSearchParams<{
    mode?:                     string;
    orderId?:                  string;
    total?:                    string;
    storeOrdersJson?:          string;
    trackingStoreOrdersJson?:  string;
    trackingVisitedJson?:      string;
    trackingSequenceJson?:     string;
  }>();

  const mode     = (modeParam ?? "delivery") as FulfillmentMode;
  const totalAmt = parseInt(totalParam ?? "0", 10);

  // Stable order ID — from server param or generated client-side
  const orderId   = useMemo(() => orderIdParam ?? generateOrderId(), [orderIdParam]);
  const placedAt  = useMemo(() => new Date(), []);

  const cfg     = ORDER_QR_CONFIG[mode];
  const modeCfg = FULFILLMENT_CONFIG[mode];

  // ── Parse per-store orders ────────────────────────────────
  // These come from PlaceOrderResponse.storeOrders via checkout navigation.
  const storeOrders = useMemo<StoreOrderResult[]>(() => {
    if (!storeOrdersParam) return [];
    try { return JSON.parse(decodeURIComponent(storeOrdersParam)); }
    catch { return []; }
  }, [storeOrdersParam]);

  // ── For pickup: merge storeOrders with CartContext items ──
  // storeOrders has IDs + metadata; CartContext has actual item names/prices.
  const cartStores = useMemo(
    () => cart.filter(s => s.fulfillment === mode),
    [cart, mode],
  );

  function getCartItemsForStore(storeId: string) {
    return cartStores.find(s => s.id === storeId)?.items ?? [];
  }

  // ── QR PNG path for combined (delivery/ride) share button ─
  const [qrFilePath, setQrFilePath] = useState<string | null>(null);

  // ── Per-store QR PNG paths for pickup share buttons ───────
  const [storeQrPaths, setStoreQrPaths] = useState<Record<string, string>>({});

  function setStoreQrPath(storeOrderId: string, path: string) {
    setStoreQrPaths(prev => ({ ...prev, [storeOrderId]: path }));
  }

  // ── Per-store QR payload (mirrors OrderQrStoreCard's qrValue) ─
  function makeStoreQrValue(so: StoreOrderResult) {
    return JSON.stringify({
      type:          "apana_order",
      masterOrderId: orderId,
      storeOrderId:  so.storeOrderId,
      storeId:       so.storeId,
      mode:          "pickup",
      ts:            placedAt.getTime(),
    });
  }

  // ── Combined QR payload (delivery/ride) ──────────────────
  const combinedQrValue = JSON.stringify({
    type:         "apana_order",
    masterOrderId: orderId,
    mode,
    ts:           placedAt.getTime(),
  });

  // ── Share order as text ───────────────────────────────────
  async function handleShareOrderText() {
    let cartSubtotal = 0;
    const storeLines = cartStores.map(store => {
      const itemLines = store.items.map(i => {
        cartSubtotal += i.price * i.qty;
        return `  • ${i.name} ×${i.qty}  — ₹${i.price * i.qty}`;
      }).join("\n");
      return `🏪 ${store.name}\n${itemLines}`;
    }).join("\n\n");

    const displayTotal = cartSubtotal > 0 ? cartSubtotal : totalAmt;
    const body =
      `Order ID: ${orderId}\n` +
      `Mode: ${modeCfg.label}\n\n` +
      `${storeLines}\n\n` +
      `────────────────\n` +
      `Total: ₹${displayTotal}\n\n` +
      `Placed via Apana Store`;

    await Share.share({ title: `My ${modeCfg.label} Order — Apana Store`, message: body });
  }

  // ── Is pickup with multiple stores? ──────────────────────
  const isPickupMulti = mode === "pickup" && storeOrders.length > 1;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={modeCfg.color} />

      {/* QRGenerator — hidden PNG builder for combined share (delivery/ride) */}
      {mode !== "pickup" && (
        <QRGenerator
          value={combinedQrValue}
          cacheKey={`order-${orderId}`}
          label={`Order ID: ${orderId}`}
          sublabel={`Apana Store · ${modeCfg.label} Order · ₹${totalAmt}`}
          onReady={path => setQrFilePath(path)}
          onError={msg  => console.warn("[OrderQR] gen error:", msg)}
        />
      )}

      {/* One hidden QRGenerator per store for pickup share buttons */}
      {mode === "pickup" && storeOrders.map(so => (
        <QRGenerator
          key={so.storeOrderId}
          value={makeStoreQrValue(so)}
          cacheKey={`order-${so.storeOrderId}`}
          label={so.storeName}
          sublabel={`Order: ${so.storeOrderId} · Apana Store · ₹${so.subtotal}`}
          onReady={path => setStoreQrPath(so.storeOrderId, path)}
          onError={msg  => console.warn(`[OrderQR] store ${so.storeOrderId}:`, msg)}
        />
      ))}

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

        {/* Subtitle tip */}
        <View style={[styles.subtitleCard, { backgroundColor: modeCfg.color + "14", borderColor: modeCfg.color + "30" }]}>
          <Ionicons name="shield-checkmark-outline" size={16} color={modeCfg.color} />
          <Text style={[styles.subtitle, { color: modeCfg.color, fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm }]}>
            {isPickupMulti
              ? `You have ${storeOrders.length} stores — each has its own QR. Visit each store and show its QR at the counter.`
              : cfg.subtitle}
          </Text>
        </View>

        {/* ════════════════════════════════════════════════════
            PICKUP MODE — one QR card per store
            ════════════════════════════════════════════════ */}
        {mode === "pickup" && storeOrders.length > 0 ? (
          <>
            {storeOrders.map((so) => (
              <OrderQrStoreCard
                key={so.storeOrderId}
                storeOrder={so}
                items={getCartItemsForStore(so.storeId)}
                masterOrderId={orderId}
                modeColor={modeCfg.color}
                validityHours={cfg.validityHours}
                placedAt={placedAt}
                qrFilePath={storeQrPaths[so.storeOrderId] ?? null}
                onSimulateScan={() => {
                  // storeId is forwarded so order-collected can pass it
                  // to the invoice screen.
                  // The three `tracking*` params are carried through so
                  // /order-collected can navigate back to /order-tracking
                  // with this storeId merged into `visitedJson`.
                  const base = `/order-collected?storeOrderId=${so.storeOrderId}&storeId=${so.storeId}&orderId=${orderId}&mode=${mode}&total=${so.subtotal}&storeName=${encodeURIComponent(so.storeName)}`;
                  const ctx = trackingStoreOrdersParam
                    ? `&trackingStoreOrdersJson=${encodeURIComponent(trackingStoreOrdersParam)}` +
                      `&trackingVisitedJson=${encodeURIComponent(trackingVisitedParam || "[]")}` +
                      (trackingSequenceParam ? `&trackingSequenceJson=${encodeURIComponent(trackingSequenceParam)}` : "")
                    : "";
                  router.push((base + ctx) as any);
                }}
                onViewInvoice={() =>
                  router.push(`/invoice?storeOrderId=${so.storeOrderId}&storeId=${so.storeId}` as any)
                }
              />
            ))}

            {/* Master order summary strip */}
            <OrderQrSummary
              mode={mode}
              storeCount={storeOrders.length}
              totalAmount={totalAmt}
              validityHours={cfg.validityHours}
              placedAt={placedAt}
            />
          </>
        ) : (
          /* ═══════════════════════════════════════════════════
             DELIVERY / RIDE — one combined QR
             ═══════════════════════════════════════════════ */
          <>
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

            <OrderQrSummary
              mode={mode}
              storeCount={cartStores.length || 1}
              totalAmount={totalAmt}
              validityHours={cfg.validityHours}
              placedAt={placedAt}
            />

            {/* Share QR as PNG */}
            <QRShareButton
              filePath={qrFilePath}
              dialogTitle={`Share Order QR — ${orderId}`}
              color={modeCfg.color}
              style={styles.shareBtn}
            />

            {/* Simulate scan for delivery/ride */}
            <TouchableOpacity
              style={[styles.shareTextBtn, { borderColor: modeCfg.color + "60", backgroundColor: modeCfg.color + "10" }]}
              onPress={() => router.push(
                `/order-collected?orderId=${orderId}&mode=${mode}&total=${totalAmt}`
              )}
              activeOpacity={0.85}
            >
              <Ionicons name="qr-code-outline" size={18} color={modeCfg.color} />
              <Text style={[styles.shareTextLabel, { color: modeCfg.color, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
                Simulate QR Scan Complete
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Instructions — common to all modes */}
        <OrderQrInstructions
          instructions={cfg.instructions}
          modeColor={modeCfg.color}
          modeIcon={modeCfg.icon}
        />

        {/* Share order as text */}
        <TouchableOpacity
          style={[styles.shareTextBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={handleShareOrderText}
          activeOpacity={0.8}
        >
          <Ionicons name="list-outline" size={18} color={colors.text} />
          <Text style={[styles.shareTextLabel, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
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
  headerCenter:  { flex: 1, alignItems: "center", gap: 4 },
  headerTitle:   { color: "#fff" },
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
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           8,
    padding:       14,
    borderRadius:  14,
    borderWidth:   1,
  },
  subtitle: { flex: 1, lineHeight: 20 },

  shareBtn:     { marginTop: 4 },
  shareTextBtn: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            8,
    paddingVertical: 13,
    borderRadius:   14,
    borderWidth:    1,
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
    flex:            1,
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             7,
    paddingVertical: 13,
    borderRadius:    14,
    borderWidth:     1,
  },
  ordersBtnText: {},
  doneBtn: {
    flex:            1,
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             7,
    paddingVertical: 13,
    borderRadius:    14,
  },
  doneBtnText: { color: "#fff" },
});
