// ============================================================
// CATEGORY SECTION — Apana Store (Customer App)
//
// One group block: colored section header + 3-column grid of
// SubCategoryCards. Renders a wrapping flex row — no nested
// FlatList (avoids VirtualizedList nesting warning).
// ============================================================

import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CategoryGroup } from "../../../data/categoryData";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import SubCategoryCard from "./SubCategoryCard";

const SCREEN_WIDTH    = Dimensions.get("window").width;
const H_PADDING       = 12;   // horizontal padding on each side of the section
const COLS            = 3;
const COL_GAP         = 8;    // gap between columns
const CARD_WIDTH      = Math.floor(
  (SCREEN_WIDTH - H_PADDING * 2 - COL_GAP * (COLS - 1)) / COLS
);

interface CategorySectionProps {
  group:   CategoryGroup;
  onPress: (groupKey: string, subKey: string) => void;
}

export default function CategorySection({ group, onPress }: CategorySectionProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>

      {/* Section header */}
      <View style={[styles.header, { borderLeftColor: group.color }]}>
        <Ionicons name={group.icon as any} size={18} color={group.color} />
        <Text style={[styles.title, {
          color:      colors.text,
          fontFamily: typography.fontFamily.bold,
          fontSize:   typography.size.md,
        }]}>
          {group.title}
        </Text>
      </View>

      {/* 3-column flex-wrap grid */}
      <View style={styles.grid}>
        {group.subs.map(sub => (
          <SubCategoryCard
            key={sub.key}
            item={sub}
            width={CARD_WIDTH}
            onPress={item => onPress(group.key, item.key)}
          />
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
  header: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            8,
    paddingHorizontal: H_PADDING,
    paddingVertical:    12,
    borderLeftWidth:    3,
    marginBottom:       8,
  },
  title: {},
  grid: {
    flexDirection:     "row",
    flexWrap:          "wrap",
    gap:               COL_GAP,
    paddingHorizontal: H_PADDING,
  },
});
