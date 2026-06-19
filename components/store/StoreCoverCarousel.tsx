// ============================================================
// STORE COVER CAROUSEL — Apana Store (Store Detail Component)
//
// The store-detail cover background: a horizontal, paged carousel of
// ALL the store's photos (cover · front · exterior · interior ·
// surrounding) so a customer can swipe through the storefront —
// useful for finding it nearby, showing someone, or judging stock.
//
// Renders as an absolute-fill layer behind the hero badges/avatar.
// One photo → static (no dots). No photos → solid heroBg + store icon.
// ============================================================

import React, { useState } from "react";
import {
  View, Text, Image, ScrollView, StyleSheet, Dimensions,
  NativeSyntheticEvent, NativeScrollEvent,
} from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import { typography } from "../../theme/typography";
import { StorePhoto } from "../../data/storeGallery";

const { width: SW } = Dimensions.get("window");

interface StoreCoverCarouselProps {
  photos:   StorePhoto[];
  heroBg:   string;   // fallback background + medallion icon tint
  icon:     string;   // fallback Ionicons glyph
  category: string;   // fallback category label
  height:   number;   // hero height
}

export default function StoreCoverCarousel({
  photos, heroBg, icon, category, height,
}: StoreCoverCarouselProps) {
  const [active, setActive] = useState(0);

  // No photos → solid colour + centred store medallion (honest fallback).
  if (photos.length === 0) {
    return (
      <View style={[StyleSheet.absoluteFill, styles.fallback, { backgroundColor: heroBg }]}>
        <View style={styles.medallion}>
          <Ionicons name={icon as never} size={52} color={heroBg} />
        </View>
        <Text style={[styles.category, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
          {category.toUpperCase()}
        </Text>
      </View>
    );
  }

  const multi = photos.length > 1;

  function onScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setActive(Math.round(e.nativeEvent.contentOffset.x / SW));
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <ScrollView
        horizontal
        pagingEnabled
        scrollEnabled={multi}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
      >
        {photos.map((p, i) => (
          <Image key={i} source={p.src} style={{ width: SW, height }} resizeMode="cover" />
        ))}
      </ScrollView>

      {multi && (
        <>
          {/* Active slide label */}
          <View style={styles.labelPill}>
            <Ionicons name="image-outline" size={11} color="#fff" />
            <Text style={[styles.labelTxt, { fontFamily: typography.fontFamily.semiBold, fontSize: 11 }]}>
              {photos[active].label}
            </Text>
            <Text style={[styles.countTxt, { fontFamily: typography.fontFamily.regular, fontSize: 11 }]}>
              {active + 1}/{photos.length}
            </Text>
          </View>

          {/* Dot indicators */}
          <View style={styles.dots}>
            {photos.map((_, i) => (
              <View key={i} style={[styles.dot, i === active ? styles.dotOn : styles.dotOff]} />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems:     "center",
    justifyContent: "center",
    gap:            10,
  },
  medallion: {
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

  labelPill: {
    position:          "absolute",
    bottom:            14,
    left:              14,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    backgroundColor:   "rgba(0,0,0,0.50)",
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
  },
  labelTxt: { color: "#fff" },
  countTxt: { color: "rgba(255,255,255,0.7)" },

  dots: {
    position:       "absolute",
    bottom:         16,
    left:           0,
    right:          0,
    flexDirection:  "row",
    justifyContent: "center",
    gap:            6,
  },
  dot:    { height: 5, borderRadius: 3 },
  dotOn:  { width: 16, backgroundColor: "#fff" },
  dotOff: { width: 5,  backgroundColor: "rgba(255,255,255,0.5)" },
});
