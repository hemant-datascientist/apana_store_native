// ============================================================
// ORDER QR STORE CARD — Apana Store
//
// One card per store in a pickup order.
// Shows: store name + type badge, item list, store subtotal,
// individual QR code (encodes storeOrderId), estimated prep
// time, and a "Simulate Scan" button → order-collected screen.
//
// For delivery/ride mode a single combined QR is used instead;
// this component is only rendered for pickup.
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
} from "react-native";
import QRCode    from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { CartItem } from "../../data/cartData";
import { StoreOrderResult } from "../../services/checkoutService";

const { width: SW } = Dimensions.get("window");
const QR_SIZE = SW * 0.46;   // smaller than the full-screen QR

interface OrderQrStoreCardProps {
  storeOrder:    StoreOrderResult;
  items:         CartItem[];        // items from CartContext for this store
  masterOrderId: string;
  modeColor:     string;
  validityHours: number;
  placedAt:      Date;
  onSimulateScan: () => void;       // navigate to order-collected for this store
  onViewInvoice:  () => void;       // navigate to invoice for this store
}

export default function OrderQrStoreCard({
  storeOrder, items, masterOrderId, modeColor,
  validityHours, placedAt, onSimulateScan, onViewInvoice,
}: OrderQrStoreCardProps) {
  const { colors } = useTheme();
  const [bright, setBright] = useState(false);

  // ── QR payload — scanned by store staff / partner app ────
  // Contains both masterOrderId (for grouping) and storeOrderId
  // (unique to THIS store's sub-order). Staff app validates storeOrderId.
  const qrValue = JSON.stringify({
    type:          "apana_order",
    masterOrderId,
    storeOrderId:  storeOrder.storeOrderId,
    storeId:       storeOrder.storeId,
    mode:          "pickup",
    ts:            placedAt.getTime(),
  });

  // ── Expiry time ───────────────────────────────────────────
  const expiresAt = new Date(placedAt.getTime() + validityHours * 60 * 60 * 1000);
  const expiryStr = expiresAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  // ── Item total ────────────────────────────────────────────
  const itemTotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: modeColor + "50" }]}>

      {/* ── Store header ── */}
      <View style={styles.storeHeader}>
        <View style={[styles.storeIconCircle, { backgroundColor: storeOrder.storeTypeBg }]}>
          <Ionicons name="storefront-outline" size={18} color={storeOrder.storeTypeColor} />
        </View>
        <View style={styles.storeInfo}>
          <Text style={[styles.storeName, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            {storeOrder.storeName}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.typeBadge, { backgroundColor: storeOrder.storeTypeBg }]}>
              <Text style={[styles.typeText, { color: storeOrder.storeTypeColor, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
                {storeOrder.storeType}
              </Text>
            </View>
            <View style={styles.etaChip}>
              <Ionicons name="time-outline" size={11} color={colors.subText} />
              <Text style={[styles.etaText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                ~{storeOrder.estimatedMins} min
              </Text>
            </View>
          </View>
        </View>
        {/* Subtotal */}
        <Text style={[styles.subtotal, { color: modeColor, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
          ₹{itemTotal}
        </Text>
      </View>

      {/* ── Item list ── */}
      <View style={[styles.itemsDivider, { backgroundColor: colors.border }]} />
      <View style={styles.itemsList}>
        {items.map(item => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={[styles.itemName, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {item.name}
            </Text>
            <Text style={[styles.itemQty, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              ×{item.qty}
            </Text>
            <Text style={[styles.itemAmt, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
              ₹{item.price * item.qty}
            </Text>
          </View>
        ))}
      </View>

      {/* ── QR code ── */}
      <View style={[styles.itemsDivider, { backgroundColor: colors.border }]} />
      <View style={styles.qrSection}>
        {/* Store order ID pill */}
        <View style={[styles.storeOrderIdPill, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="barcode-outline" size={11} color={colors.subText} />
          <Text style={[styles.storeOrderIdText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
            {storeOrder.storeOrderId}
          </Text>
        </View>

        {/* QR card — tap to brighten */}
        <TouchableOpacity
          style={[styles.qrCard, bright && { backgroundColor: "#FFF" }]}
          onPress={() => setBright(b => !b)}
          activeOpacity={1}
        >
          {/* Branded corner dots */}
          <View style={[styles.dot, styles.TL, { backgroundColor: modeColor }]} />
          <View style={[styles.dot, styles.TR, { backgroundColor: modeColor }]} />
          <View style={[styles.dot, styles.BL, { backgroundColor: modeColor }]} />
          <View style={[styles.dot, styles.BR, { backgroundColor: modeColor }]} />
          <QRCode
            value={qrValue}
            size={QR_SIZE}
            color="#111827"
            backgroundColor="#FFFFFF"
            quietZone={10}
          />
          {!bright && (
            <View style={[styles.brightHint, { backgroundColor: modeColor + "18" }]}>
              <Ionicons name="sunny-outline" size={11} color={modeColor} />
              <Text style={[styles.brightHintText, { color: modeColor, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                Tap to brighten
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* SHOW AT COUNTER pill */}
        <View style={[styles.counterPill, { backgroundColor: modeColor + "14", borderColor: modeColor + "40" }]}>
          <Ionicons name="qr-code-outline" size={12} color={modeColor} />
          <Text style={[styles.counterText, { color: modeColor, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
            SHOW AT COUNTER
          </Text>
        </View>

        {/* Expiry */}
        <View style={[styles.expiryChip, { backgroundColor: "#FEF3C7" }]}>
          <Ionicons name="hourglass-outline" size={11} color="#D97706" />
          <Text style={[styles.expiryText, { color: "#D97706", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
            Valid until {expiryStr}
          </Text>
        </View>
      </View>

      {/* ── Action buttons ── */}
      <View style={[styles.actionsDivider, { backgroundColor: colors.border }]} />
      <View style={styles.actions}>
        {/* Simulate scan — goes to order-collected for this store */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: modeColor + "14", borderColor: modeColor + "40" }]}
          onPress={onSimulateScan}
          activeOpacity={0.8}
        >
          <Ionicons name="qr-code-outline" size={15} color={modeColor} />
          <Text style={[styles.actionText, { color: modeColor, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            Simulate Scan
          </Text>
        </TouchableOpacity>

        {/* View invoice for this store */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={onViewInvoice}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text-outline" size={15} color={colors.subText} />
          <Text style={[styles.actionText, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            View Invoice
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth:  1.5,
    overflow:     "hidden",
  },

  // Store header
  storeHeader: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 14,
    paddingVertical:   12,
    gap:               10,
  },
  storeIconCircle: {
    width:          40,
    height:         40,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  storeInfo:   { flex: 1, gap: 4 },
  storeName:   {},
  metaRow:     { flexDirection: "row", alignItems: "center", gap: 6 },
  typeBadge: {
    paddingHorizontal: 7,
    paddingVertical:   2,
    borderRadius:      6,
  },
  typeText:    {},
  etaChip:     { flexDirection: "row", alignItems: "center", gap: 3 },
  etaText:     {},
  subtotal:    { flexShrink: 0 },

  // Items list
  itemsDivider: { height: 1 },
  itemsList: {
    paddingHorizontal: 14,
    paddingVertical:   10,
    gap:               6,
  },
  itemRow: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            6,
  },
  itemName:    { flex: 1 },
  itemQty:     { width: 24, textAlign: "center" },
  itemAmt:     { width: 60, textAlign: "right" },

  // QR section
  qrSection: {
    alignItems:     "center",
    paddingVertical: 16,
    gap:             12,
  },
  storeOrderIdPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      8,
    borderWidth:       1,
  },
  storeOrderIdText: {},
  qrCard: {
    backgroundColor: "#FFFFFF",
    borderRadius:    16,
    padding:         16,
    alignItems:      "center",
    justifyContent:  "center",
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 3 },
    shadowOpacity:   0.10,
    shadowRadius:    12,
    elevation:       6,
  },
  dot:  { position: "absolute", width: 8, height: 8, borderRadius: 4 },
  TL:   { top: 8, left: 8 },
  TR:   { top: 8, right: 8 },
  BL:   { bottom: 8, left: 8 },
  BR:   { bottom: 8, right: 8 },
  brightHint: {
    position:          "absolute",
    bottom:            12,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
  },
  brightHintText: {},
  counterPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    paddingHorizontal: 14,
    paddingVertical:   6,
    borderRadius:      20,
    borderWidth:       1,
  },
  counterText: { letterSpacing: 1 },
  expiryChip: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
  },
  expiryText: {},

  // Actions
  actionsDivider: { height: 1 },
  actions: {
    flexDirection:     "row",
    gap:               10,
    paddingHorizontal: 14,
    paddingVertical:   12,
  },
  actionBtn: {
    flex:            1,
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             6,
    paddingVertical: 10,
    borderRadius:    10,
    borderWidth:     1,
  },
  actionText: {},
});
