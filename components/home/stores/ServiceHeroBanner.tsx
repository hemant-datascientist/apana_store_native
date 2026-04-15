// ============================================================
// SERVICE HERO BANNER — Apana Store (Home, Stores Service Based)
//
// Promotional banner for local service providers.
// Layout per card:
//   Left  — headline + subline + "Trusted & Verified" tag + CTA
//   Right — 2×2 service icon grid with labels
// Auto-scrolls every 3.5 s.
// ============================================================

import React, { useRef, useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../theme/typography";
import { ServicePromo } from "../../../data/serviceStoresData";

interface ServiceHeroBannerProps {
  promos:  ServicePromo[];
  onPress: (promo: ServicePromo) => void;
}

const { width: SW } = Dimensions.get("window");
const CARD_W = SW - 32;
const CARD_H = 148;
const GAP    = 12;

export default function ServiceHeroBanner({ promos, onPress }: ServiceHeroBannerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [active, setActive]   = useState(0);

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
            {/* Diagonal dark accent strip */}
            <View style={[styles.accentStrip, { backgroundColor: promo.accentColor }]} />

            {/* ── Left: text ── */}
            <View style={styles.left}>
              {/* Verified pill */}
              <View style={styles.verifiedPill}>
                <Ionicons name="shield-checkmark-outline" size={10} color={promo.bgColor} />
                <Text style={[styles.verifiedText, { color: promo.bgColor, fontFamily: typography.fontFamily.bold, fontSize: 9 }]}>
                  {promo.tag}
                </Text>
              </View>

              <Text style={[styles.headline, { color: "#fff", fontFamily: typography.fontFamily.bold, fontSize: typography.size.base }]}>
                {promo.headline}
              </Text>
              <Text style={[styles.subline, { color: "rgba(255,255,255,0.80)", fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {promo.subline}
              </Text>

              <TouchableOpacity style={styles.bookBtn} onPress={() => onPress(promo)}>
                <Ionicons name="calendar-outline" size={11} color="#fff" />
                <Text style={[styles.bookBtnText, { color: "#fff", fontFamily: typography.fontFamily.bold, fontSize: 10 }]}>
                  BOOK NOW
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── Right: 2×2 service icon grid ── */}
            <View style={styles.right}>
              {promo.serviceIcons.map((item, i) => (
                <View key={i} style={styles.iconCell}>
                  <View style={[styles.iconBox, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
                    <Ionicons name={item.icon as any} size={18} color="rgba(255,255,255,0.95)" />
                  </View>
                  <Text style={[styles.iconLabel, { color: "rgba(255,255,255,0.80)", fontFamily: typography.fontFamily.medium, fontSize: 8.5 }]}>
                    {item.label}
                  </Text>
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
  },

  accentStrip: {
    position: "absolute",
    right:    0,
    top:      0,
    bottom:   0,
    width:    CARD_W * 0.38,
    opacity:  0.55,
  },

  // Left
  left: {
    flex:              1,
    paddingHorizontal: 16,
    paddingVertical:   14,
    justifyContent:    "space-between",
    zIndex:            1,
  },
  verifiedPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:                4,
    backgroundColor:   "rgba(255,255,255,0.92)",
    alignSelf:         "flex-start",
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
  },
  verifiedText: {},
  headline:     { marginTop: 4, lineHeight: 20 },
  subline:      { marginTop: 2 },
  bookBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:                5,
    alignSelf:         "flex-start",
    backgroundColor:   "rgba(255,255,255,0.18)",
    borderWidth:        1,
    borderColor:       "rgba(255,255,255,0.35)",
    paddingHorizontal: 10,
    paddingVertical:    5,
    borderRadius:      20,
    marginTop:          6,
  },
  bookBtnText: {},

  // Right icon grid — 2 columns × 2 rows
  right: {
    width:          120,
    flexDirection:  "row",
    flexWrap:       "wrap",
    alignContent:   "center",
    justifyContent: "center",
    gap:             10,
    paddingVertical: 14,
    paddingRight:    14,
    zIndex:          1,
  },
  iconCell: {
    width:      46,
    alignItems: "center",
    gap:         4,
  },
  iconBox: {
    width:          40,
    height:         40,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  iconLabel: { textAlign: "center" },

  // Dots
  dots:        { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 10 },
  dot:         { height: 4, borderRadius: 2 },
  dotActive:   { width: 18, backgroundColor: "#0F4C81" },
  dotInactive: { width: 6,  backgroundColor: "#CBD5E1" },
});
