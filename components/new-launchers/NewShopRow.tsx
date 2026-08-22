// ============================================================
// NewShopRow — one real shop that recently joined Apana.
//
// Replaces LaunchCard, which rendered hand-written "highlights" like
// "90-day warranty" and "certified technicians" for businesses that did not
// exist. A shop row shows only what the seller actually gave us: its name,
// what kind of shop it is, its city, how far away it is, and how long ago it
// joined. Anything absent is omitted, never filled in.
// ============================================================

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { BucketStore } from "../../services/storeBucketService";

interface NewShopRowProps {
  shop: BucketStore;
  /** null when the join date cannot be described — the row then shows none. */
  ageLabel: string | null;
  onPress: () => void;
}

export default function NewShopRow({ shop, ageLabel, onPress }: NewShopRowProps) {
  const { colors } = useTheme();

  // A rating of 0 means NO reviews yet, not a bad shop. Showing "0.0 ★" on a
  // shop that opened this week is a worse lie than showing nothing.
  const hasRating = shop.review_count > 0;
  const distanceKm = shop.distance_m == null ? null : Math.round((shop.distance_m / 1000) * 10) / 10;

  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${shop.name}, ${shop.category_label}`}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.primary + "18" }]}>
        <Ionicons name="storefront-outline" size={22} color={colors.primary} />
      </View>

      <View style={styles.body}>
        <Text
          style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md }]}
          numberOfLines={1}
        >
          {shop.name}
        </Text>

        <Text
          style={[styles.meta, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}
          numberOfLines={1}
        >
          {[shop.category_label, shop.city].filter(Boolean).join(" · ")}
        </Text>

        <View style={styles.chips}>
          {ageLabel ? (
            <View style={[styles.chip, { backgroundColor: "#22C55E18" }]}>
              <Text style={[styles.chipText, { color: "#16A34A", fontFamily: typography.fontFamily.medium, fontSize: typography.size.ss }]}>
                {ageLabel}
              </Text>
            </View>
          ) : null}

          {distanceKm != null ? (
            <View style={[styles.chip, { backgroundColor: colors.primary + "14" }]}>
              <Text style={[styles.chipText, { color: colors.primary, fontFamily: typography.fontFamily.medium, fontSize: typography.size.ss }]}>
                {distanceKm} km
              </Text>
            </View>
          ) : null}

          {hasRating ? (
            <View style={styles.rating}>
              <Ionicons name="star" size={11} color="#F59E0B" />
              <Text style={[styles.chipText, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.ss }]}>
                {shop.rating.toFixed(1)} ({shop.review_count})
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.subText} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, gap: 3 },
  name: {},
  meta: {},
  chips: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" },
  chip: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  chipText: {},
  rating: { flexDirection: "row", alignItems: "center", gap: 3 },
});
