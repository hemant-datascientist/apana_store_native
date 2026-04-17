// ============================================================
// GET STARTED — Apana Store (Customer App)
//
// First screen new users see. Shows app branding + features.
//
// Actions:
//   "Get Started"        → /login
//   "Skip, browse guest" → main tabs as guest (no cart/order)
// ============================================================

import React, { useRef, useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
  Dimensions, ScrollView, Animated,
} from "react-native";
import { SafeAreaView }  from "react-native-safe-area-context";
import { Ionicons }      from "@expo/vector-icons";
import { useRouter }     from "expo-router";
import { typography }    from "../theme/typography";
import { useAuth }       from "../context/AuthContext";

const { width: SW, height: SH } = Dimensions.get("window");
const BRAND_BLUE  = "#0F4C81";
const BRAND_BLUE2 = "#1A5E9A";
const GOLD        = "#FFD700";

// ── Onboarding slides ─────────────────────────────────────────
const SLIDES = [
  {
    icon:  "storefront-outline",
    title: "Shop from Nearby Stores",
    body:  "Discover hundreds of local shops, kirana stores, and brands right in your neighbourhood.",
    bg:    "#EFF6FF",
    color: BRAND_BLUE,
  },
  {
    icon:  "bicycle-outline",
    title: "Fast Local Delivery",
    body:  "Get groceries, medicines, food & more delivered in minutes — straight from the store near you.",
    bg:    "#F0FDF4",
    color: "#15803D",
  },
  {
    icon:  "heart-outline",
    title: "Support Local Businesses",
    body:  "Every order you place helps local shop owners grow. Shop local, build community.",
    bg:    "#FFF7ED",
    color: "#C2410C",
  },
];

export default function GetStartedScreen() {
  const router              = useRouter();
  const { skipAsGuest }     = useAuth();
  const [slideIdx, setSlideIdx] = useState(0);
  const scrollRef           = useRef<ScrollView>(null);

  function handleSlideChange(e: any) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SW);
    setSlideIdx(idx);
  }

  function handleSkip() {
    skipAsGuest();
    router.replace("/(tabs)");
  }

  function handleGetStarted() {
    router.push("/login");
  }

  const slide = SLIDES[slideIdx];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />

      {/* ── Dark blue hero top ── */}
      <View style={styles.hero}>
        <SafeAreaView edges={["top"]}>
          {/* Skip button top-right */}
          <TouchableOpacity
            style={styles.skipTopBtn}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={[styles.skipTopText, { fontFamily: typography.fontFamily.medium }]}>
              Skip
            </Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Ionicons name="storefront" size={38} color={BRAND_BLUE} />
          </View>
          <Text style={[styles.logoName, { fontFamily: typography.fontFamily.bold }]}>
            Apana Store
          </Text>
          <Text style={[styles.logoTagline, { fontFamily: typography.fontFamily.regular }]}>
            Shop Local · Shop Smart
          </Text>
        </View>
      </View>

      {/* ── Slides ── */}
      <View style={styles.slidesContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleSlideChange}
        >
          {SLIDES.map((s, i) => (
            <View key={i} style={[styles.slide, { width: SW }]}>
              <View style={[styles.slideIconWrap, { backgroundColor: s.bg }]}>
                <Ionicons name={s.icon as any} size={64} color={s.color} />
              </View>
              <Text style={[styles.slideTitle, { fontFamily: typography.fontFamily.bold, color: s.color }]}>
                {s.title}
              </Text>
              <Text style={[styles.slideBody, { fontFamily: typography.fontFamily.regular }]}>
                {s.body}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === slideIdx ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* ── Buttons ── */}
      <SafeAreaView style={styles.bottomSection} edges={["bottom"]}>

        <TouchableOpacity
          style={styles.getStartedBtn}
          activeOpacity={0.88}
          onPress={handleGetStarted}
        >
          <Text style={[styles.getStartedText, { fontFamily: typography.fontFamily.bold }]}>
            Get Started
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestBtn}
          activeOpacity={0.7}
          onPress={handleSkip}
        >
          <Text style={[styles.guestText, { fontFamily: typography.fontFamily.regular }]}>
            Skip, browse as guest
          </Text>
        </TouchableOpacity>

        <Text style={[styles.terms, { fontFamily: typography.fontFamily.regular }]}>
          By continuing, you agree to our{" "}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {" "}and{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  // ── Hero ────────────────────────────────────────────────────
  hero: {
    backgroundColor: BRAND_BLUE,
    paddingBottom:   36,
  },
  skipTopBtn: {
    alignSelf:         "flex-end",
    paddingHorizontal: 20,
    paddingVertical:   12,
  },
  skipTopText: {
    color:    "rgba(255,255,255,0.70)",
    fontSize: 14,
  },

  // Logo block
  logoWrap: {
    alignItems:   "center",
    gap:          8,
    paddingBottom: 8,
  },
  logoCircle: {
    width:          80,
    height:         80,
    borderRadius:   24,
    backgroundColor: GOLD,
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   4,
    shadowColor:    GOLD,
    shadowOffset:   { width: 0, height: 4 },
    shadowOpacity:  0.5,
    shadowRadius:   12,
    elevation:      8,
  },
  logoName: {
    fontSize: 28,
    color:    "#fff",
  },
  logoTagline: {
    fontSize: 13,
    color:    "rgba(255,255,255,0.65)",
    letterSpacing: 0.5,
  },

  // ── Slides ──────────────────────────────────────────────────
  slidesContainer: {
    flex: 1,
  },
  slide: {
    alignItems:        "center",
    justifyContent:    "center",
    paddingHorizontal: 36,
    gap:               18,
    paddingTop:        24,
  },
  slideIconWrap: {
    width:          130,
    height:         130,
    borderRadius:   40,
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   8,
  },
  slideTitle: {
    fontSize:   22,
    textAlign:  "center",
    lineHeight: 30,
  },
  slideBody: {
    fontSize:   14,
    color:      "#6B7280",
    textAlign:  "center",
    lineHeight: 22,
  },

  // Dots
  dotsRow: {
    flexDirection:  "row",
    justifyContent: "center",
    alignItems:     "center",
    gap:            8,
    paddingVertical: 16,
  },
  dot: {
    height:       8,
    borderRadius: 4,
  },
  dotActive:   { width: 24, backgroundColor: BRAND_BLUE },
  dotInactive: { width:  8, backgroundColor: "#D1D5DB" },

  // ── Bottom section ───────────────────────────────────────────
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom:     16,
    paddingTop:        8,
    gap:               12,
    alignItems:        "center",
  },
  getStartedBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             10,
    backgroundColor: BRAND_BLUE,
    borderRadius:    16,
    paddingVertical: 17,
    width:           "100%",
    shadowColor:     BRAND_BLUE,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.30,
    shadowRadius:    10,
    elevation:       6,
  },
  getStartedText: {
    color:    "#fff",
    fontSize: 16,
  },
  guestBtn: {
    paddingVertical: 6,
  },
  guestText: {
    fontSize: 14,
    color:    "#6B7280",
    textDecorationLine: "underline",
  },
  terms: {
    fontSize:   11,
    color:      "#9CA3AF",
    textAlign:  "center",
    lineHeight: 17,
  },
  termsLink: {
    color: BRAND_BLUE,
  },
});
