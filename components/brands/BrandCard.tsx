// ============================================================
// BRAND CARD — Apana Store
//
// Square card for the 2-column brand grid. Every number on it is real: how many
// products of this brand, in how many nearby shops, from GET /catalog/brands.
// No "Verified" badge or premium crown — nothing knows those.
//
// Layout (top → bottom):
//   Circle with the brand's initial
//   Brand name (bold)
//   "N products · M shops"
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { NearbyBrand } from "../../services/liveCatalogService";

interface BrandCardProps {
  brand:   NearbyBrand;
  onPress: () => void;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function BrandCard({ brand, onPress }: BrandCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel={`${brand.name}, ${plural(brand.productCount, "product")} in ${plural(brand.shopCount, "shop")}`}
    >
      <View style={[styles.circle, { backgroundColor: colors.primary + "18" }]}>
        <Text style={[styles.initial, { color: colors.primary }]}>
          {brand.name.trim().charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
        {brand.name}
      </Text>

      <Text style={[styles.meta, { color: colors.subText }]} numberOfLines={1}>
        {plural(brand.productCount, "product")} · {plural(brand.shopCount, "shop")}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 8,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xxl },
  name: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm, textAlign: "center" },
  meta: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs, textAlign: "center" },
});
