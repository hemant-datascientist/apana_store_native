// ============================================================
// NEARBY HERO BANNER — Apana Store (Home Screen, Stores Mode)
//
// Full-width auto-scrolling carousel of featured nearby stores.
// Each card:
//   • Dark-tinted store photo background (placeholder: gradient)
//   • Store name (large white bold)
//   • ⭐ rating chip  +  "View Store ↓" link
//   • Category list (white, small)
//   • Two-tone bottom bar: city (dark) | "Near your Home" (green)
// ============================================================

import React, { useRef, useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../../theme/typography";
import { HeroStore } from "../../../../data/nearbyStoresData";

interface NearbyHeroBannerProps {
  stores:  HeroStore[];
  onPress: (store: HeroStore) => void;
}

const { width: SW } = Dimensions.get("window");
const CARD_W  = SW - 32;    // full width minus 16 margin each side
const CARD_H  = 180;
const GAP     = 12;

export default function NearbyHeroBanner({ stores, onPress }: NearbyHeroBannerProps) {
  const scrollRef  = useRef<ScrollView>(null);
  const [active, setActive] = useState(0);
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll every 3.5 s
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % stores.length;
        scrollRef.current?.scrollTo({ x: next * (CARD_W + GAP), animated: true });
        return next;
      });
    }, 3500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stores.length]);

  function handleScroll(e: any) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (CARD_W + GAP));
    setActive(idx);
  }

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_W + GAP}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        onMomentumScrollEnd={handleScroll}
      >
        {stores.map(store => (
          <TouchableOpacity
            key={store.id}
            style={[styles.card, { backgroundColor: store.bgColor }]}
            onPress={() => onPress(store)}
            activeOpacity={0.9}
          >
            {/* Dark gradient overlay */}
            <View style={[styles.overlay, { backgroundColor: store.accentColor + "CC" }]} />

            {/* Placeholder centre icon */}
            <View style={styles.placeholderIcon}>
              <Ionicons name={store.icon as any} size={52} color="rgba(255,255,255,0.08)" />
            </View>

            {/* Content */}
            <View style={styles.content}>

              {/* Store name + rating row */}
              <View style={styles.nameRow}>
                <Text
                  style={[styles.storeName, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}
                  numberOfLines={1}
                >
                  {store.name}
                </Text>
                <View style={styles.ratingRow}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={11} color="#FFD700" />
                    <Text style={[styles.ratingText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                      {store.rating} Stars
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => onPress(store)}>
                    <Text style={[styles.viewStore, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                      View Store ↓
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Categories */}
              <View style={styles.catList}>
                {store.categories.map((cat, i) => (
                  <Text
                    key={i}
                    style={[styles.catItem, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}
                  >
                    {cat}
                  </Text>
                ))}
              </View>

            </View>

            {/* Two-tone bottom bar */}
            <View style={styles.bottomBar}>
              <View style={styles.bottomLeft}>
                <Text style={[styles.bottomText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
                  {store.city}
                </Text>
              </View>
              <View style={styles.bottomRight}>
                <Text style={[styles.bottomText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
                  {store.nearLabel}
                </Text>
              </View>
            </View>

          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dot indicators */}
      <View style={styles.dots}>
        {stores.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === active
                ? styles.dotActive
                : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop:    12,
    marginBottom:  4,
  },
  scroll: {
    paddingHorizontal: 16,
    gap:               GAP,
  },

  // Card
  card: {
    width:        CARD_W,
    height:       CARD_H,
    borderRadius: 14,
    overflow:     "hidden",
    position:     "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  placeholderIcon: {
    ...StyleSheet.absoluteFillObject,
    alignItems:     "center",
    justifyContent: "center",
  },

  // Content
  content: {
    flex:              1,
    paddingTop:        14,
    paddingHorizontal: 16,
    paddingBottom:      4,
  },
  nameRow: {
    marginBottom: 8,
  },
  storeName: {
    color:        "#fff",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           10,
  },
  ratingBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:                4,
    backgroundColor:   "rgba(0,0,0,0.35)",
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
  },
  ratingText: {
    color: "#fff",
  },
  viewStore: {
    color:           "#FFD700",
    textDecorationLine: "underline",
  },

  catList: {
    gap: 2,
  },
  catItem: {
    color:      "rgba(255,255,255,0.85)",
    lineHeight: 17,
  },

  // Bottom bar
  bottomBar: {
    flexDirection: "row",
    height:        34,
  },
  bottomLeft: {
    flex:            2,
    backgroundColor: "rgba(0,0,0,0.60)",
    alignItems:      "center",
    justifyContent:  "center",
  },
  bottomRight: {
    flex:            3,
    backgroundColor: "#16A34A",
    alignItems:      "center",
    justifyContent:  "center",
  },
  bottomText: {
    color: "#fff",
  },

  // Dots
  dots: {
    flexDirection:  "row",
    justifyContent: "center",
    gap:             6,
    marginTop:       10,
  },
  dot: {
    height:       4,
    borderRadius: 2,
  },
  dotActive: {
    width:           18,
    backgroundColor: "#0F4C81",
  },
  dotInactive: {
    width:           6,
    backgroundColor: "#CBD5E1",
  },
});
