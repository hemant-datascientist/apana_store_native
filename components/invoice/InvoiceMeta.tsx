// ============================================================
// INVOICE META — Apana Store
//
// Bill number, cashier, date/time, counter — the 2-column
// info grid shown directly below the store header.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { formatInvoiceDate } from "../../data/invoiceData";

interface InvoiceMetaProps {
  billNo:       string;
  cashierName:  string;
  placedAt:     string;   // ISO date string
  counter:      string;
}

export default function InvoiceMeta({ billNo, cashierName, placedAt, counter }: InvoiceMetaProps) {
  const { colors } = useTheme();

  const rows = [
    { label: "Bill No",  value: billNo      },
    { label: "User",     value: cashierName },
    { label: "Date",     value: formatInvoiceDate(placedAt) },
    { label: "Counter",  value: counter     },
  ];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {rows.map((row, i) => (
        <View key={i} style={[styles.row, { borderBottomColor: colors.border, borderBottomWidth: i < rows.length - 1 ? 1 : 0 }]}>
          <Text style={[styles.label, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {row.label}
          </Text>
          <Text style={[styles.value, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth:  1,
    overflow:     "hidden",
  },
  row: {
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "center",
    paddingHorizontal: 14,
    paddingVertical:   9,
  },
  label: {},
  value: { textAlign: "right", flex: 1, marginLeft: 12 },
});
