// ============================================================
// WHOLESALE HERO BANNER — Apana Store (Home, Stores Wholesale)
//
// Flyer/ad-style promotional banner carousel (not a store photo).
// Each card has two panels:
//   Left  — brand name, tagline, partner badges
//   Right — promotional title + subtitle (accent panel)
// ============================================================

import React, { useRef, useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../theme/typography";
import { WholesalePromo } from "../../../data/wholesaleStoresData";

interface WholesaleHeroBannerProps {
  promos:  WholesalePromo[];
  onPress: (promo: WholesalePromo) => void;
}

const { width: SW } = Dimensions.get("window");
const CARD_W = SW - 32;
const CARD_H = 140;
const GAP    = 12;

export default function WholesaleHeroBanner({ promos, onPress }: WholesaleHeroBannerProps) {
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
        {promos.map(promo => (
          <TouchableOpacity
            key={promo.id}
            style={[styles.card, { backgroundColor: promo.bgLeft }]}
            onPress={() => onPress(promo)}
            activeOpacity={0.9}
          >
            {/* ── Left panel ── */}
            <View style={styles.left}>
              {/* Brand */}
              <Text style={[styles.brandName, { color: promo.textColor, fontFamily: typography.fontFamily.bold, fontSize: 28 }]}>
                {promo.brandName}
              </Text>
              <Text style={[styles.tagline, { color: promo.accentColor, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
                {promo.tagline}
              </Text>

              {/* Partner badges */}
              <View style={styles.badges}>
                {promo.badges.map((badge, i) => (
                  <View key={i} style={[styles.badge, { borderColor: "rgba(255,255,255,0.35)" }]}>
                    <Text style={[styles.badgeText, { color: promo.textColor, fontFamily: typography.fontFamily.bold, fontSize: 8 }]}>
                      {badge}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* ── Right promo panel ── */}
            <View style={[styles.right, { backgroundColor: promo.bgRight }]}>
              {/* Decorative circles */}
              <View style={[styles.circle1, { borderColor: "rgba(255,255,255,0.15)" }]} />
              <View style={[styles.circle2, { borderColor: "rgba(255,255,255,0.10)" }]} />

              <View style={styles.promoContent}>
                <Ionicons name="gift-outline" size={22} color="rgba(255,255,255,0.90)" style={{ marginBottom: 4 }} />
                <Text style={[styles.promoTitle, { color: "#fff", fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
                  {promo.promoTitle}
                </Text>
                <Text style={[styles.promoSub, { color: "rgba(255,255,255,0.90)", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                  {promo.promoSub}
                </Text>
                <View style={[styles.shopBtn, { backgroundColor: "rgba(255,255,255,0.20)", borderColor: "rgba(255,255,255,0.40)" }]}>
                  <Text style={[styles.shopBtnText, { color: "#fff", fontFamily: typography.fontFamily.bold, fontSize: 9 }]}>
                    SHOP NOW
                  </Text>
                </View>
              </View>
            </View>

          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dots}>
        {promos.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === active ? styles.dotActive : styles.dotInactive,
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

  card: {
    width:        CARD_W,
    height:       CARD_H,
    borderRadius: 14,
    flexDirection: "row",
    overflow:     "hidden",
  },

  // Left panel
  left: {
    flex:              1.1,
    paddingHorizontal: 16,
    paddingVertical:   14,
    justifyContent:    "space-between",
  },
  brandName: {
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: -6,
  },
  badges: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:            5,
    marginTop:      6,
  },
  badge: {
    borderWidth:       1,
    borderRadius:      4,
    paddingHorizontal: 5,
    paddingVertical:   2,
  },
  badgeText: {
    letterSpacing: 0.3,
  },

  // Right promo panel
  right: {
    flex:           1,
    position:       "relative",
    overflow:       "hidden",
    alignItems:     "center",
    justifyContent: "center",
  },
  circle1: {
    position:     "absolute",
    width:        120,
    height:       120,
    borderRadius: 60,
    borderWidth:   20,
    top:          -30,
    right:        -30,
  },
  circle2: {
    position:     "absolute",
    width:        80,
    height:       80,
    borderRadius: 40,
    borderWidth:   16,
    bottom:       -20,
    left:         -20,
  },
  promoContent: {
    alignItems: "center",
    zIndex:      1,
  },
  promoTitle: {
    letterSpacing: -0.5,
  },
  promoSub: {
    marginTop:  2,
    textAlign:  "center",
    lineHeight: 15,
  },
  shopBtn: {
    marginTop:         8,
    paddingHorizontal: 12,
    paddingVertical:    4,
    borderRadius:      20,
    borderWidth:        1,
  },
  shopBtnText: {
    letterSpacing: 0.8,
  },

  // Dots
  dots: {
    flexDirection:  "row",
    justifyContent: "center",
    gap:             6,
    marginTop:       10,
  },
  dot:         { height: 4, borderRadius: 2 },
  dotActive:   { width: 18, backgroundColor: "#003087" },
  dotInactive: { width:  6, backgroundColor: "#CBD5E1" },
});
