// ============================================================
// PRODUCT GRID SECTION — Apana Store
//
// Section header + explicit 3-column product grid.
// Uses row-chunking (not flexWrap) to guarantee 3 per row.
// Each card: colored icon bg + badge + name + unit + price.
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../theme/typography";
import SectionHeader  from "./SectionHeader";
import { HomeProduct } from "../../../data/allFeedData";

interface ProductGridSectionProps {
  icon:        string;
  title:       string;
  accentColor: string;
  products:    HomeProduct[];
}

const { width: SW } = Dimensions.get("window");
const H_PAD         = 16;
const COL_GAP       = 8;
const COLS          = 3;
const CARD_W        = Math.floor((SW - H_PAD * 2 - COL_GAP * (COLS - 1)) / COLS);
const IMG_H         = CARD_W;   // square image area

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function ProductGridSection({
  icon, title, accentColor, products,
}: ProductGridSectionProps) {
  const rows = chunk(products, COLS);

  return (
    <View style={styles.root}>
      <SectionHeader icon={icon} title={title} accentColor={accentColor} />

      <View style={styles.grid}>
        {rows.map((row, rIdx) => (
          <View key={rIdx} style={styles.row}>
            {row.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[styles.card, { width: CARD_W }]}
                activeOpacity={0.8}
                onPress={() => Alert.alert(p.name, `${p.unit} · ${fmt(p.price)}`)}
              >
                {/* Image placeholder */}
                <View style={[styles.imgArea, { backgroundColor: p.bg }]}>
                  <Ionicons name={p.icon as any} size={40} color="rgba(0,0,0,0.20)" />
                  {p.badge && (
                    <View style={[styles.badge, { backgroundColor: accentColor }]}>
                      <Text style={[styles.badgeText, { fontFamily: typography.fontFamily.bold }]}>
                        {p.badge}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Info */}
                <View style={styles.info}>
                  <Text numberOfLines={2} style={[styles.name, { fontFamily: typography.fontFamily.semiBold }]}>
                    {p.name}
                  </Text>
                  <Text numberOfLines={1} style={[styles.unit, { fontFamily: typography.fontFamily.regular }]}>
                    {p.unit}
                  </Text>
                  <Text style={[styles.price, { color: accentColor, fontFamily: typography.fontFamily.bold }]}>
                    {fmt(p.price)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Ghost cards for incomplete last row */}
            {row.length < COLS && Array(COLS - row.length).fill(null).map((_, i) => (
              <View key={`g-${i}`} style={[styles.card, styles.ghost, { width: CARD_W }]} />
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

  card: {
    borderRadius:     10,
    overflow:         "hidden",
    backgroundColor:  "#fff",
    borderWidth:      1,
    borderColor:      "#F3F4F6",
    shadowColor:      "#000",
    shadowOffset:     { width: 0, height: 1 },
    shadowOpacity:    0.06,
    shadowRadius:     4,
    elevation:        2,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor:     "transparent",
    elevation:       0,
  },

  imgArea: {
    width:          "100%",
    height:         IMG_H,
    alignItems:     "center",
    justifyContent: "center",
  },

  badge: {
    position:          "absolute",
    top:               6,
    left:              6,
    paddingHorizontal: 5,
    paddingVertical:   2,
    borderRadius:      4,
  },
  badgeText: {
    color:    "#fff",
    fontSize: 8,
  },

  info: {
    padding: 7,
    gap:     2,
  },
  name: {
    fontSize:   11.5,
    color:      "#111827",
    lineHeight: 15,
  },
  unit: {
    fontSize: 10,
    color:    "#9CA3AF",
  },
  price: {
    fontSize:   12,
    marginTop:  2,
  },
});
