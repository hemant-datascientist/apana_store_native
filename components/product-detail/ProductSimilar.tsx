// ============================================================
// PRODUCT SIMILAR — Apana Store
//
// Horizontal scroll of similar product cards.
// Each card shows placeholder image, name, price, MRP, rating.
// Tapping navigates to that product's detail screen.
// ============================================================

import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { SimilarProduct, discountPercent } from "../../data/productDetailData";

interface ProductSimilarProps {
  products: SimilarProduct[];
}

export default function ProductSimilar({ products }: ProductSimilarProps) {
  const { colors } = useTheme();
  const router     = useRouter();

  if (products.length === 0) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Header ── */}
      <View style={styles.titleRow}>
        <Ionicons name="grid-outline" size={16} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          Similar Products
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Horizontal scroll ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {products.map(p => {
          const disc = discountPercent(p.price, p.mrp);
          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.productCard, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => router.push(`/product-detail?id=${p.id}`)}
              activeOpacity={0.85}
            >
              {/* Image placeholder */}
              <View style={[styles.imgBox, { backgroundColor: p.color }]}>
                <Ionicons name={p.icon as any} size={32} color="#00000022" />
                {disc > 0 && (
                  <View style={[styles.discBadge, { backgroundColor: "#DCFCE7" }]}>
                    <Text style={[styles.discText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
                      {disc}%
                    </Text>
                  </View>
                )}
              </View>

              {/* Info */}
              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]} numberOfLines={2}>
                  {p.name}
                </Text>

                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={10} color="#F59E0B" />
                  <Text style={[styles.rating, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                    {p.rating}
                  </Text>
                </View>

                <Text style={[styles.price, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                  ₹{p.price}
                </Text>
                {p.mrp > p.price && (
                  <Text style={[styles.mrp, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                    ₹{p.mrp}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth:  1,
    overflow:     "hidden",
  },
  titleRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  title:   {},
  divider: { height: 1 },
  scroll:  { padding: 12, gap: 10 },
  productCard: {
    width:        130,
    borderRadius: 12,
    borderWidth:  1,
    overflow:     "hidden",
  },
  imgBox: {
    height:         110,
    alignItems:     "center",
    justifyContent: "center",
  },
  discBadge: {
    position:          "absolute",
    top:               6,
    left:              6,
    paddingHorizontal: 5,
    paddingVertical:   2,
    borderRadius:      5,
  },
  discText:  { color: "#15803D" },
  info:      { padding: 8, gap: 4 },
  name:      { lineHeight: 17 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  rating:    {},
  price:     {},
  mrp:       { textDecorationLine: "line-through" },
});
