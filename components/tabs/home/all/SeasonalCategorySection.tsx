// ============================================================
// SEASONAL CATEGORY SECTION — Apana Store
//
// Section header + 4-col wrapped grid of seasonal sub-categories.
// Summer: Sunscreens, Skincare, Refreshing Cools, Air Coolers …
// Changes season by season — update SUMMER_CATEGORIES in data.
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert,
} from "react-native";
import { Ionicons }        from "@expo/vector-icons";
import { typography }      from "../../../../theme/typography";
import SectionHeader       from "./SectionHeader";
import { SeasonalCat }     from "../../../data/allFeedData";

interface SeasonalCategorySectionProps {
  season:     string;       // e.g. "Summer 2026"
  categories: SeasonalCat[];
  accent:     string;
}

const { width: SW } = Dimensions.get("window");
const H_PAD         = 16;
const COL_GAP       = 8;
const COLS          = 4;
const CELL_W        = Math.floor((SW - H_PAD * 2 - COL_GAP * (COLS - 1)) / COLS);
const IMG_H         = Math.floor(CELL_W * 0.90);

export default function SeasonalCategorySection({
  season, categories, accent,
}: SeasonalCategorySectionProps) {
  return (
    <View style={styles.root}>
      <SectionHeader
        icon="sunny-outline"
        title={`${season} Picks`}
        accentColor={accent}
      />

      <View style={styles.grid}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.cell, { width: CELL_W }]}
            activeOpacity={0.75}
            onPress={() => Alert.alert(cat.label, `${cat.label} collection coming soon.`)}
          >
            <View style={[styles.imgWrap, { backgroundColor: cat.bg, height: IMG_H }]}>
              <Ionicons name={cat.icon as any} size={28} color="rgba(0,0,0,0.25)" />
            </View>

            <Text
              numberOfLines={2}
              style={[styles.label, { fontFamily: typography.fontFamily.semiBold, color: "#374151" }]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: H_PAD,
    marginTop:         20,
  },

  grid: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           COL_GAP,
  },

  cell: {
    alignItems: "center",
    gap:        5,
  },

  imgWrap: {
    width:          "100%",
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
    overflow:       "hidden",
    borderWidth:    1,
    borderColor:    "#F3F4F6",
  },

  label: {
    fontSize:   10,
    textAlign:  "center",
    lineHeight: 13,
    width:      CELL_W,
  },
});
