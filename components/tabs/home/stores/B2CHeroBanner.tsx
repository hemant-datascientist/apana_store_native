// ============================================================
// B2C HERO BANNER — Apana Store (Home, Stores B2C tab)
//
// Category-theme promotional banner for direct-to-consumer brands.
// Each card:
//   Left  — big bold headline + subline + "Manufacturer Direct" tag
//   Right — floating product category icon cluster
// Auto-scrolls every 3.5 s.
// ============================================================

import React, { useRef, useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../../theme/typography";
import { B2CPromo } from "../../../../data/b2cStoresData";

interface B2CHeroBannerProps {
  promos:  B2CPromo[];
  onPress: (promo: B2CPromo) => void;
}

const { width: SW } = Dimensions.get("window");
const CARD_W = SW - 32;
const CARD_H = 130;
const GAP    = 12;

export default function B2CHeroBanner({ promos, onPress }: B2CHeroBannerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % promos.length;
        scrollRef.current?.scrollTo({ x: next * (CARD_W + GAP), animated: true });
        return next;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [promos.length]);

  function handleScroll(e: any) {
    setActive(Math.round(e.nativeEvent.contentOffset.x / (CARD_W + GAP)));
  }

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        snapToInterval={CARD_W + GAP}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        onMomentumScrollEnd={handleScroll}
      >
        {promos.map(promo => (
          <TouchableOpacity
            key={promo.id}
            style={[styles.card, { backgroundColor: promo.bgColor }]}
            onPress={() => onPress(promo)}
            activeOpacity={0.9}
          >
            {/* Dark accent overlay on right */}
            <View style={[styles.accentPanel, { backgroundColor: promo.accentColor }]} />

            {/* Decorative large circle */}
            <View style={styles.bigCircle} />

            {/* ── Left: text content ── */}
            <View style={styles.left}>
              {/* Tag pill */}
              <View style={styles.tagPill}>
                <Ionicons name="flash-outline" size={10} color={promo.bgColor} />
                <Text style={[styles.tagText, { color: promo.bgColor, fontFamily: typography.fontFamily.bold, fontSize: 9 }]}>
                  {promo.tag}
                </Text>
              </View>

              <Text style={[styles.headline, { color: promo.textColor, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
                {promo.headline}
              </Text>
              <Text style={[styles.subline, { color: "rgba(255,255,255,0.80)", fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {promo.subline}
              </Text>

              <TouchableOpacity style={styles.shopBtn} onPress={() => onPress(promo)}>
                <Text style={[styles.shopBtnText, { color: promo.textColor, fontFamily: typography.fontFamily.bold, fontSize: 10 }]}>
                  EXPLORE BRANDS →
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── Right: icon cluster ── */}
            <View style={styles.right}>
              {promo.icons.map((icon, i) => (
                <View
                  key={i}
                  style={[
                    styles.iconBubble,
                    {
                      backgroundColor: "rgba(255,255,255,0.15)",
                      top:  i === 0 ? 14 : i === 1 ? 42 : 72,
                      right: i === 1 ? 28 : 8,
                      width:  i === 1 ? 40 : 34,
                      height: i === 1 ? 40 : 34,
                      borderRadius: i === 1 ? 20 : 17,
                    },
                  ]}
                >
                  <Ionicons name={icon as any} size={i === 1 ? 20 : 16} color="rgba(255,255,255,0.90)" />
                </View>
              ))}
            </View>

          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dots}>
        {promos.map((_, i) => (
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
  root:   { marginTop: 12, marginBottom: 4 },
  scroll: { paddingHorizontal: 16, gap: GAP },

  card: {
    width:         CARD_W,
    height:        CARD_H,
    borderRadius:  14,
    overflow:      "hidden",
    flexDirection: "row",
    position:      "relative",
  },

  accentPanel: {
    position: "absolute",
    right:    0,
    top:      0,
    bottom:   0,
    width:    CARD_W * 0.35,
    opacity:  0.6,
  },

  bigCircle: {
    position:        "absolute",
    width:           180,
    height:          180,
    borderRadius:    90,
    backgroundColor: "rgba(255,255,255,0.05)",
    right:           -50,
    top:             -40,
  },

  // Left
  left: {
    flex:              1,
    paddingHorizontal: 16,
    paddingVertical:   14,
    justifyContent:    "space-between",
    zIndex:            1,
  },
  tagPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:                4,
    backgroundColor:   "rgba(255,255,255,0.90)",
    alignSelf:         "flex-start",
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
    marginBottom:      4,
  },
  tagText:    {},
  headline:   { lineHeight: 22 },
  subline:    { marginTop: 2 },
  shopBtn: {
    marginTop:         6,
    alignSelf:         "flex-start",
    backgroundColor:   "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical:   5,
    borderRadius:      20,
  },
  shopBtnText: {},

  // Right icon cluster
  right: {
    width:    90,
    position: "relative",
    zIndex:   1,
  },
  iconBubble: {
    position:       "absolute",
    alignItems:     "center",
    justifyContent: "center",
  },

  // Dots
  dots:        { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 10 },
  dot:         { height: 4, borderRadius: 2 },
  dotActive:   { width: 18, backgroundColor: "#7C3AED" },
  dotInactive: { width: 6,  backgroundColor: "#CBD5E1" },
});
