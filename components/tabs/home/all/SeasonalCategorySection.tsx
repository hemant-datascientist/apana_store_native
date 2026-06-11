// ============================================================
// SEASONAL CATEGORY SECTION — Apana Store
//
// Section header + 4-col wrapped grid of seasonal sub-categories.
// Steps through every season (Summer / Monsoon / Winter / Festive)
// via prev/next arrows in the header — no "See All". The active
// season drives the title, accent colour, icon and the grid.
// Data: SEASONS in allFeedData; swap for GET /customer/home/seasons.
// ============================================================

import React, { useState, useCallback } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, Image,
} from "react-native";
import { Ionicons }        from "@expo/vector-icons";
import { typography }      from "../../../../theme/typography";
import SectionHeader       from "./SectionHeader";
import { Season }          from "../../../../data/allFeedData";
import useTheme            from "../../../../theme/useTheme";

interface SeasonalCategorySectionProps {
  seasons: Season[];
}

const { width: SW } = Dimensions.get("window");
const H_PAD         = 16;
const COL_GAP       = 8;
const COLS          = 4;
const CELL_W        = Math.floor((SW - H_PAD * 2 - COL_GAP * (COLS - 1)) / COLS);
const IMG_H         = Math.floor(CELL_W * 0.90);

export default function SeasonalCategorySection({ seasons }: SeasonalCategorySectionProps) {
  const { colors } = useTheme();
  const [idx, setIdx] = useState(0);

  const n = seasons.length;
  // Wrap around both ends so the carousel never dead-ends.
  const prev = useCallback(() => setIdx(i => (i - 1 + n) % n), [n]);
  const next = useCallback(() => setIdx(i => (i + 1) % n), [n]);

  if (n === 0) return null;
  const active = seasons[idx];

  const arrows = (
    <View style={styles.arrows}>
      <TouchableOpacity
        onPress={prev}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Previous season"
        style={[styles.arrowBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Ionicons name="chevron-back" size={18} color={active.accent} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={next}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Next season"
        style={[styles.arrowBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Ionicons name="chevron-forward" size={18} color={active.accent} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.root}>
      <SectionHeader
        icon={active.icon}
        title={`${active.name} Picks`}
        accentColor={active.accent}
        rightSlot={arrows}
      />

      <View style={styles.grid}>
        {active.categories.map(cat => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.cell, { width: CELL_W }]}
            activeOpacity={0.75}
            onPress={() => Alert.alert(cat.label, `${cat.label} collection coming soon.`)}
          >
            <View style={[styles.imgWrap, { backgroundColor: cat.bg, height: IMG_H }]}>
              {cat.imageUrl ? (
                <Image
                  source={cat.imageUrl}
                  style={styles.img}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name={cat.icon as any} size={28} color="rgba(0,0,0,0.25)" />
              )}
            </View>

            <Text
              numberOfLines={2}
              style={[styles.label, { fontFamily: typography.fontFamily.semiBold, color: colors.text }]}
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

  arrows: {
    flexDirection: "row",
    gap:           8,
  },

  arrowBtn: {
    width:          30,
    height:         30,
    borderRadius:   15,
    borderWidth:    1,
    alignItems:     "center",
    justifyContent: "center",
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

  img: {
    width:          "100%",
    height:         "100%",
  },

  label: {
    fontSize:   10,
    textAlign:  "center",
    lineHeight: 13,
    width:      CELL_W,
  },
});
