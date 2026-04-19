// ============================================================
// INVOICE HEADER — Apana Store
//
// Store branding block at top of invoice:
//   Logo icon · Store name · Address · GST / FSSAI · Customer care
// Matches the layout of a standard Indian retail invoice header.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface InvoiceHeaderProps {
  storeLogo:      string;
  storeLogoColor: string;
  storeName:      string;
  storeAddress:   string;
  storeCity:      string;
  storeState:     string;
  storePincode:   string;
  gstNo:          string;
  fssaiNo:        string;
  customerCare:   string;
}

export default function InvoiceHeader({
  storeLogo, storeLogoColor, storeName,
  storeAddress, storeCity, storeState, storePincode,
  gstNo, fssaiNo, customerCare,
}: InvoiceHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>

      {/* ── Logo circle ── */}
      <View style={[styles.logoCircle, { backgroundColor: storeLogoColor + "18" }]}>
        <Ionicons name={storeLogo as any} size={36} color={storeLogoColor} />
      </View>

      {/* ── Store name ── */}
      <Text style={[styles.storeName, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
        {storeName}
      </Text>

      {/* ── Address ── */}
      <Text style={[styles.address, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
        {storeAddress}
      </Text>
      <Text style={[styles.address, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
        {storeCity}, {storeState} — {storePincode}
      </Text>

      {/* ── GST + FSSAI ── */}
      <View style={styles.regRow}>
        <View style={[styles.regPill, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.regLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
            GST
          </Text>
          <Text style={[styles.regValue, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
            {gstNo}
          </Text>
        </View>

        {fssaiNo !== "" && (
          <View style={[styles.regPill, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.regLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
              FSSAI
            </Text>
            <Text style={[styles.regValue, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
              {fssaiNo}
            </Text>
          </View>
        )}
      </View>

      {/* ── Customer care ── */}
      <View style={styles.careRow}>
        <Ionicons name="call-outline" size={12} color={colors.subText} />
        <Text style={[styles.care, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          Cust. Care: {customerCare}
        </Text>
      </View>

      {/* ── INVOICE label ── */}
      <View style={[styles.invoiceBadge, { backgroundColor: colors.primary }]}>
        <Text style={[styles.invoiceLabel, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          TAX INVOICE
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap:        8,
    paddingBottom: 4,
  },
  logoCircle: {
    width:          80,
    height:         80,
    borderRadius:   40,
    alignItems:     "center",
    justifyContent: "center",
  },
  storeName: {
    textAlign:  "center",
    lineHeight: 26,
    letterSpacing: 0.5,
  },
  address: {
    textAlign:  "center",
    lineHeight: 18,
  },
  regRow: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           8,
    justifyContent:"center",
    marginTop:     4,
  },
  regPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      8,
    borderWidth:       1,
  },
  regLabel:  {},
  regValue:  {},
  careRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           5,
  },
  care: {},
  invoiceBadge: {
    paddingHorizontal: 28,
    paddingVertical:   6,
    borderRadius:      8,
    marginTop:         4,
  },
  invoiceLabel: { color: "#fff", letterSpacing: 1.5 },
});
