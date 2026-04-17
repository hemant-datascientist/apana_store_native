// ============================================================
// FASHION SUB-CATEGORY GRID — Apana Store
//
// 4-column wrapped grid of clothing sub-categories.
// Each cell: image placeholder (icon on colored bg) + label.
// Active cell: fashion-accent border + colored icon.
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../theme/typography";
import { FashionSubCat } from "../../../data/fashionData";

interface FashionSubCategoryGridProps {
  subCats: FashionSubCat[];
  accent:  string;   // fashion primary color
}

const { width: SW } = Dimensions.get("window");
const H_PAD         = 16;
const COL_GAP       = 8;
const COLS          = 4;
const CELL_W        = Math.floor((SW - H_PAD * 2 - COL_GAP * (COLS - 1)) / COLS);
const IMG_H         = Math.floor(CELL_W * 0.88);

export default function FashionSubCategoryGrid({ subCats, accent }: FashionSubCategoryGridProps) {
  const [active, setActive] = useState<string | null>(null);

  function handlePress(cat: FashionSubCat) {
    setActive(cat.key);
    Alert.alert(cat.label, `${cat.label} collection coming soon.`);
  }

  return (
    <View style={styles.root}>
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
              {/* Image placeholder */}
              <View style={[
                styles.imgWrap,
                { backgroundColor: cat.bg, height: IMG_H },
                isActive && { borderColor: accent, borderWidth: 2 },
              ]}>
                <Ionicons
                  name={cat.icon as any}
                  size={30}
                  color={isActive ? accent : "rgba(0,0,0,0.30)"}
                />
              </View>

              {/* Label */}
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
    marginTop:         12,
    marginBottom:      8,
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
