// ============================================================
// SEARCH SORT BAR — Apana Store
//
// Horizontally scrollable sort chips: Relevance | Price Low→High
// | Price High→Low | Top Rated. Appears below the tab bar.
// ============================================================

import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { SearchSort, SEARCH_SORT_OPTIONS } from "../../data/searchResultsData";

interface SearchSortBarProps {
  activeSort: SearchSort;
  onSelect:   (s: SearchSort) => void;
}

// Map sort keys to Ionicons glyphs
const SORT_ICONS: Record<SearchSort, string> = {
  relevance:  "sparkles-outline",
  price_asc:  "trending-up-outline",
  price_desc: "trending-down-outline",
  rating:     "star-outline",
};

export default function SearchSortBar({ activeSort, onSelect }: SearchSortBarProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={[styles.scroll, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
    >
      {SEARCH_SORT_OPTIONS.map(opt => {
        const isActive = opt.key === activeSort;
        return (
          <TouchableOpacity
            key={opt.key}
            style={[
              styles.chip,
              isActive
                ? { backgroundColor: colors.primary, borderColor: colors.primary }
                : { backgroundColor: colors.background, borderColor: colors.border },
            ]}
            onPress={() => onSelect(opt.key)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={SORT_ICONS[opt.key] as any}
              size={13}
              color={isActive ? "#fff" : colors.subText}
            />
            <Text style={[
              styles.label,
              {
                color: isActive ? "#fff" : colors.subText,
                fontFamily: isActive ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                fontSize: typography.size.xs,
              },
            ]}>
              {opt.label}
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
  content: {
    flexDirection:  "row",
    gap:            8,
    paddingHorizontal: 16,
    paddingVertical:   10,
  },
  chip: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    paddingHorizontal: 12,
    paddingVertical:   7,
    borderRadius:      20,
    borderWidth:       1,
  },
  label: {},
});
