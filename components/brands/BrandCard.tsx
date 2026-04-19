// ============================================================
// BRAND CARD — Apana Store
//
// Square card for the 2-column brand grid.
// Layout (top → bottom):
//   Colored circle with brand initial (large)
//   Premium crown icon  (top-right corner if isPremium)
//   Brand name (bold)
//   Category chip
//   Product count · Store count stats
//   Verified checkmark badge
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { Brand } from "../../data/brandsData";

interface BrandCardProps {
  brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.82}
    >
      {/* Premium crown — absolute top-right */}
      {brand.isPremium && (
        <View style={[styles.premiumBadge, { backgroundColor: "#FEF3C7" }]}>
          <Ionicons name="star" size={10} color="#D97706" />
        </View>
      )}

      {/* Brand initial circle */}
      <View style={[styles.circle, { backgroundColor: brand.color }]}>
        <Text style={[styles.initial, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xxl }]}>
          {brand.initial}
        </Text>
      </View>

      {/* Brand name */}
      <Text style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]} numberOfLines={1}>
        {brand.name}
      </Text>

      {/* Category chip */}
      <View style={[styles.categoryChip, { backgroundColor: brand.color + "18" }]}>
        <Text style={[styles.categoryText, { color: brand.color, fontFamily: typography.fontFamily.medium, fontSize: typography.size.ss }]}>
          {brand.category.charAt(0).toUpperCase() + brand.category.slice(1)}
        </Text>
      </View>

      {/* Stats */}
      <Text style={[styles.stats, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
        {brand.productCount} products · {brand.storeCount} store{brand.storeCount > 1 ? "s" : ""}
      </Text>

      {/* Verified badge */}
      {brand.isVerified && (
        <View style={styles.verifiedRow}>
          <Ionicons name="checkmark-circle" size={12} color="#22C55E" />
          <Text style={[styles.verifiedText, { color: "#22C55E", fontFamily: typography.fontFamily.medium, fontSize: typography.size.ss }]}>
            Verified
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex:          1,
    borderRadius:  16,
    borderWidth:   1,
    padding:       14,
    alignItems:    "center",
    gap:           8,
    position:      "relative",
  },

  premiumBadge: {
    position:     "absolute",
    top:          10,
    right:        10,
    width:        22,
    height:       22,
    borderRadius: 11,
    alignItems:   "center",
    justifyContent: "center",
  },

  circle: {
    width:          64,
    height:         64,
    borderRadius:   32,
    alignItems:     "center",
    justifyContent: "center",
  },
  initial: { color: "#fff" },

  name: { textAlign: "center" },

  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical:   3,
    borderRadius:      20,
  },
  categoryText: {},

  stats: { textAlign: "center" },

  verifiedRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           3,
  },
  verifiedText: {},
});
