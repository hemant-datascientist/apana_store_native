// ============================================================
// BOTTOM ACTIONS — Apana Store (Onboarding Component)
//
// Bottom section of the Get Started screen:
//   • "Get Started" primary button → navigates to /login
//   • "Skip, browse as guest" text link → guest mode
//   • Terms of Service + Privacy Policy disclaimer
//
// Props:
//   onGetStarted — tapping "Get Started"
//   onSkip       — tapping "Skip, browse as guest"
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import useTheme         from "../../theme/useTheme";
import { typography }   from "../../theme/typography";
import AuthTerms        from "../auth/AuthTerms";

interface BottomActionsProps {
  onGetStarted: () => void;
  onSkip:       () => void;
}

export default function BottomActions({ onGetStarted, onSkip }: BottomActionsProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      {/* ── Primary CTA: Get Started ── */}
      <TouchableOpacity
        style={[styles.getStartedBtn, {
          backgroundColor: colors.primary,
          shadowColor:     colors.primary,
        }]}
        activeOpacity={0.88}
        onPress={onGetStarted}
      >
        <Text style={[styles.getStartedText, {
          color:      colors.white,
          fontFamily: typography.fontFamily.bold,
          fontSize:   typography.size.md,
        }]}>
          Get Started
        </Text>
        <Ionicons name="arrow-forward" size={18} color={colors.white} />
      </TouchableOpacity>

      {/* ── Secondary: Skip / guest mode ── */}
      <TouchableOpacity style={styles.skipBtn} activeOpacity={0.7} onPress={onSkip}>
        <Text style={[styles.skipText, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.sm,
        }]}>
          Skip, browse as guest
        </Text>
      </TouchableOpacity>

      {/* ── Legal disclaimer ── */}
      <AuthTerms action="signing in" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom:     16,
    paddingTop:        8,
    gap:               12,
    alignItems:        "center",
  },

  // ── Get Started button ───────────────────────────────────────
  getStartedBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             10,
    borderRadius:    16,
    paddingVertical: 17,
    width:           "100%",
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.30,
    shadowRadius:    10,
    elevation:       6,
  },
  getStartedText: {},

  // ── Skip link ────────────────────────────────────────────────
  skipBtn: {
    paddingVertical: 6,
  },
  skipText: {
    textDecorationLine: "underline",
  },
});
