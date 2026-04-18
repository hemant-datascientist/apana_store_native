// ============================================================
// CART HEADER — Apana Store
//
// Top bar: "My Cart" title + item count badge + clear all button.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface CartHeaderProps {
  totalItems: number;
  onClear:    () => void;
}

export default function CartHeader({ totalItems, onClear }: CartHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {/* Title + count badge */}
      <View style={styles.left}>
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
          My Cart
        </Text>
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.badgeText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
            {totalItems}
          </Text>
        </View>
      </View>

      {/* Clear all */}
      <TouchableOpacity onPress={onClear} activeOpacity={0.7} style={styles.clearBtn}>
        <Ionicons name="trash-outline" size={18} color="#EF4444" />
        <Text style={[styles.clearText, { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
          Clear
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  left: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           10,
  },
  title:     {},
  badge: {
    paddingHorizontal: 9,
    paddingVertical:   2,
    borderRadius:      20,
  },
  badgeText: { color: "#fff" },
  clearBtn: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           4,
  },
  clearText: { color: "#EF4444" },
});
