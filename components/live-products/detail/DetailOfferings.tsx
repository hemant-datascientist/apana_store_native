// ============================================================
// DETAIL OFFERINGS — one product, every way it is sold nearby.
//
// The point of the unified listing: a shopper sees ONE "Atta" and picks the
// offering that suits them — ₹40/kg loose from a shop they trust, or a sealed
// branded pack. Branded shelf items first (the BE sorts that way), the local
// loose option below, each with the signal that makes it trustworthy: a brand
// name, or the seller's own reputation.
//
// Renders nothing when there are no alternatives — an empty "Also available"
// heading is worse than no heading (§19.8).
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import { formatMeasure, formatRate } from "../../../lib/measure";
import type { Offering } from "../../../services/offeringsService";

interface Props {
  offerings: Offering[];
  loading?: boolean;
  onSelect: (o: Offering) => void;
}

export default function DetailOfferings({ offerings, loading, onSelect }: Props) {
  const { colors } = useTheme();
  if (loading || offerings.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.heading, { color: colors.text }]}>Also available as</Text>
      <Text style={[styles.sub, { color: colors.subText }]}>
        Same product, different shops and pack sizes
      </Text>

      {offerings.map((o) => {
        const loose = o.sale_mode === "loose";
        const outOfStock = o.stock <= 0;

        // Loose quotes a rate (₹40/kg); packaged quotes the pack price.
        const priceLabel = loose
          ? formatRate(o.measure_kind, o.price_per_measure_cents, o.unit)
          : `₹${((o.price_cents ?? 0) / 100).toFixed(0)}`;

        // What the shopper is actually buying: a weighed amount vs a pack.
        const formLabel = loose
          ? `Loose · min ${formatMeasure(o.measure_kind, o.min_measure ?? 1, o.unit)}`
          : o.unit
            ? `Packaged · ${o.unit}`
            : "Packaged";

        return (
          <TouchableOpacity
            key={o.id}
            style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => onSelect(o)}
            disabled={outOfStock}
            activeOpacity={0.75}
          >
            <View style={styles.left}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                {o.name}
              </Text>

              <View style={styles.metaRow}>
                {/* Trust cue. A brand name IS the assurance for a sealed pack;
                    an unbranded scoop is backed by the shop's own reputation,
                    so say that rather than leaving the space blank. */}
                {o.is_branded && o.brand ? (
                  <View style={[styles.chip, { backgroundColor: colors.primary + "18" }]}>
                    <Ionicons name="ribbon-outline" size={11} color={colors.primary} />
                    <Text style={[styles.chipText, { color: colors.primary }]}>{o.brand}</Text>
                  </View>
                ) : (
                  <View style={[styles.chip, { backgroundColor: colors.success + "18" }]}>
                    <Ionicons name="storefront-outline" size={11} color={colors.success} />
                    <Text style={[styles.chipText, { color: colors.success }]}>Local · unbranded</Text>
                  </View>
                )}
                <Text style={[styles.form, { color: colors.subText }]}>{formLabel}</Text>
              </View>
            </View>

            <View style={styles.right}>
              <Text style={[styles.price, { color: colors.text }]}>{priceLabel}</Text>
              {outOfStock ? (
                <Text style={[styles.stock, { color: colors.danger }]}>Out of stock</Text>
              ) : (
                <Text style={[styles.stock, { color: colors.subText }]}>
                  {loose ? formatMeasure(o.measure_kind, o.stock, o.unit) : `${o.stock} left`}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 20 },
  heading: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
  },
  sub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.xs,
    marginTop: 2,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  left: { flex: 1, marginRight: 12 },
  name: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.size.sm,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  chipText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.ss,
  },
  form: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.ss,
    flexShrink: 1,
  },
  right: { alignItems: "flex-end" },
  price: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
  },
  stock: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.ss,
    marginTop: 2,
  },
});
