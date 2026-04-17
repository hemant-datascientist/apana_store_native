// ============================================================
// BANNER CAROUSEL — Apana Store (Customer App)
//
// Auto-scrolling promotional banners (every 3 s).
// Each slide: colored card with decorative pattern elements,
// tag pill, title, subtitle, and large icon.
// Dot indicators below the carousel.
// ============================================================

import React, { useRef, useState, useEffect } from "react";
import {
  View, Text, ScrollView, StyleSheet, Dimensions,
  TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Banner } from "../../data/homeData";
import { typography } from "../../theme/typography";
import useTheme from "../../theme/useTheme";

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_H = 160;
const H_PAD  = 16;
const CARD_W = SCREEN_W - H_PAD * 2;

interface BannerCarouselProps {
  banners:  Banner[];
  onPress?: (banner: Banner) => void;
}

export default function BannerCarousel({ banners, onPress }: BannerCarouselProps) {
  const { colors }          = useTheme();
  const scrollRef           = useRef<ScrollView>(null);
  const [active, setActive] = useState(0);

  // Auto-scroll every 3 s
  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % banners.length;
        scrollRef.current?.scrollTo({ x: next * (CARD_W + 12), animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [banners.length]);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (CARD_W + 12));
    setActive(idx);
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_W + 12}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingHorizontal: H_PAD }]}
        onMomentumScrollEnd={onScroll}
      >
        {banners.map(banner => (
          <TouchableOpacity
            key={banner.id}
            style={[styles.card, { backgroundColor: banner.bg, width: CARD_W }]}
            onPress={() => onPress?.(banner)}
            activeOpacity={0.9}
          >
            {/* Decorative circles (background pattern) */}
            <View style={[styles.circle1, { backgroundColor: "rgba(255,255,255,0.08)" }]} />
            <View style={[styles.circle2, { backgroundColor: "rgba(255,255,255,0.06)" }]} />

            {/* Content */}
            <View style={styles.content}>
              {/* Tag pill */}
              <View style={[styles.tag, { backgroundColor: banner.accent + "30" }]}>
                <Text style={[styles.tagText, { color: banner.accent, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                  {banner.tag}
                </Text>
              </View>

              {/* Title */}
              <Text style={[styles.title, { color: "#fff", fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
                {banner.title}
              </Text>

              {/* Subtitle */}
              <Text numberOfLines={2} style={[styles.subtitle, { color: "rgba(255,255,255,0.80)", fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {banner.subtitle}
              </Text>
            </View>

            {/* Decorative icon */}
            <View style={styles.iconWrap}>
              <Ionicons name={banner.icon as any} size={72} color="rgba(255,255,255,0.15)" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dot indicators */}
      <View style={styles.dots}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === active ? colors.primary : "#CBD5E1" },
              i === active && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper:  { marginTop: 12 },
  list:     { gap: 12 },
  card: {
    height:       CARD_H,
    borderRadius: 16,
    overflow:     "hidden",
    flexDirection: "row",
    alignItems:   "center",
  },

  // Background decorative circles
  circle1: {
    position:     "absolute",
    width:         200,
    height:        200,
    borderRadius:  100,
    top:           -60,
    right:         -40,
  },
  circle2: {
    position:     "absolute",
    width:         140,
    height:        140,
    borderRadius:  70,
    bottom:        -50,
    right:          60,
  },

  content: {
    flex:    1,
    padding: 18,
    gap:     6,
  },
  tag: {
    alignSelf:         "flex-start",
    paddingHorizontal: 10,
    paddingVertical:    4,
    borderRadius:       20,
    marginBottom:       2,
  },
  tagText: {},
  title:    { lineHeight: 28 },
  subtitle: { lineHeight: 17 },

  iconWrap: {
    paddingRight: 12,
  },

  // Dots
  dots: {
    flexDirection:  "row",
    justifyContent: "center",
    alignItems:     "center",
    gap:             6,
    marginTop:       10,
  },
  dot: {
    width:        6,
    height:       6,
    borderRadius: 3,
  },
  dotActive: {
    width: 18,
    borderRadius: 3,
  },
});
