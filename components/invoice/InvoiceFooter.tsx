// ============================================================
// INVOICE FOOTER — Apana Store
//
// "Thank You" note + Share as Text action button.
// (PDF export is a future backend feature — shown as disabled.)
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Share } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface InvoiceFooterProps {
  thankYouNote:  string;
  shareText:     string;    // pre-built share body from parent
  storeName:     string;
  billNo:        string;
}

export default function InvoiceFooter({
  thankYouNote, shareText, storeName, billNo,
}: InvoiceFooterProps) {
  const { colors } = useTheme();

  async function handleShare() {
    await Share.share({
      title:   `Invoice ${billNo} — ${storeName}`,
      message: shareText,
    });
  }

  return (
    <View style={styles.wrapper}>

      {/* ── Thank you note ── */}
      <View style={[styles.thankCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="heart-outline" size={18} color={colors.primary} />
        <Text style={[styles.thankText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {thankYouNote}
        </Text>
      </View>

      {/* ── Apana branding strip ── */}
      <View style={[styles.brandStrip, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
        <Text style={[styles.brandText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
          Powered by
        </Text>
        <Text style={[styles.brandName, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          Apana Store
        </Text>
        <Text style={[styles.brandTagline, { color: colors.primary, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
          Curated Precision
        </Text>
      </View>

      {/* ── Action buttons ── */}
      <View style={styles.actions}>

        {/* Share as Text */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          onPress={handleShare}
          activeOpacity={0.85}
        >
          <Ionicons name="share-social-outline" size={17} color="#fff" />
          <Text style={[styles.actionText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            Share Invoice
          </Text>
        </TouchableOpacity>

        {/* Download PDF — future feature */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.border }]}
          disabled
          activeOpacity={0.5}
        >
          <Ionicons name="download-outline" size={17} color={colors.subText} />
          <Text style={[styles.actionText, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
            Download PDF
          </Text>
          <View style={[styles.soonBadge, { backgroundColor: colors.primary + "20" }]}>
            <Text style={[styles.soonText, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
              Soon
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 12 },
  thankCard: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               10,
    padding:           14,
    borderRadius:      12,
    borderWidth:       1,
  },
  thankText: {
    flex:       1,
    lineHeight: 18,
    textAlign:  "center",
  },
  brandStrip: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            6,
    padding:        10,
    borderRadius:   10,
    borderWidth:    1,
  },
  brandText:    {},
  brandName:    {},
  brandTagline: {},
  actions: {
    gap: 10,
  },
  actionBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             8,
    paddingVertical: 14,
    borderRadius:    12,
    position:        "relative",
  },
  actionText: { color: "#fff" },
  soonBadge: {
    position:          "absolute",
    right:             12,
    paddingHorizontal: 7,
    paddingVertical:   2,
    borderRadius:      6,
  },
  soonText: {},
});
