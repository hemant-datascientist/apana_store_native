// ============================================================
// CART ITEM ROW — Apana Store
//
// One item inside a store card: image placeholder, name, unit,
// price, quantity stepper, and trash (remove) button.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { CartItem } from "../../data/cartData";
import { resolveLine } from "../../lib/discount";

interface CartItemRowProps {
  item:       CartItem;
  storeId:    string;
  isLast:     boolean;
  unlocked?:  boolean; // store basket has crossed its discount threshold
  onUpdateQty: (storeId: string, itemId: string, delta: number) => void;
  onRemove:    (storeId: string, itemId: string) => void;
}

// Green for seller-funded floor; Apana Blue for brand-funded (brand pays).
const FLOOR_GREEN = "#15803D";
const BRAND_BLUE  = "#0F4C81";

export default function CartItemRow({ item, storeId, isLast, unlocked, onUpdateQty, onRemove }: CartItemRowProps) {
  const { colors } = useTheme();

  // One resolver drives both systems (brand-funded > stop-loss floor) so the
  // row always matches the cart total. Brand line stays whole for the seller.
  const info        = resolveLine(item, !!unlocked);
  const onDeal      = info.source !== "everyday";
  const isBrand     = info.source === "brand";
  const dealColor   = isBrand ? BRAND_BLUE : FLOOR_GREEN;
  const everydayTot = item.price * item.qty;
  const chargedTot  = info.unit * item.qty;

  return (
    <View style={[
      styles.row,
      !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
    ]}>

      {/* Image placeholder */}
      <View style={[styles.img, { backgroundColor: item.bg }]}>
        {item.image != null && item.image.length > 0 ? (
          <Image source={{ uri: item.image }} style={styles.imgFill} contentFit="cover" transition={200} />
        ) : (
          <Ionicons name={item.icon as any} size={26} color="rgba(0,0,0,0.25)" />
        )}
      </View>

      {/* Name + unit + price */}
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}
          numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.unit, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {item.unit}
        </Text>
        {/* §23 — WHICH SKU. Without it two sizes of the same shirt are two
            identical-looking rows and the customer cannot tell them apart. */}
        {item.variantLabel != null && item.variantLabel.length > 0 && (
          <View style={[styles.variantTag, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.variantText, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
              {item.variantLabel}
            </Text>
          </View>
        )}
        {onDeal ? (
          <>
            <View style={styles.priceRow}>
              <Text style={[styles.strike, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                ₹{everydayTot}
              </Text>
              <Text style={[styles.price, { color: dealColor, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                ₹{chargedTot}
              </Text>
            </View>
            {isBrand && (
              <View style={[styles.brandTag, { backgroundColor: `${BRAND_BLUE}14` }]}>
                <Ionicons name="ribbon-outline" size={9} color={BRAND_BLUE} />
                <Text style={[styles.brandTagText, { color: BRAND_BLUE, fontFamily: typography.fontFamily.semiBold }]}>
                  Funded by {info.brand} · seller paid in full
                </Text>
              </View>
            )}
          </>
        ) : (
          <Text style={[styles.price, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            ₹{everydayTot}
          </Text>
        )}
      </View>

      {/* Quantity stepper + trash */}
      <View style={styles.controls}>
        {/* Trash */}
        <TouchableOpacity
          style={[styles.trashBtn, { borderColor: "#FCA5A5" }]}
          onPress={() => onRemove(storeId, item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={14} color="#EF4444" />
        </TouchableOpacity>

        {/* − qty + */}
        <View style={[styles.qtyRow, { borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => onUpdateQty(storeId, item.id, -1)}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={16} color={item.qty === 1 ? colors.subText : colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.qtyNum, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            {item.qty}
          </Text>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => onUpdateQty(storeId, item.id, +1)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  imgFill: { width: "100%", height: "100%" },
  variantTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 3,
  },
  variantText: { fontSize: typography.size.ss },
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    paddingHorizontal: 12,
    paddingVertical:   10,
  },
  img: {
    width:          60,
    height:         60,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  info:  { flex: 1, gap: 2 },
  name:  { lineHeight: 18 },
  unit:  {},
  price: {},
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  strike:   { textDecorationLine: "line-through" },

  brandTag: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               3,
    alignSelf:         "flex-start",
    paddingHorizontal: 5,
    paddingVertical:   2,
    borderRadius:      4,
    marginTop:         3,
  },
  brandTagText: { fontSize: 9 },

  controls: {
    alignItems: "flex-end",
    gap:        8,
  },
  trashBtn: {
    width:          28,
    height:         28,
    borderRadius:   8,
    borderWidth:    1,
    alignItems:     "center",
    justifyContent: "center",
  },
  qtyRow: {
    flexDirection:  "row",
    alignItems:     "center",
    borderWidth:    1,
    borderRadius:   10,
    overflow:       "hidden",
  },
  qtyBtn: {
    width:          30,
    height:         30,
    alignItems:     "center",
    justifyContent: "center",
  },
  qtyNum: {
    minWidth:  24,
    textAlign: "center",
  },
});
