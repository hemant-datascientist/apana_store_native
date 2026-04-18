// ============================================================
// CART PRICE BREAKDOWN — Apana Store
//
// Itemised cost card: subtotal, delivery, promo discount, total.
// Shows a green savings badge when a promo is applied.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface CartPriceBreakdownProps {
  subtotal:      number;
  deliveryTotal: number;
  discountAmt:   number;
  appliedPromo:  string | null;
  total:         number;
}

export default function CartPriceBreakdown({
  subtotal, deliveryTotal, discountAmt, appliedPromo, total,
}: CartPriceBreakdownProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.cardTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
        Price Details
      </Text>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Line items */}
      <PriceRow label="Item Subtotal"    value={`₹${subtotal}`}          labelColor={colors.text} valueColor={colors.subText} />
      <PriceRow
        label="Delivery Charges"
        value={deliveryTotal === 0 ? "FREE" : `₹${deliveryTotal}`}
        labelColor={colors.text}
        valueColor={deliveryTotal === 0 ? "#16A34A" : colors.subText}
      />
      {discountAmt > 0 && appliedPromo && (
        <PriceRow
          label={`Promo (${appliedPromo})`}
          value={`−₹${discountAmt}`}
          labelColor={colors.text}
          valueColor="#16A34A"
        />
      )}

      <View style={[styles.divider, { backgroundColor: colors.border, marginTop: 4 }]} />

      {/* Grand total */}
      <View style={styles.totalRow}>
        <Text style={[styles.totalLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
          Total Payable
        </Text>
        <Text style={[styles.totalValue, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
          ₹{total}
        </Text>
      </View>

      {/* Savings badge */}
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

// ── Reusable line-item row ────────────────────────────────────

function PriceRow({ label, value, labelColor, valueColor }: {
  label: string; value: string; labelColor: string; valueColor: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: labelColor, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
        {label}
      </Text>
      <Text style={[styles.rowValue, { color: valueColor, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth:  1,
    padding:      14,
    gap:          10,
  },
  cardTitle: {},
  divider:   { height: 1 },

  row: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
  },
  rowLabel: {},
  rowValue: {},

  totalRow: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
    marginTop:      4,
  },
  totalLabel: {},
  totalValue: {},

  savingsBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    paddingHorizontal: 12,
    paddingVertical:   8,
    borderRadius:      10,
    marginTop:         4,
  },
  savingsText: {},
});
