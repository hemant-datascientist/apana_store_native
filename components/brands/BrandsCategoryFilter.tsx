// ============================================================
// BRANDS CATEGORY FILTER — Apana Store
//
// Horizontal scrollable category pill filter.
// Active pill: primary color background + white text.
// Inactive pill: card background + border.
// ============================================================

import React from "react";
import { ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { BrandCategory, BRAND_CATEGORIES } from "../../data/brandsData";

interface BrandsCategoryFilterProps {
  active:   BrandCategory;
  onSelect: (cat: BrandCategory) => void;
}

export default function BrandsCategoryFilter({ active, onSelect }: BrandsCategoryFilterProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {BRAND_CATEGORIES.map(cat => {
        const isActive = cat.key === active;
        return (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? colors.primary : colors.card,
                borderColor:     isActive ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onSelect(cat.key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.label, {
              color:      isActive ? "#fff" : colors.text,
              fontFamily: isActive ? typography.fontFamily.bold : typography.fontFamily.medium,
              fontSize:   typography.size.xs,
            }]}>
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
    paddingHorizontal: 16,
    gap:               8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical:   8,
    borderRadius:      20,
    borderWidth:       1,
  },
  label: {},
});
