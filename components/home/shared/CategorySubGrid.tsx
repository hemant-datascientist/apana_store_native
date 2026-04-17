// ============================================================
// CATEGORY SUB-GRID — Apana Store (Shared)
//
// Generic reusable 4-column sub-category grid used by every
// category feed (Mobiles, Electronics, Appliances, Beauty …).
//
// Props:
//   title?    — optional section header above the grid
//   subCats   — array of { key, label, icon, bg }
//   accent    — category primary color (border + icon tint on active)
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../theme/typography";

export interface SubCat {
  key:   string;
  label: string;
  icon:  string;   // Ionicons glyph
  bg:    string;   // placeholder background color
}

interface CategorySubGridProps {
  title?:  string;       // section header (optional)
  subCats: SubCat[];
  accent:  string;
}

const { width: SW } = Dimensions.get("window");
const H_PAD         = 16;
const COL_GAP       = 8;
const COLS          = 4;
const CELL_W        = Math.floor((SW - H_PAD * 2 - COL_GAP * (COLS - 1)) / COLS);
const IMG_H         = Math.floor(CELL_W * 0.88);

export default function CategorySubGrid({ title, subCats, accent }: CategorySubGridProps) {
  const [active, setActive] = useState<string | null>(null);

  function handlePress(cat: SubCat) {
    setActive(cat.key);
    Alert.alert(cat.label, `${cat.label} coming soon.`);
  }

  return (
    <View style={styles.root}>

      {/* Optional section title */}
      {title && (
        <Text style={[styles.title, { fontFamily: typography.fontFamily.bold }]}>
          {title}
        </Text>
      )}

      {/* 4-column grid */}
      <View style={styles.grid}>
        {subCats.map(cat => {
          const isActive = active === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.cell, { width: CELL_W }]}
              onPress={() => handlePress(cat)}
              activeOpacity={0.75}
            >
              <View style={[
                styles.imgWrap,
                { backgroundColor: cat.bg, height: IMG_H },
                isActive && { borderColor: accent, borderWidth: 2 },
              ]}>
                <Ionicons
                  name={cat.icon as any}
                  size={30}
                  color={isActive ? accent : "rgba(0,0,0,0.28)"}
                />
              </View>

              <Text
                numberOfLines={2}
                style={[
                  styles.label,
                  {
                    color:      isActive ? accent : "#374151",
                    fontFamily: isActive
                      ? typography.fontFamily.semiBold
                      : typography.fontFamily.regular,
                  },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: H_PAD,
    marginTop:         16,
    marginBottom:      8,
  },

  title: {
    fontSize:     15,
    color:        "#111827",
    marginBottom: 12,
    textAlign:    "center",
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
  },

  label: {
    fontSize:   10,
    textAlign:  "center",
    lineHeight: 13,
    width:      CELL_W,
  },
});
