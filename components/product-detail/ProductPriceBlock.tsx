// ============================================================
// PRODUCT PRICE BLOCK — Apana Store
//
// Displays: selling price, MRP (strikethrough), discount %,
// unit, In Stock / Out of Stock badge, and low-stock warning.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { discountPercent } from "../../data/productDetailData";

interface ProductPriceBlockProps {
  price:       number;
  mrp:         number;
  unit:        string;
  inStock:     boolean;
  stockCount:  number;
  categoryLabel: string;
  brand:       string;
  name:        string;
}

export default function ProductPriceBlock({
  price, mrp, unit, inStock, stockCount, categoryLabel, brand, name,
}: ProductPriceBlockProps) {
  const { colors } = useTheme();
  const discount   = discountPercent(price, mrp);
  const isLowStock = inStock && stockCount > 0 && stockCount <= 5;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Breadcrumb category + brand ── */}
      <Text style={[styles.crumb, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
        {categoryLabel}  ·  {brand}
      </Text>

      {/* ── Product name ── */}
      <Text style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
        {name}
      </Text>

      {/* ── Price row ── */}
      <View style={styles.priceRow}>
        <Text style={[styles.price, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xxl }]}>
          ₹{price}
        </Text>

        {discount > 0 && (
          <>
            <Text style={[styles.mrp, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.md }]}>
              ₹{mrp}
            </Text>
            <View style={[styles.discountBadge, { backgroundColor: "#DCFCE7" }]}>
              <Text style={[styles.discountText, { color: "#15803D", fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
                {discount}% OFF
              </Text>
            </View>
          </>
        )}
      </View>

      {/* ── Unit label ── */}
      <Text style={[styles.unit, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
        per {unit}
      </Text>

      {/* ── Stock status ── */}
      <View style={styles.stockRow}>
        {inStock ? (
          <View style={styles.inlineRow}>
            <Ionicons name="checkmark-circle" size={15} color="#16A34A" />
            <Text style={[styles.stockText, { color: "#16A34A", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
              In Stock
            </Text>
          </View>
        ) : (
          <View style={styles.inlineRow}>
            <Ionicons name="close-circle" size={15} color="#EF4444" />
            <Text style={[styles.stockText, { color: "#EF4444", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
              Out of Stock
            </Text>
          </View>
        )}

        {isLowStock && (
          <View style={[styles.lowStockBadge, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="warning-outline" size={12} color="#D97706" />
            <Text style={[styles.lowStockText, { color: "#D97706", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
              Only {stockCount} left!
            </Text>
          </View>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding:      16,
    borderRadius: 16,
    borderWidth:  1,
    gap:          8,
  },
  crumb:   {},
  name:    { lineHeight: 26 },
  priceRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           10,
    flexWrap:      "wrap",
  },
  price: {},
  mrp:   { textDecorationLine: "line-through" },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      6,
  },
  discountText: {},
  unit:    {},
  stockRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           10,
    flexWrap:      "wrap",
  },
  inlineRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           4,
  },
  stockText:    {},
  lowStockBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      6,
  },
  lowStockText: {},
});
