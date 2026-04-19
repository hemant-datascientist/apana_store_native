// ============================================================
// INVOICE ITEMS TABLE — Apana Store
//
// Particulars | Qty | MRP | Rate | Amount
// Matches the exact column layout of an Indian retail invoice.
// Long product names wrap naturally.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { InvoiceItem } from "../../data/invoiceData";

interface InvoiceItemsTableProps {
  items:        InvoiceItem[];
  totalUniqueItems: number;
  totalQty:     number;
}

export default function InvoiceItemsTable({
  items, totalUniqueItems, totalQty,
}: InvoiceItemsTableProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Column headers ── */}
      <View style={[styles.headerRow, { backgroundColor: colors.primary + "12", borderBottomColor: colors.border }]}>
        <Text style={[styles.colParticulars, styles.colHead, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
          Particulars
        </Text>
        <Text style={[styles.colNum, styles.colHead, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
          Qty
        </Text>
        <Text style={[styles.colNum, styles.colHead, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
          MRP
        </Text>
        <Text style={[styles.colNum, styles.colHead, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
          Rate
        </Text>
        <Text style={[styles.colNum, styles.colHead, styles.colRight, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
          Amt
        </Text>
      </View>

      {/* ── Item rows ── */}
      {items.map((item, i) => (
        <View
          key={item.id}
          style={[
            styles.itemRow,
            {
              backgroundColor:  i % 2 === 0 ? colors.background : colors.card,
              borderBottomColor: colors.border,
              borderBottomWidth: i < items.length - 1 ? 1 : 0,
            },
          ]}
        >
          {/* GST% badge + name */}
          <View style={styles.colParticulars}>
            <Text style={[styles.itemName, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
              {item.name}
            </Text>
            <View style={[styles.gstBadge, { backgroundColor: colors.primary + "14" }]}>
              <Text style={[styles.gstText, { color: colors.primary, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                GST {item.gstPercent}%
              </Text>
            </View>
          </View>

          <Text style={[styles.colNum, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {item.qty}
          </Text>
          <Text style={[styles.colNum, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs, textDecorationLine: item.mrp > item.rate ? "line-through" : "none" }]}>
            {item.mrp.toFixed(2)}
          </Text>
          <Text style={[styles.colNum, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {item.rate.toFixed(2)}
          </Text>
          <Text style={[styles.colNum, styles.colRight, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            {item.amount.toFixed(2)}
          </Text>
        </View>
      ))}

      {/* ── Totals row ── */}
      <View style={[styles.totalsRow, { backgroundColor: colors.primary + "08", borderTopColor: colors.border }]}>
        <Text style={[styles.totalsLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
          Tot Items/Qty:
        </Text>
        <Text style={[styles.totalsValue, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
          {totalUniqueItems} / {totalQty.toFixed(3)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth:  1,
    overflow:     "hidden",
  },
  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 12,
    paddingVertical:   9,
    borderBottomWidth: 1,
    gap:               4,
  },
  colHead:        {},
  colParticulars: { flex: 2.8 },
  colNum: {
    flex:      1,
    textAlign: "center",
  },
  colRight: { textAlign: "right" },

  itemRow: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    paddingHorizontal: 12,
    paddingVertical:   10,
    gap:               4,
  },
  itemName: { lineHeight: 17, marginBottom: 3 },
  gstBadge: {
    alignSelf:         "flex-start",
    paddingHorizontal: 5,
    paddingVertical:   1,
    borderRadius:      4,
  },
  gstText: {},

  totalsRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               8,
    paddingHorizontal: 12,
    paddingVertical:   9,
    borderTopWidth:    1,
  },
  totalsLabel: {},
  totalsValue: {},
});
