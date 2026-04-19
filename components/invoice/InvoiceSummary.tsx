// ============================================================
// INVOICE SUMMARY — Apana Store
//
// Three sections in one card:
//   1. Amount in MRP / Other charges / Net Amount
//   2. Payment details (cash received, change, card, UPI)
//   3. "YOU HAVE SAVED" green savings strip
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { InvoicePayment } from "../../data/invoiceData";

interface InvoiceSummaryProps {
  amountInMRP:   number;
  otherCharges:  number;
  netAmount:     number;
  payment:       InvoicePayment;
  savedAmount:   number;
  savedPercent:  number;
}

export default function InvoiceSummary({
  amountInMRP, otherCharges, netAmount,
  payment, savedAmount, savedPercent,
}: InvoiceSummaryProps) {
  const { colors } = useTheme();

  // Only show payment modes that are non-zero
  const paymentRows = [
    { label: "Cash Received", value: payment.cashReceived, show: payment.cashReceived > 0 },
    { label: "Cash Return",   value: payment.cashReturn,   show: payment.cashReceived > 0 },
    { label: "Bill Amount",   value: payment.billAmount,   show: true                     },
    { label: "Card",          value: payment.cardAmount,   show: payment.cardAmount > 0   },
    { label: "UPI",           value: payment.upiAmount,    show: payment.upiAmount  > 0   },
  ].filter(r => r.show);

  return (
    <View style={styles.wrapper}>

      {/* ── Amount summary ── */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

        <View style={[styles.amtRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.amtLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            Amount In MRP
          </Text>
          <Text style={[styles.amtValue, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs, textDecorationLine: "line-through" }]}>
            ₹{amountInMRP.toFixed(2)}
          </Text>
        </View>

        {otherCharges > 0 && (
          <View style={[styles.amtRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.amtLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              Other Charges
            </Text>
            <Text style={[styles.amtValue, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              ₹{otherCharges.toFixed(2)}
            </Text>
          </View>
        )}

        {/* Net Amount — large, bold */}
        <View style={[styles.netRow, { backgroundColor: colors.primary + "08" }]}>
          <Text style={[styles.netLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            Net Amount
          </Text>
          <Text style={[styles.netAmt, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xxl }]}>
            ₹{netAmount.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* ── Payment details ── */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.sectionHead, { borderBottomColor: colors.border }]}>
          <Ionicons name="wallet-outline" size={14} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            Payment Details
          </Text>
        </View>

        <View style={styles.payGrid}>
          {paymentRows.map((row, i) => (
            <View key={i} style={styles.payRow}>
              <Text style={[styles.payLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {row.label}
              </Text>
              <Text style={[styles.payValue, {
                color:      row.label === "Cash Return" ? "#D97706" : colors.text,
                fontFamily: typography.fontFamily.semiBold,
                fontSize:   typography.size.xs,
              }]}>
                ₹{row.value.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Savings strip ── */}
      {savedAmount > 0 && (
        <View style={[styles.savingsStrip, { backgroundColor: "#DCFCE7", borderColor: "#86EFAC" }]}>
          <Ionicons name="pricetag-outline" size={16} color="#15803D" />
          <Text style={[styles.savingsText, { color: "#15803D", fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            YOU HAVE SAVED: {savedPercent.toFixed(2)}%
          </Text>
          <Text style={[styles.savingsAmt, { color: "#15803D", fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            ₹{savedAmount.toFixed(2)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 12 },
  card: {
    borderRadius: 12,
    borderWidth:  1,
    overflow:     "hidden",
  },
  sectionHead: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 14,
    paddingVertical:   10,
    borderBottomWidth: 1,
  },
  sectionTitle: {},

  // Amount rows
  amtRow: {
    flexDirection:     "row",
    justifyContent:    "space-between",
    paddingHorizontal: 14,
    paddingVertical:   9,
    borderBottomWidth: 1,
  },
  amtLabel: {},
  amtValue: {},

  netRow: {
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "center",
    paddingHorizontal: 14,
    paddingVertical:   14,
  },
  netLabel: {},
  netAmt:   {},

  // Payment grid — 2-column
  payGrid: {
    flexDirection:     "row",
    flexWrap:          "wrap",
    paddingHorizontal: 14,
    paddingVertical:   10,
    rowGap:            10,
  },
  payRow: {
    width: "50%",
    gap:   3,
  },
  payLabel: {},
  payValue: {},

  // Savings strip
  savingsStrip: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               8,
    padding:           14,
    borderRadius:      12,
    borderWidth:       1,
  },
  savingsText: { flex: 1 },
  savingsAmt:  {},
});
