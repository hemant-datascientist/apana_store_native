// ============================================================
// DetailHeader — title, brand, Verified identity badge, GTIN row.
// The "verified" badge shows only for products with a real scraped GTIN
// (registry-verified identity), matching the SmartConsumer detail header.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

interface DetailHeaderProps {
  name: string;
  brand: string | null;
  verified: boolean;
  gtin: string | null;
}

export default function DetailHeader({ name, brand, verified, gtin }: DetailHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
        {name}
      </Text>

      {brand ? (
        <Text style={[styles.brand, { color: colors.subText, fontFamily: typography.fontFamily.semiBold }]}>
          {brand.toUpperCase()}
        </Text>
      ) : null}

      {verified && (
        <View style={[styles.verified, { backgroundColor: colors.primary }]}>
          <Ionicons name="checkmark-circle" size={14} color={colors.white} />
          <Text style={[styles.verifiedText, { color: colors.white, fontFamily: typography.fontFamily.semiBold }]}>
            Verified
          </Text>
        </View>
      )}

      {gtin ? (
        <View style={styles.gtinRow}>
          <Ionicons name="qr-code-outline" size={18} color={colors.subText} />
          <Text style={[styles.gtin, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
            GTIN: {gtin}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8, marginTop: 16 },
  name: { fontSize: typography.size.xxl, lineHeight: 30 },
  brand: { fontSize: typography.size.sm, letterSpacing: 0.5 },
  verified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  verifiedText: { fontSize: typography.size.xs },
  gtinRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  gtin: { fontSize: typography.size.md, letterSpacing: 0.3 },
});
