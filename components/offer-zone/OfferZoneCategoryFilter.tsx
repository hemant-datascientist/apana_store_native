// ============================================================
// OFFER ZONE CATEGORY FILTER — Apana Store
//
// Horizontal scrollable pill chips to filter offers by category.
// Active chip gets a solid white background; inactive chips are
// semi-transparent.
// ============================================================

import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../theme/typography";
import { OfferCategory, OFFER_CATEGORIES } from "../../data/offerZoneData";

interface OfferZoneCategoryFilterProps {
  active:   OfferCategory;
  onSelect: (cat: OfferCategory) => void;
}

export default function OfferZoneCategoryFilter({ active, onSelect }: OfferZoneCategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {OFFER_CATEGORIES.map(cat => {
        const isActive = cat.key === active;
        return (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.chip,
              isActive
                ? styles.chipActive
                : styles.chipInactive,
            ]}
            onPress={() => onSelect(cat.key)}
            activeOpacity={0.75}
          >
            <Ionicons
              name={cat.icon as any}
              size={13}
              color={isActive ? "#F97316" : "rgba(255,255,255,0.75)"}
            />
            <Text style={[
              styles.chipText,
              {
                color:      isActive ? "#F97316" : "rgba(255,255,255,0.85)",
                fontFamily: isActive ? typography.fontFamily.bold : typography.fontFamily.medium,
                fontSize:   typography.size.xs,
              },
            ]}>
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
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    paddingHorizontal: 14,
    paddingVertical:   8,
    borderRadius:      20,
  },
  chipActive: {
    backgroundColor: "#fff",
  },
  chipInactive: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  chipText: {},
});
