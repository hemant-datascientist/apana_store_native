// ============================================================
// NEARBY HERO BANNER — Apana Store (Home Screen, Stores Mode)
//
// Layout per card:
//   [View Store →]  ← absolute, top-right
//   ┌─────────────────────────────┐
//   │  Store Name        ⭐ 4.8  │  ← name (flex:1) + rating (fixed right)
//   │  Cat1 • Cat2 • Cat3        │
//   ├──────────────┬──────────────┤
//   │   City       │ Near Home   │  ← two-tone bottom bar
//   └──────────────┴──────────────┘
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
const CARD_W     = SW - 32;   // 16px margin each side
const CARD_H     = 180;
const BOTTOM_H   = 34;
const GAP        = 12;

export default function NearbyHeroBanner({ stores, onPress }: NearbyHeroBannerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [active, setActive] = useState(0);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

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
            {/* Colour overlay */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: store.accentColor + "CC" }]} />

            {/* Faint centre icon watermark */}
            <View style={[StyleSheet.absoluteFill, styles.iconCenter]}>
              <Ionicons name={store.icon as any} size={56} color="rgba(255,255,255,0.07)" />
            </View>

            {/* ── "View Store →" pill — absolute TOP-RIGHT ── */}
            <TouchableOpacity
              onPress={() => onPress(store)}
              style={styles.viewStoreBtn}
              activeOpacity={0.75}
            >
              <Text style={[styles.viewStoreTxt, { fontFamily: typography.fontFamily.bold, fontSize: 11 }]}>
                View Store
              </Text>
              <Ionicons name="chevron-forward" size={11} color="#FFD700" />
            </TouchableOpacity>

            {/* ── Body content ── */}
            <View style={styles.body}>

              {/* Row: store name (flex:1 left) + ⭐ rating (right) */}
              <View style={styles.nameRow}>
                <Text
                  style={[styles.storeName, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {store.name}
                </Text>
                <View style={styles.ratingPill}>
                  <Ionicons name="star" size={11} color="#FFD700" />
                  <Text style={[styles.ratingTxt, { fontFamily: typography.fontFamily.semiBold, fontSize: 11 }]}>
                    {store.rating}
                  </Text>
                </View>
              </View>

              {/* Categories — dot-separated */}
              <View style={styles.catRow}>
                {store.categories.map((cat, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <Text style={styles.bullet}> • </Text>}
                    <Text style={[styles.catTxt, { fontFamily: typography.fontFamily.regular, fontSize: 11.5 }]}>
                      {cat}
                    </Text>
                  </React.Fragment>
                ))}
              </View>

            </View>

            {/* ── Two-tone bottom bar ── */}
            <View style={styles.bottomBar}>
              <View style={styles.bottomCity}>
                <Text style={[styles.bottomTxt, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
                  {store.city}
                </Text>
              </View>
              <View style={styles.bottomNear}>
                <Text style={[styles.bottomTxt, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
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
            style={[styles.dot, i === active ? styles.dotActive : styles.dotInactive]}
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

  // ── Card ──────────────────────────────────────────────────
  card: {
    width:        CARD_W,
    height:       CARD_H,
    borderRadius: 14,
    overflow:     "hidden",
    // flex column so body grows and bottomBar sits at bottom
    flexDirection: "column",
  },

  iconCenter: {
    alignItems:     "center",
    justifyContent: "center",
  },

  // ── View Store button — absolute top-right ─────────────────
  viewStoreBtn: {
    position:          "absolute",
    top:               10,
    right:             10,
    zIndex:            10,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    backgroundColor:   "rgba(0,0,0,0.50)",
    paddingHorizontal: 10,
    paddingVertical:   5,
    borderRadius:      12,
    borderWidth:       1,
    borderColor:       "rgba(255,215,0,0.45)",
  },
  viewStoreTxt: {
    color: "#FFD700",
  },

  // ── Body (fills space above bottom bar) ────────────────────
  body: {
    flex:              1,
    paddingTop:        14,
    paddingHorizontal: 16,
    // right pad to prevent text going under the View Store button
    paddingRight:      118,
    justifyContent:    "center",
    gap:               8,
  },

  // Store name (flex:1) + rating pill on same row
  nameRow: {
    flexDirection: "row",
    alignItems:    "center",
  },
  storeName: {
    flex:  1,            // takes all remaining space, truncates if needed
    color: "#fff",
  },
  ratingPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    backgroundColor:   "rgba(0,0,0,0.45)",
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
    marginLeft:        8,  // small gap from store name
    flexShrink:        0,  // never shrinks — always visible
  },
  ratingTxt: {
    color: "#FFD700",
  },

  // Category row
  catRow: {
    flexDirection: "row",
    alignItems:    "center",
    flexWrap:      "wrap",
  },
  catTxt: {
    color: "rgba(255,255,255,0.88)",
  },
  bullet: {
    color:    "rgba(255,255,255,0.45)",
    fontSize: 11,
  },

  // ── Two-tone bottom bar ────────────────────────────────────
  bottomBar: {
    flexDirection: "row",
    height:        BOTTOM_H,
  },
  bottomCity: {
    flex:            2,
    backgroundColor: "rgba(0,0,0,0.60)",
    alignItems:      "center",
    justifyContent:  "center",
  },
  bottomNear: {
    flex:            3,
    backgroundColor: "#16A34A",
    alignItems:      "center",
    justifyContent:  "center",
  },
  bottomTxt: {
    color: "#fff",
  },

  // ── Dots ──────────────────────────────────────────────────
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
