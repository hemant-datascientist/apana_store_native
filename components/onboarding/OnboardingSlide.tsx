// ============================================================
// ONBOARDING SLIDE — Apana Store (Onboarding Component)
//
// Single slide card: icon in a rounded colored square,
// title, and body text. Width is passed as a prop to
// match the screen width for proper paging.
//
// Props:
//   slide — OnboardingSlide data object
//   width — screen width (from Dimensions.get)
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import { typography } from "../../theme/typography";
import { OnboardingSlide } from "../../data/onboardingData";

interface OnboardingSlideProps {
  slide: OnboardingSlide;
  width: number;
}

export default function OnboardingSlideCard({ slide, width }: OnboardingSlideProps) {
  return (
    <View style={[styles.slide, { width }]}>
      {/* ── Icon in colored rounded square ── */}
      <View style={[styles.iconWrap, { backgroundColor: slide.bg }]}>
        <Ionicons name={slide.icon as any} size={64} color={slide.color} />
      </View>

      {/* ── Slide title — uses slide's accent color ── */}
      <Text style={[styles.title, {
        color:      slide.color,
        fontFamily: typography.fontFamily.bold,
        fontSize:   typography.size.xl + 2,
      }]}>
        {slide.title}
      </Text>

      {/* ── Body text ── */}
      <Text style={[styles.body, {
        fontFamily: typography.fontFamily.regular,
        fontSize:   typography.size.sm,
      }]}>
        {slide.body}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    alignItems:        "center",
    justifyContent:    "center",
    paddingHorizontal: 36,
    gap:               18,
    paddingTop:        24,
  },

  // ── Icon wrapper ────────────────────────────────────────────
  iconWrap: {
    width:          130,
    height:         130,
    borderRadius:   40,
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   8,
  },

  // ── Text ────────────────────────────────────────────────────
  title: {
    textAlign:  "center",
    lineHeight: 30,
  },
  body: {
    color:      "#6B7280",
    textAlign:  "center",
    lineHeight: 22,
  },
});
