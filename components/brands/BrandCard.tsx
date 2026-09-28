// ============================================================
// BRAND CARD — Apana Store
//
// Square card for the 2-column brand grid. A search shortcut, not a stock
// claim — no product/store counts, no "Verified" badge, no premium crown
// (none of that is knowable without a real per-brand backend, and
// inventing it was the defect this card used to carry).
//
// Layout (top → bottom):
//   Colored circle with brand initial (large)
//   Brand name (bold)
//   Category chip
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { Brand } from "../../data/brandsData";

interface BrandCardProps {
  brand:   Brand;
  onPress: () => void;
}

export default function BrandCard({ brand, onPress }: BrandCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.82}
    >
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
});
