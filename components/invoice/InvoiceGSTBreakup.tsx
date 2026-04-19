// ============================================================
// INVOICE GST BREAKUP — Apana Store
//
// GST% | Taxable Value | CGST | SGST | CSEE | NET Amt
// One row per GST slab + a NET totals row at the bottom.
// Matches the "GST BREAKUP (INCLUSIVE)" section of Indian invoices.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { GSTBreakupRow } from "../../data/invoiceData";

interface InvoiceGSTBreakupProps {
  rows:            GSTBreakupRow[];
  netTaxableValue: number;
  netCGST:         number;
  netSGST:         number;
  netCSEE:         number;
  netTotal:        number;
}

export default function InvoiceGSTBreakup({
  rows, netTaxableValue, netCGST, netSGST, netCSEE, netTotal,
}: InvoiceGSTBreakupProps) {
  const { colors } = useTheme();

  function ColHead({ label }: { label: string }) {
    return (
      <Text style={[styles.colHead, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
        {label}
      </Text>
    );
  }

  function Cell({ val, bold = false }: { val: number | string; bold?: boolean }) {
    return (
      <Text style={[styles.cell, {
        color:      bold ? colors.text : colors.subText,
        fontFamily: bold ? typography.fontFamily.semiBold : typography.fontFamily.regular,
        fontSize:   typography.size.ss,
      }]}>
        {typeof val === "number" ? val.toFixed(2) : val}
      </Text>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Title ── */}
      <View style={[styles.titleRow, { borderBottomColor: colors.border, backgroundColor: colors.primary + "10" }]}>
        <Ionicons name="calculator-outline" size={14} color={colors.primary} />
        <Text style={[styles.title, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          GST Breakup (Inclusive)
        </Text>
      </View>

      {/* ── Column headers ── */}
      <View style={[styles.headerRow, { borderBottomColor: colors.border, backgroundColor: colors.primary + "06" }]}>
        <ColHead label="GST%" />
        <ColHead label="Taxable" />
        <ColHead label="CGST" />
        <ColHead label="SGST" />
        <ColHead label="CSEE" />
        <ColHead label="NET" />
      </View>

      {/* ── Slab rows ── */}
      {rows.map((row, i) => (
        <View
          key={i}
          style={[
            styles.dataRow,
            {
              backgroundColor:   i % 2 === 0 ? colors.background : colors.card,
              borderBottomColor: colors.border,
              borderBottomWidth: 1,
            },
          ]}
        >
          {/* GST% — coloured badge */}
          <View style={[styles.gstBadge, { backgroundColor: colors.primary + "18" }]}>
            <Text style={[styles.gstPct, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
              {row.gstPercent}
            </Text>
          </View>
          <Cell val={row.taxableValue} />
          <Cell val={row.cgst} />
          <Cell val={row.sgst} />
          <Cell val={row.csee} />
          <Cell val={row.netAmt} bold />
        </View>
      ))}

      {/* ── NET totals row ── */}
      <View style={[styles.dataRow, styles.netRow, { backgroundColor: colors.primary + "10", borderTopColor: colors.border }]}>
        <Text style={[styles.netLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
          NET
        </Text>
        <Cell val={netTaxableValue} bold />
        <Cell val={netCGST}         bold />
        <Cell val={netSGST}         bold />
        <Cell val={netCSEE}         bold />
        <Text style={[styles.cell, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          {netTotal.toFixed(2)}
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
  titleRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 12,
    paddingVertical:   10,
    borderBottomWidth: 1,
  },
  title: {},

  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 12,
    paddingVertical:   7,
    borderBottomWidth: 1,
    gap:               2,
  },
  colHead: {
    flex:      1,
    textAlign: "center",
  },

  dataRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 12,
    paddingVertical:   8,
    gap:               2,
  },
  netRow:  { borderTopWidth: 1 },
  netLabel: {
    flex:      1,
    textAlign: "center",
  },

  gstBadge: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
    paddingVertical: 3,
    borderRadius:   6,
  },
  gstPct: {},
  cell: {
    flex:      1,
    textAlign: "center",
  },
});
