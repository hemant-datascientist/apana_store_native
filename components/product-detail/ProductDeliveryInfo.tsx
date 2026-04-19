// ============================================================
// PRODUCT DELIVERY INFO — Apana Store
//
// Shows: delivery ETA, free delivery threshold, return policy,
// COD availability, and store/seller info.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface ProductDeliveryInfoProps {
  deliveryDays:      number;
  freeDeliveryAbove: number;
  returnDays:        number;
  isCodAvailable:    boolean;
  storeName:         string;
  storeType:         string;
  storeTypeColor:    string;
  storeTypeBg:       string;
}

export default function ProductDeliveryInfo({
  deliveryDays, freeDeliveryAbove, returnDays,
  isCodAvailable, storeName, storeType, storeTypeColor, storeTypeBg,
}: ProductDeliveryInfoProps) {
  const { colors } = useTheme();

  const deliveryLabel =
    deliveryDays === 0 ? "Delivered today" :
    deliveryDays === 1 ? "Delivered by tomorrow" :
    `Delivered in ${deliveryDays} days`;

  const rows = [
    {
      icon:  "bicycle-outline",
      color: "#0F4C81",
      title: deliveryLabel,
      sub:   freeDeliveryAbove > 0
        ? `Free delivery on orders above ₹${freeDeliveryAbove}`
        : "Free delivery on this order",
    },
    {
      icon:  "refresh-outline",
      color: returnDays > 0 ? "#059669" : "#EF4444",
      title: returnDays > 0 ? `${returnDays}-day return policy` : "No returns accepted",
      sub:   returnDays > 0
        ? "Return or replacement if item is damaged / incorrect"
        : "Food & consumables are non-returnable",
    },
    {
      icon:  "cash-outline",
      color: isCodAvailable ? "#D97706" : "#6B7280",
      title: isCodAvailable ? "Cash on Delivery available" : "Prepaid only",
      sub:   isCodAvailable
        ? "Pay in cash when your order arrives"
        : "UPI, Card, or Net Banking accepted",
    },
  ];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Header ── */}
      <View style={styles.titleRow}>
        <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          Delivery & Returns
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Info rows ── */}
      <View style={styles.rows}>
        {rows.map((row, i) => (
          <View key={i} style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: row.color + "18" }]}>
              <Ionicons name={row.icon as any} size={18} color={row.color} />
            </View>
            <View style={styles.infoBody}>
              <Text style={[styles.infoTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
                {row.title}
              </Text>
              <Text style={[styles.infoSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {row.sub}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Seller / store info ── */}
      <View style={styles.storeRow}>
        <Ionicons name="storefront-outline" size={15} color={colors.subText} />
        <Text style={[styles.storeLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          Sold by
        </Text>
        <View style={[styles.storeBadge, { backgroundColor: storeTypeBg }]}>
          <Text style={[styles.storeType, { color: storeTypeColor, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
            {storeType}
          </Text>
        </View>
        <Text style={[styles.storeName, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
          {storeName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth:  1,
    overflow:     "hidden",
  },
  titleRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  title:   {},
  divider: { height: 1 },
  rows: {
    padding: 16,
    gap:     16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           12,
  },
  iconCircle: {
    width:          40,
    height:         40,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  infoBody:  { flex: 1, gap: 2 },
  infoTitle: {},
  infoSub:   { lineHeight: 17 },
  storeRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    paddingHorizontal: 16,
    paddingVertical:   12,
    flexWrap:          "wrap",
  },
  storeLabel:  {},
  storeBadge: {
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:      6,
  },
  storeType: {},
  storeName: {},
});
