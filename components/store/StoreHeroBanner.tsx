// ============================================================
// STORE HERO BANNER — Apana Store (Store Detail Component)
//
// Full-width colored hero with store icon, LIVE badge,
// rating chip, and store category label.
// Replaces a real photo until backend serves image URLs.
// ============================================================

import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import { typography } from "../../theme/typography";
import { StoreDetail } from "../../data/storeDetailData";

const { width: SW } = Dimensions.get("window");
const HERO_H        = 220;

interface StoreHeroBannerProps {
  store: StoreDetail;
}

export default function StoreHeroBanner({ store }: StoreHeroBannerProps) {
  return (
    <View style={[styles.hero, { backgroundColor: store.heroBg }]}>

      {/* ── LIVE badge ── */}
      {store.isLive && (
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={[styles.liveLabel, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
            LIVE
          </Text>
        </View>
      )}

      {/* ── Rating chip ── */}
      <View style={styles.ratingChip}>
        <Ionicons name="star" size={12} color="#F59E0B" />
        <Text style={[styles.ratingLabel, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
          {store.rating.toFixed(1)}
        </Text>
        <Text style={[styles.reviewLabel, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          ({store.reviewCount})
        </Text>
      </View>

      {/* ── Center icon ── */}
      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <Ionicons name={store.icon as any} size={52} color={store.heroBg} />
        </View>
        <Text style={[styles.category, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
          {store.category.toUpperCase()}
        </Text>
      </View>

      {/* ── Bottom scrim for seamless blend into white ── */}
      <View style={styles.scrim} />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    width:          SW,
    height:         HERO_H,
    justifyContent: "center",
    alignItems:     "center",
    overflow:       "hidden",
  },

  liveBadge: {
    position:          "absolute",
    top:               14,
    left:              14,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    backgroundColor:   "rgba(0,0,0,0.40)",
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
  },
  liveDot: {
    width:           7,
    height:          7,
    borderRadius:    4,
    backgroundColor: "#4ADE80",
  },
  liveLabel: { color: "#fff", letterSpacing: 0.5 },

  ratingChip: {
    position:          "absolute",
    top:               14,
    right:             14,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               3,
    backgroundColor:   "rgba(0,0,0,0.40)",
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
  },
  ratingLabel: { color: "#fff" },
  reviewLabel: { color: "rgba(255,255,255,0.75)" },

  center: {
    alignItems: "center",
    gap:        10,
  },
  iconCircle: {
    width:           90,
    height:          90,
    borderRadius:    45,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems:      "center",
    justifyContent:  "center",
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.18,
    shadowRadius:    8,
    elevation:       6,
  },
  category: {
    color:         "rgba(255,255,255,0.85)",
    letterSpacing: 1.5,
  },

  // Bottom fade so hero blends into the card below
  scrim: {
    position:        "absolute",
    bottom:          0,
    left:            0,
    right:           0,
    height:          32,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
});
