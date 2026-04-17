// ============================================================
// WELCOME BLOCK — Apana Store (Auth Component)
//
// Title + subtitle shown at the top of the login screen.
// "Welcome Back 👋 / Sign in to order from local stores near you"
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export default function WelcomeBlock() {
  const { colors } = useTheme();

  return (
    <View style={styles.block}>
      {/* ── Primary heading ── */}
      <Text style={[styles.title, {
        color:      colors.text,
        fontFamily: typography.fontFamily.bold,
        fontSize:   typography.size.xxl + 2,
      }]}>
        Welcome Back 👋
      </Text>

      {/* ── Supporting subtitle ── */}
      <Text style={[styles.sub, {
        color:      colors.subText,
        fontFamily: typography.fontFamily.regular,
        fontSize:   typography.size.sm,
      }]}>
        Sign in to order from local stores near you
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap:          6,
    marginBottom: 8,
  },
  title: {
    lineHeight: 34,
  },
  sub: {
    lineHeight: 20,
  },
});
