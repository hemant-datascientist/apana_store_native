// ============================================================
// INVOICE SCREEN — Apana Store
//
// Full digital GST invoice. Matches the layout of a standard
// Indian retail invoice: header → meta → items table →
// summary → GST breakup → footer with share.
//
// Route: /invoice?storeOrderId=<storeOrderId>   ← preferred (pickup)
//        /invoice?orderId=<billNo>               ← fallback (delivery/ride)
// Accessible from: order-collected → "View Invoice" button,
//                  order-history → row long-press / detail
// ============================================================

import React, { useMemo } from "react";
import {
  View, ScrollView, TouchableOpacity, Text, StyleSheet, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { getInvoiceByOrderId, formatInvoiceDate } from "../../data/invoiceData";

import InvoiceHeader     from "../../components/invoice/InvoiceHeader";
import InvoiceMeta       from "../../components/invoice/InvoiceMeta";
import InvoiceItemsTable from "../../components/invoice/InvoiceItemsTable";
import InvoiceSummary    from "../../components/invoice/InvoiceSummary";
import InvoiceGSTBreakup from "../../components/invoice/InvoiceGSTBreakup";
import InvoiceFooter     from "../../components/invoice/InvoiceFooter";

export default function InvoiceScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();
  const { orderId, storeOrderId } = useLocalSearchParams<{
    orderId?:      string;
    storeOrderId?: string;
  }>();

  // ── Resolve invoice — storeOrderId takes priority (pickup per-store) ─
  const invoice = getInvoiceByOrderId(storeOrderId ?? orderId ?? "APX-MOCK-S1");

  // ── Pre-build share text (passed to footer) ───────────────
  const shareText = useMemo(() => {
    const itemLines = invoice.items.map(item =>
      `  • ${item.name}  ×${item.qty}  ₹${item.amount.toFixed(2)}`
    ).join("\n");

    return (
      `TAX INVOICE — ${invoice.storeName}\n` +
      `${invoice.storeAddress}, ${invoice.storeCity}\n` +
      `GST: ${invoice.gstNo}\n` +
      `─────────────────────────\n` +
      `Bill No : ${invoice.billNo}\n` +
      `Date    : ${formatInvoiceDate(invoice.placedAt)}\n` +
      `Counter : ${invoice.counter}\n` +
      `─────────────────────────\n` +
      `${itemLines}\n` +
      `─────────────────────────\n` +
      `Net Amount : ₹${invoice.netAmount.toFixed(2)}\n` +
      `CGST       : ₹${invoice.netCGST.toFixed(2)}\n` +
      `SGST       : ₹${invoice.netSGST.toFixed(2)}\n` +
      (invoice.savedAmount > 0 ? `You Saved  : ₹${invoice.savedAmount.toFixed(2)}\n` : "") +
      `─────────────────────────\n` +
      `Powered by Apana Store — Curated Precision`
    );
  }, [invoice]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* ── Header bar ────────────────────────────────────────── */}
      <SafeAreaView style={[styles.headerWrap, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.background }]} onPress={() => router.back()} activeOpacity={0.75}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
              Invoice
            </Text>
            <Text style={[styles.headerSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
              {invoice.storeOrderId}
            </Text>
          </View>

          {/* Bill No badge */}
          <View style={[styles.verifiedPill, { backgroundColor: "#DCFCE7", borderColor: "#86EFAC" }]}>
            <Ionicons name="checkmark-circle" size={12} color="#16A34A" />
            <Text style={[styles.verifiedText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
              Paid
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* ── Scrollable invoice body ───────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Dashed receipt border wrapper ─── */}
        <View style={[styles.receiptWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>

          {/* Store header */}
          <InvoiceHeader
            storeLogo={invoice.storeLogo}
            storeLogoColor={invoice.storeLogoColor}
            storeName={invoice.storeName}
            storeAddress={invoice.storeAddress}
            storeCity={invoice.storeCity}
            storeState={invoice.storeState}
            storePincode={invoice.storePincode}
            gstNo={invoice.gstNo}
            fssaiNo={invoice.fssaiNo}
            customerCare={invoice.customerCare}
          />

          <View style={[styles.dashes, { borderColor: colors.border }]} />

          {/* Bill meta */}
          <InvoiceMeta
            billNo={invoice.billNo}
            cashierName={invoice.cashierName}
            placedAt={invoice.placedAt}
            counter={invoice.counter}
          />

          <View style={[styles.dashes, { borderColor: colors.border }]} />

          {/* Items table */}
          <InvoiceItemsTable
            items={invoice.items}
            totalUniqueItems={invoice.totalUniqueItems}
            totalQty={invoice.totalQty}
          />

          <View style={[styles.dashes, { borderColor: colors.border }]} />

          {/* Summary + payment + savings */}
          <InvoiceSummary
            amountInMRP={invoice.amountInMRP}
            otherCharges={invoice.otherCharges}
            netAmount={invoice.netAmount}
            payment={invoice.payment}
            savedAmount={invoice.savedAmount}
            savedPercent={invoice.savedPercent}
          />

          <View style={[styles.dashes, { borderColor: colors.border }]} />

          {/* GST breakup table */}
          <InvoiceGSTBreakup
            rows={invoice.gstBreakup}
            netTaxableValue={invoice.netTaxableValue}
            netCGST={invoice.netCGST}
            netSGST={invoice.netSGST}
            netCSEE={invoice.netCSEE}
            netTotal={invoice.netAmount}
          />

          <View style={[styles.dashes, { borderColor: colors.border }]} />

          {/* Footer: thank you + share */}
          <InvoiceFooter
            thankYouNote={invoice.thankYouNote}
            shareText={shareText}
            storeName={invoice.storeName}
            billNo={invoice.billNo}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  headerWrap:    { borderBottomWidth: 1 },
  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 12,
    paddingVertical:   10,
    gap:               10,
  },
  iconBtn: {
    width:          38,
    height:         38,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  headerCenter:  { flex: 1, alignItems: "center", gap: 2 },
  headerTitle:   {},
  headerSub:     {},
  verifiedPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 9,
    paddingVertical:   4,
    borderRadius:      20,
    borderWidth:       1,
    flexShrink:        0,
  },
  verifiedText: { color: "#16A34A" },

  scroll:  { flex: 1 },
  content: {
    padding: 16,
    gap:     16,
  },

  // Receipt-style outer wrapper with dashed border feel
  receiptWrap: {
    borderRadius:  16,
    borderWidth:   1,
    borderStyle:   "dashed",
    padding:       16,
    gap:           16,
  },

  // Dashed divider between sections (mimics receipt paper tear)
  dashes: {
    borderBottomWidth: 1,
    borderStyle:       "dashed",
    marginHorizontal:  -4,
  },

  bottomSpacer: { height: 20 },
});
