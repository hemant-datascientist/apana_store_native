// ============================================================
// ApcGridCard — one product in the APC category grid (customer app).
//
// Blinkit-style 2-col card: photo, veg mark, deal tag, name, price (+MRP
// strike), store, and an ADD control. A plain product adds straight to the
// cart with an inline −/+ stepper; a variant listing (size/colour) can't be
// 1-tapped, so its button opens the detail picker instead (§19.8 — never guess
// a size). Theme + typography tokens only.
// ============================================================

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { LiveProduct } from "../../services/liveCatalogService";

interface Props {
  product: LiveProduct;
  qty: number;                 // current qty of this product in the cart (0 = none)
  onOpen: () => void;          // tap card → product detail
  onAdd: () => void;           // plain product → add one
  onInc: () => void;
  onDec: () => void;
}

function rupee(n: number): string {
  return `₹${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}

export default function ApcGridCard({ product, qty, onOpen, onAdd, onInc, onDec }: Props) {
  const { colors } = useTheme();
  const hasVariants = product.variants.length > 0;
  const outOfStock = product.stockQty <= 0;
  const lowStock = product.stockQty > 0 && product.stockQty <= 5;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Media — tap opens detail */}
      <TouchableOpacity activeOpacity={0.85} onPress={onOpen} style={[styles.media, { backgroundColor: colors.background }]}>
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
            <Text style={[styles.dealText, { color: colors.white, fontFamily: typography.fontFamily.bold }]}>DEAL</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Body */}
      <View style={styles.body}>
        <TouchableOpacity activeOpacity={0.7} onPress={onOpen}>
          {product.brand ? (
            <Text numberOfLines={1} style={[styles.brand, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
              {product.brand}
            </Text>
          ) : null}
          <Text numberOfLines={2} style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
            {product.name}
          </Text>
        </TouchableOpacity>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
            {rupee(product.price)}
          </Text>
          {product.mrp != null && product.mrp > product.price && (
            <Text style={[styles.mrp, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
              {rupee(product.mrp)}
            </Text>
          )}
        </View>

        <View style={styles.storeRow}>
          <Ionicons name="storefront-outline" size={11} color={colors.subText} />
          <Text numberOfLines={1} style={[styles.store, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
            {product.store.name}
          </Text>
        </View>

        {/* ADD control */}
        {outOfStock ? (
          <View style={[styles.addBtn, { borderColor: colors.border }]}>
            <Text style={[styles.oosText, { color: colors.subText, fontFamily: typography.fontFamily.semiBold }]}>Out of stock</Text>
          </View>
        ) : hasVariants ? (
          <TouchableOpacity activeOpacity={0.85} onPress={onOpen} style={[styles.addBtn, { borderColor: colors.primary }]}>
            <Text style={[styles.addText, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>Options</Text>
          </TouchableOpacity>
        ) : qty > 0 ? (
          <View style={[styles.stepper, { borderColor: colors.primary, backgroundColor: colors.primary }]}>
            <TouchableOpacity hitSlop={8} onPress={onDec} style={styles.stepBtn}>
              <Ionicons name="remove" size={16} color={colors.white} />
            </TouchableOpacity>
            <Text style={[styles.qty, { color: colors.white, fontFamily: typography.fontFamily.bold }]}>{qty}</Text>
            <TouchableOpacity hitSlop={8} onPress={onInc} style={styles.stepBtn}>
              <Ionicons name="add" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity activeOpacity={0.85} onPress={onAdd} style={[styles.addBtn, { borderColor: colors.primary }]}>
            <Text style={[styles.addText, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>ADD</Text>
          </TouchableOpacity>
        )}

        {lowStock && (
          <Text style={[styles.low, { color: colors.warning, fontFamily: typography.fontFamily.medium }]}>
            Only {product.stockQty} left
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, overflow: "hidden" },
  media: { height: 118, alignItems: "center", justifyContent: "center", position: "relative" },
  image: { width: "100%", height: "100%" },
  vegMark: {
    position: "absolute", top: 8, left: 8, width: 16, height: 16, borderRadius: 3, borderWidth: 1.5,
    alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.9)",
  },
  vegDot: { width: 7, height: 7, borderRadius: 4 },
  dealTag: { position: "absolute", top: 8, right: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  dealText: { fontSize: typography.size.ss, letterSpacing: 0.5 },
  body: { padding: 10, gap: 3 },
  brand: { fontSize: typography.size.ss, textTransform: "uppercase", letterSpacing: 0.3 },
  name: { fontSize: typography.size.sm, lineHeight: 18, minHeight: 36 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 5, marginTop: 2 },
  price: { fontSize: typography.size.md },
  mrp: { fontSize: typography.size.xs, textDecorationLine: "line-through" },
  storeRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  store: { fontSize: typography.size.xs, flex: 1 },
  addBtn: {
    marginTop: 8, height: 34, borderRadius: 9, borderWidth: 1.5,
    alignItems: "center", justifyContent: "center",
  },
  addText: { fontSize: typography.size.sm, letterSpacing: 0.5 },
  oosText: { fontSize: typography.size.xs },
  stepper: {
    marginTop: 8, height: 34, borderRadius: 9, borderWidth: 1.5,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 4,
  },
  stepBtn: { paddingHorizontal: 8, height: "100%", alignItems: "center", justifyContent: "center" },
  qty: { fontSize: typography.size.sm },
  low: { fontSize: typography.size.ss, marginTop: 2 },
});
