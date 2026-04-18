// ============================================================
// ORDER QR SUMMARY — Apana Store
//
// Compact card showing the key order details below the QR:
//   mode badge · store count · total · QR validity expiry
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { FulfillmentMode, FULFILLMENT_CONFIG } from "../../data/cartData";

interface OrderQrSummaryProps {
  mode:         FulfillmentMode;
  storeCount:   number;
  totalAmount:  number;
  validityHours: number;
  placedAt:     Date;
}

export default function OrderQrSummary({
  mode, storeCount, totalAmount, validityHours, placedAt,
}: OrderQrSummaryProps) {
  const { colors } = useTheme();
  const cfg         = FULFILLMENT_CONFIG[mode];

  // ── Compute expiry time ───────────────────────────────────
  const expiresAt = new Date(placedAt.getTime() + validityHours * 60 * 60 * 1000);
  const expiryStr = expiresAt.toLocaleTimeString("en-IN", {
    hour:   "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // ── Placed time ───────────────────────────────────────────
  const placedStr = placedAt.toLocaleTimeString("en-IN", {
    hour:   "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* Row 1: mode + stores + total */}
      <View style={styles.row}>
        {/* Mode badge */}
        <View style={[styles.modeBadge, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon as any} size={13} color={cfg.color} />
          <Text style={[styles.modeText, { color: cfg.color, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            {cfg.label}
          </Text>
        </View>

        {/* Store count */}
        <View style={styles.stat}>
          <Ionicons name="storefront-outline" size={13} color={colors.subText} />
          <Text style={[styles.statText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {storeCount} store{storeCount > 1 ? "s" : ""}
          </Text>
        </View>

        {/* Total */}
        <Text style={[styles.total, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
          ₹{totalAmount}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Row 2: placed time + expiry */}
      <View style={styles.row}>
        <View style={styles.stat}>
          <Ionicons name="time-outline" size={13} color={colors.subText} />
          <Text style={[styles.statText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            Placed at {placedStr}
          </Text>
        </View>

        <View style={[styles.expiryChip, { backgroundColor: "#FEF3C7" }]}>
          <Ionicons name="hourglass-outline" size={12} color="#D97706" />
          <Text style={[styles.expiryText, { color: "#D97706", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
            Valid until {expiryStr}
          </Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth:  1,
    padding:      14,
    gap:          12,
  },

  row: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            10,
    flexWrap:       "wrap",
  },

  modeBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 10,
    paddingVertical:   5,
    borderRadius:      20,
  },
  modeText: {},

  stat: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           4,
  },
  statText: {},

  total: { marginLeft: "auto" },

  divider: { height: 1 },

  expiryChip: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderRadius:      20,
    marginLeft:        "auto",
  },
  expiryText: {},
});
