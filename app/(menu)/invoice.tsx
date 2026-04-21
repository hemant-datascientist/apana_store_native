// ============================================================
// INVOICE SCREEN — Apana Store (Customer App)
//
// Full digital GST invoice. Matches the layout of a standard
// Indian retail invoice: header → meta → items table →
// summary → GST breakup → footer with share.
//
// Route: /invoice?storeOrderId=<id>   ← pickup (per-store)
//        /invoice?orderId=<id>         ← delivery / ride (master)
//
// Accessible from:
//   order-collected → "View Invoice"
//   order-qr        → "View Invoice" (per store card)
//   order-history   → row action
//
// Backend: GET /api/orders/invoice?storeOrderId=<id>
//          GET /api/orders/invoice?orderId=<id>
// ============================================================

import React, { useState, useEffect, useMemo } from "react";
import {
  View, ScrollView, TouchableOpacity, Text,
  StyleSheet, StatusBar, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import useTheme        from "../../theme/useTheme";
import { typography }  from "../../theme/typography";
import { formatInvoiceDate } from "../../data/invoiceData";
import { fetchInvoice, Invoice } from "../../services/invoiceService";

import InvoiceHeader     from "../../components/invoice/InvoiceHeader";
import InvoiceMeta       from "../../components/invoice/InvoiceMeta";
import InvoiceItemsTable from "../../components/invoice/InvoiceItemsTable";
import InvoiceSummary    from "../../components/invoice/InvoiceSummary";
import InvoiceGSTBreakup from "../../components/invoice/InvoiceGSTBreakup";
import InvoiceFooter     from "../../components/invoice/InvoiceFooter";

export default function InvoiceScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();

  const { orderId, storeOrderId, storeId } = useLocalSearchParams<{
    orderId?:      string;
    storeOrderId?: string;
    storeId?:      string;
  }>();

  // ── Fetch invoice from service ────────────────────────────
  const [invoice,  setInvoice]  = useState<Invoice | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [fetchErr, setFetchErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchErr(null);

    // storeId gives the correct store name regardless of generated order IDs
    fetchInvoice({ storeId, storeOrderId, orderId })
      .then(inv => { if (!cancelled) setInvoice(inv); })
      .catch(err => { if (!cancelled) setFetchErr(err?.message ?? "Failed to load invoice"); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [storeOrderId, orderId]);

  // ── Pre-build share text (only when invoice is loaded) ────
  const shareText = useMemo(() => {
    if (!invoice) return "";
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

      {/* ── Header bar ─────────────────────────────────────────── */}
      <SafeAreaView style={[styles.headerWrap, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.background }]}
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
              Invoice
            </Text>
            {invoice && (
              <Text style={[styles.headerSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                {invoice.storeOrderId}
              </Text>
            )}
          </View>

          {/* Paid badge — only shown when invoice is loaded */}
          {invoice ? (
            <View style={[styles.verifiedPill, { backgroundColor: "#DCFCE7", borderColor: "#86EFAC" }]}>
              <Ionicons name="checkmark-circle" size={12} color="#16A34A" />
              <Text style={[styles.verifiedText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
                Paid
              </Text>
            </View>
          ) : (
            /* Placeholder to keep header balanced while loading */
            <View style={styles.iconBtn} />
          )}
        </View>
      </SafeAreaView>

      {/* ── Loading state ──────────────────────────────────────── */}
      {loading && (
        <View style={styles.centred}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
            Loading invoice…
          </Text>
        </View>
      )}

      {/* ── Error state ────────────────────────────────────────── */}
      {!loading && !!fetchErr && (
        <View style={styles.centred}>
          <View style={[styles.errorIcon, { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5" }]}>
            <Ionicons name="alert-circle-outline" size={36} color="#EF4444" />
          </View>
          <Text style={[styles.errorTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            Could Not Load Invoice
          </Text>
          <Text style={[styles.errorSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
            {fetchErr}
          </Text>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            onPress={() => {
              setLoading(true);
              setFetchErr(null);
              fetchInvoice({ storeId, storeOrderId, orderId })
                .then(inv => setInvoice(inv))
                .catch(err => setFetchErr(err?.message ?? "Failed to load invoice"))
                .finally(() => setLoading(false));
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="refresh-outline" size={16} color="#fff" />
            <Text style={[styles.retryText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Invoice body ───────────────────────────────────────── */}
      {!loading && invoice && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Dashed receipt-style wrapper */}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
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

  // Loading / error
  centred: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
    gap:            14,
    padding:        32,
  },
  loadingText: { marginTop: 4 },
  errorIcon: {
    width:          72,
    height:         72,
    borderRadius:   20,
    alignItems:     "center",
    justifyContent: "center",
    borderWidth:    1,
  },
  errorTitle: {},
  errorSub:   { textAlign: "center", lineHeight: 20 },
  retryBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 24,
    paddingVertical:   12,
    borderRadius:      12,
    marginTop:         6,
  },
  retryText: { color: "#fff" },

  // Invoice body
  scroll:  { flex: 1 },
  content: { padding: 16, gap: 16 },

  receiptWrap: {
    borderRadius: 16,
    borderWidth:  1,
    borderStyle:  "dashed",
    padding:      16,
    gap:          16,
  },

  dashes: {
    borderBottomWidth: 1,
    borderStyle:       "dashed",
    marginHorizontal:  -4,
  },

  bottomSpacer: { height: 20 },
});
