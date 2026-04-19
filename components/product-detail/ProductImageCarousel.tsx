// ============================================================
// PRODUCT IMAGE CAROUSEL — Apana Store
//
// Horizontal paging FlatList of product images.
// Each "image" is a coloured placeholder View with an icon
// (replace with <Image source={{ uri }}> when backend is ready).
// Dot indicators below track the active page.
// ============================================================

import React, { useRef, useState } from "react";
import {
  View, FlatList, Dimensions, StyleSheet, NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProductImage } from "../../data/productDetailData";

const { width: SW } = Dimensions.get("window");
const IMAGE_H       = SW * 0.85;

interface ProductImageCarouselProps {
  images: ProductImage[];
}

export default function ProductImageCarousel({ images }: ProductImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);

  // ── Track active page from scroll position ────────────────
  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SW);
    setActiveIndex(idx);
  }

  return (
    <View>
      <FlatList
        ref={flatRef}
        data={images}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[styles.slide, { backgroundColor: item.color, width: SW, height: IMAGE_H }]}>
            <Ionicons name={item.icon as any} size={80} color="#00000022" />
          </View>
        )}
      />

      {/* ── Dot indicators ── */}
      <View style={styles.dots}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* ── Page counter badge ── */}
      <View style={styles.counter}>
        <Ionicons name="images-outline" size={12} color="#fff" />
        {/* small gap */}
        <View style={{ width: 4 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    alignItems:     "center",
    justifyContent: "center",
  },
  dots: {
    flexDirection:  "row",
    justifyContent: "center",
    gap:            6,
    paddingVertical: 10,
  },
  dot: {
    height:       6,
    borderRadius: 3,
  },
  dotActive: {
    width:           20,
    backgroundColor: "#0F4C81",
  },
  dotInactive: {
    width:           6,
    backgroundColor: "#CBD5E1",
  },
  counter: {
    position:          "absolute",
    top:               12,
    right:             12,
    backgroundColor:   "rgba(0,0,0,0.35)",
    borderRadius:      20,
    paddingHorizontal: 10,
    paddingVertical:   4,
    flexDirection:     "row",
    alignItems:        "center",
  },
});
