// ============================================================
// SIGNUP WELCOME — Apana Store (Auth Component)
//
// "Join Apana Store 🛍️" heading + subtitle shown at the top
// of the Create Account screen.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export default function SignupWelcome() {
  const { colors } = useTheme();

  return (
    <View style={styles.block}>
      {/* ── Main heading ── */}
      <Text style={[styles.title, {
        color:      colors.text,
        fontFamily: typography.fontFamily.bold,
        fontSize:   typography.size.xxl,
      }]}>
        Join Apana Store 🛍️
      </Text>

      {/* ── Supporting subtitle ── */}
      <Text style={[styles.sub, {
        color:      colors.subText,
        fontFamily: typography.fontFamily.regular,
        fontSize:   typography.size.sm,
      }]}>
        Create your account to order from local stores near you
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 6 },
  title: { lineHeight: 32 },
  sub:   { lineHeight: 20 },
});
