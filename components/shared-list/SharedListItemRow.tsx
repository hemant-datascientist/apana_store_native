// ============================================================
// SHARED LIST ITEM ROW — Apana Store
//
// Single item row inside a shared list detail view.
// Tap the checkbox to toggle checked state.
// Checked items show strikethrough text + green checkmark.
// Shows: checkbox | name (strikethrough if done) | qty chip | store hint
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { ShoppingItem } from "../../data/sharedListData";

interface SharedListItemRowProps {
  item:     ShoppingItem;
  onToggle: () => void;
  isLast:   boolean;
}

export default function SharedListItemRow({ item, onToggle, isLast }: SharedListItemRowProps) {
  const { colors } = useTheme();

  return (
    <>
      <TouchableOpacity style={styles.row} onPress={onToggle} activeOpacity={0.7}>

        {/* Checkbox */}
        <TouchableOpacity onPress={onToggle} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons
            name={item.checked ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={item.checked ? "#22C55E" : colors.border}
          />
        </TouchableOpacity>

        {/* Item name + store hint */}
        <View style={styles.content}>
          <Text style={[styles.name, {
            color:             item.checked ? colors.subText : colors.text,
            fontFamily:        item.checked ? typography.fontFamily.regular : typography.fontFamily.medium,
            fontSize:          typography.size.sm,
            textDecorationLine: item.checked ? "line-through" : "none",
          }]}>
            {item.name}
          </Text>
          {item.storeHint && (
            <Text style={[styles.storeHint, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
              {item.storeHint}
            </Text>
          )}
        </View>

        {/* Qty chip */}
        <View style={[styles.qtyChip, {
          backgroundColor: item.checked ? colors.border + "40" : colors.primary + "12",
        }]}>
          <Text style={[styles.qtyText, {
            color:      item.checked ? colors.subText : colors.primary,
            fontFamily: typography.fontFamily.semiBold,
            fontSize:   typography.size.ss,
          }]}>
            {item.qty}
          </Text>
        </View>

      </TouchableOpacity>

      {/* Divider between items (skip after last) */}
      {!isLast && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    paddingVertical:   12,
    paddingHorizontal: 14,
  },

  content: { flex: 1 },
  name:    { lineHeight: 20 },
  storeHint: { marginTop: 2 },

  qtyChip: {
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
  },
  qtyText: {},

  divider: { height: 1, marginHorizontal: 14 },
});
