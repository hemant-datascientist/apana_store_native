// ============================================================
// CART ITEM ROW — Apana Store
//
// One item inside a store card: image placeholder, name, unit,
// price, quantity stepper, and trash (remove) button.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { CartItem } from "../../data/cartData";

interface CartItemRowProps {
  item:       CartItem;
  storeId:    string;
  isLast:     boolean;
  onUpdateQty: (storeId: string, itemId: string, delta: number) => void;
  onRemove:    (storeId: string, itemId: string) => void;
}

export default function CartItemRow({ item, storeId, isLast, onUpdateQty, onRemove }: CartItemRowProps) {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.row,
      !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
    ]}>

      {/* Image placeholder */}
      <View style={[styles.img, { backgroundColor: item.bg }]}>
        <Ionicons name={item.icon as any} size={26} color="rgba(0,0,0,0.25)" />
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
        <Text style={[styles.price, { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          ₹{item.price * item.qty}
        </Text>
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
