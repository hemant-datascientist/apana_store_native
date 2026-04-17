// ============================================================
// SUB CATEGORY CARD — Apana Store (Customer App)
//
// Single tile in the 3-column category grid.
// Top:    colored square with a centered Ionicons icon.
// Bottom: label (2 lines max, centered).
// Width passed from parent = (screenWidth - padding - gaps) / 3.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SubCategory } from "../../../data/categoryData";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

interface SubCategoryCardProps {
  item:    SubCategory;
  width:   number;
  onPress: (item: SubCategory) => void;
}

export default function SubCategoryCard({ item, width, onPress }: SubCategoryCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { width, backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onPress(item)}
      activeOpacity={0.75}
    >
      {/* Colored image tile */}
      <View style={[styles.tile, { backgroundColor: item.color, width: width - 16, height: width - 16 }]}>
        <Ionicons name={item.icon as any} size={34} color="rgba(0,0,0,0.38)" />
      </View>

      {/* Label */}
      <Text
        numberOfLines={2}
        style={[styles.label, {
          color:      colors.text,
          fontFamily: typography.fontFamily.medium,
          fontSize:   typography.size.xs,
        }]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth:  1,
    padding:      8,
    alignItems:   "center",
    gap:          7,
  },
  tile: {
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },
  label: {
    textAlign:  "center",
    lineHeight: 17,
  },
});
