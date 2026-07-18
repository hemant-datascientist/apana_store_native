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
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { typography } from "../../../../theme/typography";
import useTheme       from "../../../../theme/useTheme";

export interface SubCat {
  key:   string;
  label: string;
  icon:  string;   // Ionicons glyph
  bg:    string;   // placeholder background color
  apc?:  string;   // APC class this tile opens (overrides the grid's `apc`)
  imageUrl?: any;
}

interface CategorySubGridProps {
  title?:  string;       // section header (optional)
  subCats: SubCat[];
  accent:  string;
  apc?:    string;       // default APC class for every tile (§27 routing)
}

const { width: SW } = Dimensions.get("window");
const H_PAD         = 16;
const COL_GAP       = 8;
const COLS          = 4;
const CELL_W        = Math.floor((SW - H_PAD * 2 - COL_GAP * (COLS - 1)) / COLS);
const IMG_H         = Math.floor(CELL_W * 0.88);

export default function CategorySubGrid({ title, subCats, accent, apc }: CategorySubGridProps) {
  // Theme so title + label invert in dark mode
  const { colors } = useTheme();
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);

  function handlePress(cat: SubCat) {
    setActive(cat.key);
    // Per-tile APC class wins; else the grid's default. Opens the §27 browser.
    const code = cat.apc ?? apc;
    if (code) {
      router.push(`/(apc)/${code}` as never);
      return;
    }
    Alert.alert(cat.label, `${cat.label} coming soon.`);
  }

  return (
    <View style={styles.root}>

      {/* Optional section title */}
      {title && (
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
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
                  style={{ position: "absolute", zIndex: 0 }}
                />

                {cat.imageUrl && (
                  <Image
                    source={typeof cat.imageUrl === "string" ? { uri: cat.imageUrl } : cat.imageUrl}
                    style={{ width: "100%", height: "100%", borderRadius: 10, zIndex: 1 }}
                    resizeMode="cover"
                  />
                )}
              </View>

              <Text
                numberOfLines={2}
                style={[
                  styles.label,
                  {
                    color:      isActive ? accent : colors.text,
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
