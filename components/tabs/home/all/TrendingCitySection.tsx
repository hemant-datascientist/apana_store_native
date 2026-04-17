// ============================================================
// TRENDING CITY SECTION — Apana Store
//
// 4-column discovery grid of things the city is KNOWN for:
// local food, iconic brands, traditional crafts, famous dishes.
// No price / no add button — tap to discover.
//
// IMPORTANT: Data is 100% city-specific.
// What trends in Pune ≠ Mumbai ≠ Delhi ≠ Bangalore.
//
// Data source (mock → backend):
//   getTrendingForCity(city)  →  GET /api/customer/home/trending?city={slug}
//
// To add a new city: add its slug key to CITY_TRENDING in allFeedData.ts.
// This component does NOT change when you switch to the API.
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography }        from "../../../../theme/typography";
import SectionHeader         from "./SectionHeader";
import { TrendingCityItem }  from "../../../../data/allFeedData";

interface TrendingCitySectionProps {
  city:  string;
  items: TrendingCityItem[];
}

const { width: SW } = Dimensions.get("window");
const H_PAD         = 16;
const COL_GAP       = 8;
const COLS          = 4;
const CELL_W        = Math.floor((SW - H_PAD * 2 - COL_GAP * (COLS - 1)) / COLS);
const IMG_H         = CELL_W;   // square

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function TrendingCitySection({ city, items }: TrendingCitySectionProps) {
  const rows = chunk(items, COLS);

  return (
    <View style={styles.root}>
      <SectionHeader
        icon="flame-outline"
        title={`Trending in ${city}`}
        accentColor="#F97316"
      />

      <View style={styles.grid}>
        {rows.map((row, rIdx) => (
          <View key={rIdx} style={styles.row}>
            {row.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.cell, { width: CELL_W }]}
                activeOpacity={0.78}
                onPress={() => Alert.alert(item.name, `${item.tag} · Coming soon.`)}
              >
                {/* Image placeholder */}
                <View style={[styles.imgWrap, { backgroundColor: item.bg, height: IMG_H }]}>
                  <Ionicons name={item.icon as any} size={30} color="rgba(0,0,0,0.22)" />
                </View>

                {/* Name */}
                <Text
                  numberOfLines={2}
                  style={[styles.name, { fontFamily: typography.fontFamily.semiBold }]}
                >
                  {item.name}
                </Text>

                {/* Tag */}
                <Text
                  numberOfLines={1}
                  style={[styles.tag, { fontFamily: typography.fontFamily.regular }]}
                >
                  {item.tag}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Ghost cells for incomplete last row */}
            {row.length < COLS && Array(COLS - row.length).fill(null).map((_, i) => (
              <View key={`g-${i}`} style={{ width: CELL_W }} />
            ))}
          </View>
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

  grid: { gap: COL_GAP },

  row: {
    flexDirection: "row",
    gap:           COL_GAP,
  },

  cell: {
    alignItems: "center",
    gap:        4,
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

  name: {
    fontSize:   11,
    color:      "#111827",
    textAlign:  "center",
    lineHeight: 14,
    width:      CELL_W,
  },
  tag: {
    fontSize:  9.5,
    color:     "#9CA3AF",
    textAlign: "center",
    width:     CELL_W,
  },
});
