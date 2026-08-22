// ============================================================
// NewProductRow — one real product recently listed by a nearby shop.
//
// Replaces the invented "new product" launch cards. Price comes from the
// listing, the shop name from the listing's seller. No image = the category
// glyph, never a stock photo of something else.
// ============================================================

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { LiveProduct } from "../../services/liveCatalogService";

interface NewProductRowProps {
  product: LiveProduct;
  onPress: () => void;
}

export default function NewProductRow({ product, onPress }: NewProductRowProps) {
  const { colors } = useTheme();

  // The deal price is what the customer would actually pay when one is set.
  const payable = product.dealPrice ?? product.price;
  const struck = product.dealPrice != null && product.price > product.dealPrice ? product.price : null;

  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={product.name}
    >
      {/* An empty string uri renders a broken image box on Android, so the
          glyph branch is chosen on a real value, not on truthiness alone. */}
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.img} resizeMode="cover" />
      ) : (
        <View style={[styles.img, styles.imgFallback, { backgroundColor: colors.primary + "14" }]}>
          <Ionicons name="cube-outline" size={20} color={colors.primary} />
        </View>
      )}

      <View style={styles.body}>
        <Text
          style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <Text
          style={[styles.meta, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}
          numberOfLines={1}
        >
          {product.store.name}
        </Text>
      </View>

      <View style={styles.priceCol}>
        <Text style={[styles.price, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          ₹{payable}
        </Text>
        {struck != null ? (
          <Text style={[styles.struck, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
            ₹{struck}
          </Text>
        ) : null}
        <Text style={[styles.unit, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
          {product.unit}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  img: { width: 52, height: 52, borderRadius: 10 },
  imgFallback: { alignItems: "center", justifyContent: "center" },
  body: { flex: 1, gap: 2 },
  name: {},
  meta: {},
  priceCol: { alignItems: "flex-end", gap: 1 },
  price: {},
  struck: { textDecorationLine: "line-through" },
  unit: {},
});
