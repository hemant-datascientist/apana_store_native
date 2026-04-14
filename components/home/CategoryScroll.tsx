// ============================================================
// CATEGORY SCROLL — Apana Store (Customer App)
//
// Horizontal scroll of product categories — sits in the
// themed feed area (white/light bg), NOT in the dark hero.
//
// Each item: small rounded icon square (colored bg) + label.
// Active:   primary-colored icon + colored bg + semiBold label
// Inactive: subText icon + border-colored bg + regular label
// ============================================================

import React from "react";
import {
  ScrollView, View, Text, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../theme/typography";
import { Category } from "../../data/homeData";
import useTheme from "../../theme/useTheme";

interface CategoryScrollProps {
  categories: Category[];
  activeKey:  string;
  onSelect:   (key: string) => void;
}

export default function CategoryScroll({
  categories, activeKey, onSelect,
}: CategoryScrollProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      style={[styles.scroll, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
    >
      {categories.map(cat => {
        const active = cat.key === activeKey;
        return (
          <TouchableOpacity
            key={cat.key}
            style={styles.item}
            onPress={() => onSelect(cat.key)}
            activeOpacity={0.7}
          >
            {/* Icon circle */}
            <View style={[
              styles.iconWrap,
              {
                backgroundColor: active
                  ? colors.primary + "18"
                  : colors.border + "80",
              },
            ]}>
              <Ionicons
                name={cat.icon as any}
                size={20}
                color={active ? colors.primary : colors.subText}
              />
            </View>

            {/* Label */}
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  color:      active ? colors.primary : colors.subText,
                  fontFamily: active
                    ? typography.fontFamily.semiBold
                    : typography.fontFamily.regular,
                  fontSize: typography.size.xs,
                },
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    borderBottomWidth: 1,
  },
  list: {
    paddingHorizontal: 10,
    paddingVertical:    10,
    gap:               6,
  },
  item: {
    alignItems:     "center",
    gap:             5,
    paddingHorizontal: 6,
    minWidth:        58,
  },
  iconWrap: {
    width:          42,
    height:         42,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  label: {
    textAlign:     "center",
    letterSpacing: 0.1,
  },
});
