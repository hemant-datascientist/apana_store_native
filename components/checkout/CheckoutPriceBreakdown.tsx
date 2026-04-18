// ============================================================
// CHECKOUT PRICE BREAKDOWN — Apana Store
//
// Displays itemised pricing: subtotal, delivery, platform fee,
// promo discount, and final total payable.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface CheckoutPriceBreakdownProps {
  subtotal:      number;
  deliveryTotal: number;
  discountAmt:   number;
  appliedPromo:  string | null;
  total:         number;
}

export default function CheckoutPriceBreakdown({
  subtotal, deliveryTotal, discountAmt, appliedPromo, total,
}: CheckoutPriceBreakdownProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Card title ── */}
      <View style={styles.titleRow}>
        <Ionicons name="receipt-outline" size={16} color={colors.primary} />
        <Text style={[styles.cardTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          Price Details
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Line items ── */}
      <View style={styles.rows}>

        <PriceRow
          label="Item Subtotal"
          value={`₹${subtotal}`}
          textColor={colors.text}
          valueColor={colors.subText}
        />

        <PriceRow
          label="Delivery Charges"
          value={deliveryTotal === 0 ? "FREE" : `₹${deliveryTotal}`}
          textColor={colors.text}
          valueColor={deliveryTotal === 0 ? "#16A34A" : colors.subText}
        />

        {/* Platform convenience fee */}
        <PriceRow
          label="Platform Fee"
          value="FREE"
          textColor={colors.text}
          valueColor="#16A34A"
        />

        {/* Promo discount — only if applied */}
        {discountAmt > 0 && appliedPromo && (
          <PriceRow
            label={`Promo (${appliedPromo})`}
            value={`−₹${discountAmt}`}
            textColor={colors.text}
            valueColor="#16A34A"
          />
        )}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Grand total ── */}
      <View style={styles.totalRow}>
        <Text style={[styles.totalLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
          Total Payable
        </Text>
        <Text style={[styles.totalValue, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
          ₹{total}
        </Text>
      </View>

      {/* ── Savings badge (when promo applied) ── */}
      {discountAmt > 0 && (
        <View style={[styles.savingsBadge, { backgroundColor: "#DCFCE7" }]}>
          <Ionicons name="happy-outline" size={14} color="#15803D" />
          <Text style={[styles.savingsText, { color: "#15803D", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            You're saving ₹{discountAmt} on this order!
          </Text>
        </View>
      )}

    </View>
  );
}

// ── Reusable price row ────────────────────────────────────────

function PriceRow({ label, value, textColor, valueColor }: {
  label:      string;
  value:      string;
  textColor:  string;
  valueColor: string;
}) {
  return (
    <View style={styles.priceRow}>
      <Text style={[styles.priceLabel, { color: textColor, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
        {label}
      </Text>
      <Text style={[styles.priceValue, { color: valueColor, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth:  1,
    overflow:     "hidden",
  },

  titleRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 14,
    paddingVertical:   12,
  },
  cardTitle: {},

  divider: { height: 1 },

  rows: {
    paddingHorizontal: 14,
    paddingVertical:   12,
    gap:               12,
  },

  priceRow: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
  },
  priceLabel: {},
  priceValue: {},

  totalRow: {
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "center",
    paddingHorizontal: 14,
    paddingVertical:   14,
  },
  totalLabel: {},
  totalValue: {},

  savingsBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    marginHorizontal:  14,
    marginBottom:      14,
    paddingHorizontal: 12,
    paddingVertical:   9,
    borderRadius:      10,
  },
  savingsText: {},
});
