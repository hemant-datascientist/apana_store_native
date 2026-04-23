// ============================================================
// SEARCH PRODUCT CARD — Apana Store
//
// 2-column product card shown in the Products tab of search results.
// Layout:
//   [Thumbnail (icon placeholder) — badge top-left, discount top-right]
//   Name (2 lines max)
//   Category
//   Price + MRP strike-through
//   ⭐ Rating · store name
//   [Add] button (primary, full-width)
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { SearchProductResult } from "../../data/searchResultsData";

interface SearchProductCardProps {
  product:   SearchProductResult;
  onPress:   () => void;
  onAddCart: () => void;
}

// Round down; returns 0 if no discount (keeps the pill hidden)
function discountPct(price: number, mrp: number): number {
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export default function SearchProductCard({ product, onPress, onAddCart }: SearchProductCardProps) {
  const { colors } = useTheme();
  const pct = discountPct(product.price, product.mrp);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* ── Thumbnail ── */}
      <View style={[styles.imagePlaceholder, { backgroundColor: product.iconBg }]}>
        <Ionicons name={product.icon as any} size={38} color={colors.text} style={{ opacity: 0.5 }} />

        {/* Badge overlay (e.g. "FRESH", "BESTSELLER") */}
        {!!product.badge && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.badgeText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
              {product.badge}
            </Text>
          </View>
        )}

        {/* Discount pill — uses theme success colour for consistency */}
        {pct > 0 && (
          <View style={[styles.discountPill, { backgroundColor: colors.success }]}>
            <Text style={[styles.discountText, { fontFamily: typography.fontFamily.bold, fontSize: 9 }]}>
              {pct}% OFF
            </Text>
          </View>
        )}
      </View>

      {/* ── Info block ── */}
      <View style={styles.info}>

        {/* Product name */}
        <Text
          numberOfLines={2}
          style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}
        >
          {product.name}
        </Text>

        {/* Category */}
        <Text
          numberOfLines={1}
          style={[styles.cat, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 10 }]}
        >
          {product.category}
        </Text>

        {/* Price row */}
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            ₹{product.price.toLocaleString("en-IN")}
          </Text>
          {pct > 0 && (
            <Text
              numberOfLines={1}
              style={[styles.mrp, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}
            >
              ₹{product.mrp.toLocaleString("en-IN")}
            </Text>
          )}
        </View>

        {/* Rating + store */}
        <View style={styles.metaRow}>
          <Ionicons name="star" size={10} color={colors.warning} />
          <Text style={[styles.rating, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: 10 }]}>
            {product.rating}
          </Text>
          <View style={[styles.dot, { backgroundColor: colors.border }]} />
          <Text numberOfLines={1} style={[styles.store, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 10 }]}>
            {product.storeName}
          </Text>
        </View>

        {/* Add to Cart */}
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={(e) => { e.stopPropagation?.(); onAddCart(); }}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={14} color="#fff" />
          <Text style={[styles.addText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            Add
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex:         1,
    borderRadius: 14,
    borderWidth:  1,
    overflow:     "hidden",
  },

  // Thumbnail
  imagePlaceholder: {
    height:         124,
    alignItems:     "center",
    justifyContent: "center",
    position:       "relative",
  },
  badge: {
    position:          "absolute",
    top:               8,
    left:              8,
    paddingHorizontal: 7,
    paddingVertical:   2,
    borderRadius:      20,
  },
  badgeText: { color: "#fff" },
  discountPill: {
    position:          "absolute",
    top:               8,
    right:             8,
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:      6,
  },
  discountText: { color: "#fff" },

  // Info
  info: {
    padding: 10,
    gap:     5,
  },
  name: { lineHeight: 17 },
  cat:  {},
  priceRow: {
    flexDirection: "row",
    alignItems:    "baseline",
    gap:           5,
  },
  price: {},
  mrp: { textDecorationLine: "line-through" },
  metaRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           3,
  },
  rating: {},
  dot: {
    width:            3,
    height:           3,
    borderRadius:     2,
    marginHorizontal: 2,
  },
  store: { flex: 1 },

  addBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             4,
    paddingVertical: 8,
    borderRadius:    10,
    marginTop:       2,
  },
  addText: { color: "#fff" },
});
