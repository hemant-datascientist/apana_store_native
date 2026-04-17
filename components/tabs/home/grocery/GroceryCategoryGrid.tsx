// ============================================================
// GROCERY CATEGORY GRID — Apana Store
//
// 4-column wrapped grid of grocery sub-categories.
// Each cell: image placeholder (icon on colored bg) + label.
// Tapping a sub-category will filter products (backend ready).
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../../theme/typography";
import { GrocerySubCategory } from "../../../data/groceryData";

interface GroceryCategoryGridProps {
  categories: GrocerySubCategory[];
  onSelect:   (cat: GrocerySubCategory) => void;
}

const { width: SW }  = Dimensions.get("window");
const H_PAD          = 16;
const COL_GAP        = 8;
const COLS           = 4;
const CELL_W         = (SW - H_PAD * 2 - COL_GAP * (COLS - 1)) / COLS;
const IMG_H          = CELL_W * 0.85;   // slightly shorter than square

const GROCERY_GREEN  = "#026451";

export default function GroceryCategoryGrid({ categories, onSelect }: GroceryCategoryGridProps) {
  const [active, setActive] = useState<string | null>(null);

  function handlePress(cat: GrocerySubCategory) {
    setActive(cat.key);
    onSelect(cat);
  }

  return (
    <View style={styles.root}>
      <View style={styles.grid}>
        {categories.map(cat => {
          const isActive = active === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.cell,
                { width: CELL_W },
                isActive && styles.cellActive,
              ]}
              onPress={() => handlePress(cat)}
              activeOpacity={0.75}
            >
              {/* Image placeholder */}
              <View style={[
                styles.imgWrap,
                { backgroundColor: cat.bg, width: CELL_W, height: IMG_H },
                isActive && { borderColor: GROCERY_GREEN, borderWidth: 2 },
              ]}>
                <Ionicons
                  name={cat.icon as any}
                  size={32}
                  color={isActive ? GROCERY_GREEN : "rgba(0,0,0,0.35)"}
                />
              </View>

              {/* Label */}
              <Text
                numberOfLines={2}
                style={[
                  styles.label,
                  {
                    color:      isActive ? GROCERY_GREEN : "#374151",
                    fontFamily: isActive
                      ? typography.fontFamily.semiBold
                      : typography.fontFamily.regular,
                    fontSize: 10,
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
    marginBottom:      4,
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
  cellActive: {},

  imgWrap: {
    borderRadius: 10,
    alignItems:   "center",
    justifyContent: "center",
    overflow:     "hidden",
  },

  label: {
    textAlign:  "center",
    lineHeight: 13,
    width:      CELL_W,
  },
});
