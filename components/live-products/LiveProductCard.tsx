// ============================================================
// LiveProductCard — one real seller product on the customer side.
//
// Shows exactly what the shop scanned/added: photo, veg mark, name/brand,
// everyday price (with MRP strike + deal floor when set), and the owning
// store. Display-only for now — the point is visibility of live inventory.
// ============================================================

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { LiveProduct } from "../../services/liveCatalogService";

interface LiveProductCardProps {
  product: LiveProduct;
}

function rupee(n: number): string {
  return `₹${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}

export default function LiveProductCard({ product }: LiveProductCardProps) {
  const { colors } = useTheme();
  const lowStock = product.stockQty > 0 && product.stockQty <= 5;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* ── Media ── */}
      <View style={[styles.media, { backgroundColor: colors.background }]}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        ) : (
          <Ionicons name="cube-outline" size={34} color={colors.subText} />
        )}

        {product.isVeg != null && (
          <View style={[styles.vegMark, { borderColor: product.isVeg ? colors.success : colors.danger }]}>
            <View style={[styles.vegDot, { backgroundColor: product.isVeg ? colors.success : colors.danger }]} />
          </View>
        )}

        {product.dealPrice != null && (
          <View style={[styles.dealTag, { backgroundColor: colors.primary }]}>
            <Text style={[styles.dealText, { color: colors.white, fontFamily: typography.fontFamily.bold }]}>
              DEAL
            </Text>
          </View>
        )}
      </View>

      {/* ── Body ── */}
      <View style={styles.body}>
        {product.brand ? (
          <Text
            numberOfLines={1}
            style={[styles.brand, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}
          >
            {product.brand}
          </Text>
        ) : null}

        <Text
          numberOfLines={2}
          style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}
        >
          {product.name}
        </Text>

        {/* Price row */}
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
            {rupee(product.price)}
          </Text>
          {product.mrp != null && product.mrp > product.price && (
            <Text
              style={[styles.mrp, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}
            >
              {rupee(product.mrp)}
            </Text>
          )}
          <Text style={[styles.unit, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
            /{product.unit}
          </Text>
        </View>

        {product.dealPrice != null && (
          <Text style={[styles.dealLine, { color: colors.primary, fontFamily: typography.fontFamily.semiBold }]}>
            Deal {rupee(product.dealPrice)} on basket unlock
          </Text>
        )}

        {/* Store chip */}
        <View style={styles.storeRow}>
          <Ionicons name="storefront-outline" size={12} color={colors.subText} />
          <Text
            numberOfLines={1}
            style={[styles.storeName, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}
          >
            {product.store.name}
          </Text>
        </View>

        {lowStock && (
          <Text style={[styles.lowStock, { color: colors.warning, fontFamily: typography.fontFamily.medium }]}>
            Only {product.stockQty} left
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  media: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  image: { width: "100%", height: "100%" },
  vegMark: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  vegDot: { width: 7, height: 7, borderRadius: 4 },
  dealTag: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dealText: { fontSize: typography.size.ss, letterSpacing: 0.5 },
  body: { padding: 10, gap: 3 },
  brand: { fontSize: typography.size.ss, textTransform: "uppercase", letterSpacing: 0.3 },
  name: { fontSize: typography.size.sm, lineHeight: 18, minHeight: 36 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 5, marginTop: 2 },
  price: { fontSize: typography.size.md },
  mrp: { fontSize: typography.size.xs, textDecorationLine: "line-through" },
  unit: { fontSize: typography.size.xs },
  dealLine: { fontSize: typography.size.ss },
  storeRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  storeName: { fontSize: typography.size.xs, flex: 1 },
  lowStock: { fontSize: typography.size.ss, marginTop: 2 },
});
