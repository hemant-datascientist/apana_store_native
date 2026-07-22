// ============================================================
// DETAIL BUY BAR — the sticky "Add to cart" foot of a live product.
//
// Disabled states are spelled out rather than greyed silently: a customer who
// taps a dead button and gets nothing assumes the app is broken, so the button
// itself says why it cannot be tapped ("Out of stock", "Choose an option").
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

interface DetailBuyBarProps {
  price: number;
  mrp: number | null;
  // Variants exist but none is fully chosen yet.
  needsChoice: boolean;
  stock: number;
  inCartQty: number;
  onAdd: () => void;
  onGoToCart: () => void;
}

export default function DetailBuyBar({
  price, mrp, needsChoice, stock, inCartQty, onAdd, onGoToCart,
}: DetailBuyBarProps) {
  const { colors } = useTheme();

  const soldOut = stock <= 0;
  const atCeiling = inCartQty > 0 && inCartQty >= stock;
  const disabled = needsChoice || soldOut || atCeiling;

  const label = needsChoice
    ? "Choose an option"
    : soldOut
      ? "Out of stock"
      : atCeiling
        ? `All ${stock} in your cart`
        : "Add to cart";

  return (
    <View style={[styles.bar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <View style={styles.priceCol}>
        <View style={styles.priceRow}>
          <Text style={[styles.price, {
            color: colors.text,
            fontFamily: typography.fontFamily.bold,
            fontSize: typography.size.lg,
          }]}>
            ₹{price % 1 === 0 ? price.toFixed(0) : price.toFixed(2)}
          </Text>
          {mrp != null && mrp > price && (
            <Text style={[styles.mrp, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
              ₹{mrp.toFixed(0)}
            </Text>
          )}
        </View>
        {inCartQty > 0 && (
          <TouchableOpacity onPress={onGoToCart} activeOpacity={0.7}>
            <Text style={[styles.inCart, { color: colors.primary, fontFamily: typography.fontFamily.semiBold }]}>
              {inCartQty} in cart · View
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.cta, { backgroundColor: disabled ? colors.border : colors.primary }]}
        onPress={onAdd}
        disabled={disabled}
        activeOpacity={0.85}
      >
        {!disabled && <Ionicons name="cart-outline" size={18} color={colors.white} />}
        <Text style={[styles.ctaText, {
          color: disabled ? colors.subText : colors.white,
          fontFamily: typography.fontFamily.semiBold,
        }]}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  priceCol: { flex: 1, gap: 2 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  price: {},
  mrp: { fontSize: typography.size.sm, textDecorationLine: "line-through" },
  inCart: { fontSize: typography.size.xs },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },
  ctaText: { fontSize: typography.size.md },
});
