// ============================================================
// HERO SECTION — Apana Store (Onboarding Component)
//
// Dark blue top section of the Get Started screen.
// Contains the skip button (top-right) and the brand logo
// (storefront icon + app name + tagline).
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import useTheme         from "../../theme/useTheme";
import { typography }   from "../../theme/typography";

// Gold accent for the logo circle
const GOLD = "#FFD700";

interface HeroSectionProps {
  onSkip: () => void;
}

export default function HeroSection({ onSkip }: HeroSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.hero, { backgroundColor: colors.primary }]}>
      {/* ── Top row: skip button aligned right ── */}
      <SafeAreaView edges={["top"]}>
        <TouchableOpacity style={styles.skipBtn} onPress={onSkip} activeOpacity={0.7}>
          <Text style={[styles.skipText, {
            color:      colors.white + "B3",   // 70% opacity
            fontFamily: typography.fontFamily.medium,
            fontSize:   typography.size.sm,
          }]}>
            Skip
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* ── Logo block ── */}
      <View style={styles.logoWrap}>
        {/* Gold circle with storefront icon */}
        <View style={[styles.logoCircle, {
          shadowColor: GOLD,
        }]}>
          <Ionicons name="storefront" size={38} color={colors.primary} />
        </View>

        {/* App name */}
        <Text style={[styles.appName, {
          color:      colors.white,
          fontFamily: typography.fontFamily.bold,
          fontSize:   typography.size.xxl + 4,
        }]}>
          Apana Store
        </Text>

        {/* Tagline */}
        <Text style={[styles.tagline, {
          color:      colors.white + "A6",   // 65% opacity
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.xs,
        }]}>
          Shop Local · Shop Smart
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingBottom: 36,
  },

  // ── Skip button ─────────────────────────────────────────────
  skipBtn: {
    alignSelf:         "flex-end",
    paddingHorizontal: 20,
    paddingVertical:   12,
  },
  skipText: {
    letterSpacing: 0.2,
  },

  // ── Logo block ──────────────────────────────────────────────
  logoWrap: {
    alignItems:   "center",
    gap:           8,
    paddingBottom: 8,
  },
  logoCircle: {
    width:           80,
    height:          80,
    borderRadius:    24,
    backgroundColor: "#FFD700",
    alignItems:      "center",
    justifyContent:  "center",
    marginBottom:    4,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.5,
    shadowRadius:    12,
    elevation:       8,
  },
  appName: {
    letterSpacing: 0.2,
  },
  tagline: {
    letterSpacing: 0.5,
  },
});
