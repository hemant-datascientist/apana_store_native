// ============================================================
// FLASH DEALS SECTION — Apana Store
//
// Horizontal scroll of deal cards with:
//   - Red % off badge (top-right of image)
//   - Original price (strikethrough, grey)
//   - Sale price (red/accent, bold)
// ============================================================

import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../theme/typography";
import SectionHeader from "./SectionHeader";
import { FlashDeal } from "../../../data/allFeedData";

interface FlashDealsSectionProps {
  deals: FlashDeal[];
}

const DEAL_ACCENT = "#DC2626";   // red
const CARD_W      = 115;
const IMG_H       = 100;

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function FlashDealsSection({ deals }: FlashDealsSectionProps) {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <SectionHeader
          icon="flash-outline"
          title="Flash Deals"
          accentColor={DEAL_ACCENT}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {deals.map(d => (
          <TouchableOpacity
            key={d.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => Alert.alert(d.name, `${fmt(d.price)} (was ${fmt(d.originalPrice)})`)}
          >
            {/* Image placeholder */}
            <View style={[styles.imgArea, { backgroundColor: d.bg }]}>
              <Ionicons name={d.icon as any} size={36} color="rgba(0,0,0,0.20)" />

              {/* % OFF badge — top right */}
              <View style={styles.pctBadge}>
                <Text style={[styles.pctText, { fontFamily: typography.fontFamily.bold }]}>
                  {d.discountPct}%{"\n"}OFF
                </Text>
              </View>
            </View>

            {/* Info */}
            <View style={styles.info}>
              <Text numberOfLines={2} style={[styles.name, { fontFamily: typography.fontFamily.semiBold }]}>
                {d.name}
              </Text>
              <Text numberOfLines={1} style={[styles.unit, { fontFamily: typography.fontFamily.regular }]}>
                {d.unit}
              </Text>

              {/* Original price (strikethrough) */}
              <Text style={[styles.original, { fontFamily: typography.fontFamily.regular }]}>
                {fmt(d.originalPrice)}
              </Text>

              {/* Sale price */}
              <Text style={[styles.salePrice, { fontFamily: typography.fontFamily.bold }]}>
                {fmt(d.price)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: 20,
  },

  header: {
    paddingHorizontal: 16,
  },

  scroll: {
    paddingHorizontal: 16,
    gap:               8,
  },

  card: {
    width:           CARD_W,
    borderRadius:    10,
    overflow:        "hidden",
    backgroundColor: "#fff",
    borderWidth:     1,
    borderColor:     "#FEE2E2",
    shadowColor:     "#DC2626",
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.08,
    shadowRadius:    4,
    elevation:       2,
  },

  imgArea: {
    width:          "100%",
    height:         IMG_H,
    alignItems:     "center",
    justifyContent: "center",
    position:       "relative",
  },

  pctBadge: {
    position:          "absolute",
    top:               6,
    right:             6,
    backgroundColor:   "#DC2626",
    paddingHorizontal: 5,
    paddingVertical:   3,
    borderRadius:      5,
    alignItems:        "center",
  },
  pctText: {
    color:       "#fff",
    fontSize:    8.5,
    lineHeight:  11,
    textAlign:   "center",
  },

  info: {
    padding: 6,
    gap:     1,
  },
  name: {
    fontSize:   11,
    color:      "#111827",
    lineHeight: 14,
  },
  unit: {
    fontSize:    9.5,
    color:       "#9CA3AF",
    marginBottom: 2,
  },
  original: {
    fontSize:            10,
    color:               "#9CA3AF",
    textDecorationLine:  "line-through",
  },
  salePrice: {
    fontSize: 12,
    color:    "#DC2626",
    marginTop: 1,
  },
});
