// ============================================================
// PRODUCT BOTTOM BAR — Apana Store
//
// Sticky bottom action bar: favourite toggle, qty stepper,
// Add to Cart button, and Buy Now button.
// Wires into CartContext.addItem() and navigates to checkout.
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface ProductBottomBarProps {
  isFav:         boolean;
  onFavToggle:   () => void;
  qty:           number;
  onQtyDec:      () => void;
  onQtyInc:      () => void;
  inStock:       boolean;
  onAddToCart:   () => void;
  onBuyNow:      () => void;
  cartQty:       number;   // already-in-cart qty (0 if not added)
}

export default function ProductBottomBar({
  isFav, onFavToggle,
  qty, onQtyDec, onQtyInc,
  inStock, onAddToCart, onBuyNow,
  cartQty,
}: ProductBottomBarProps) {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.card,
        borderTopColor:  colors.border,
      },
    ]}>

      {/* ── Favourite toggle ── */}
      <TouchableOpacity
        style={[styles.favBtn, { borderColor: colors.border }]}
        onPress={onFavToggle}
        activeOpacity={0.75}
      >
        <Ionicons
          name={isFav ? "heart" : "heart-outline"}
          size={22}
          color={isFav ? "#EF4444" : colors.subText}
        />
      </TouchableOpacity>

      {/* ── Qty stepper ── */}
      <View style={[styles.stepper, { borderColor: colors.border }]}>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={onQtyDec}
          disabled={qty <= 1}
          activeOpacity={0.75}
        >
          <Ionicons
            name="remove"
            size={18}
            color={qty <= 1 ? colors.border : colors.text}
          />
        </TouchableOpacity>

        <Text style={[styles.qtyText, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
          {qty}
        </Text>

        <TouchableOpacity
          style={styles.stepBtn}
          onPress={onQtyInc}
          activeOpacity={0.75}
        >
          <Ionicons name="add" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* ── Add to Cart / In Cart indicator ── */}
      <TouchableOpacity
        style={[
          styles.actionBtn,
          {
            backgroundColor: inStock ? colors.card : colors.border,
            borderColor:     inStock ? colors.primary : colors.border,
            borderWidth:     1,
          },
        ]}
        onPress={onAddToCart}
        disabled={!inStock}
        activeOpacity={0.8}
      >
        {cartQty > 0 && (
          <View style={[styles.cartBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.cartBadgeText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
              {cartQty}
            </Text>
          </View>
        )}
        <Ionicons
          name="cart-outline"
          size={17}
          color={inStock ? colors.primary : colors.subText}
        />
        <Text style={[
          styles.actionText,
          {
            color:      inStock ? colors.primary : colors.subText,
            fontFamily: typography.fontFamily.semiBold,
            fontSize:   typography.size.sm,
          },
        ]}>
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Text>
      </TouchableOpacity>

      {/* ── Buy Now ── */}
      <TouchableOpacity
        style={[
          styles.actionBtn,
          { backgroundColor: inStock ? colors.primary : colors.border },
        ]}
        onPress={onBuyNow}
        disabled={!inStock}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.actionText,
          {
            color:      "#FFFFFF",
            fontFamily: typography.fontFamily.bold,
            fontSize:   typography.size.sm,
          },
        ]}>
          Buy Now
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            8,
    paddingHorizontal: 12,
    paddingTop:     10,
    paddingBottom:  Platform.OS === "ios" ? 28 : 12,
    borderTopWidth: 1,
  },
  favBtn: {
    width:          44,
    height:         44,
    borderRadius:   12,
    borderWidth:    1,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  stepper: {
    flexDirection:  "row",
    alignItems:     "center",
    borderWidth:    1,
    borderRadius:   12,
    overflow:       "hidden",
    flexShrink:     0,
  },
  stepBtn: {
    width:          34,
    height:         44,
    alignItems:     "center",
    justifyContent: "center",
  },
  qtyText: {
    width:     26,
    textAlign: "center",
  },
  actionBtn: {
    flex:           1,
    height:         44,
    borderRadius:   12,
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            5,
    position:       "relative",
  },
  actionText: {},
  cartBadge: {
    position:      "absolute",
    top:           4,
    right:         4,
    width:         16,
    height:        16,
    borderRadius:  8,
    alignItems:    "center",
    justifyContent: "center",
  },
  cartBadgeText: { color: "#FFFFFF" },
});
