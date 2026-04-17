// ============================================================
// SIGN IN LINK — Apana Store (Auth Component)
//
// "Already have an account? Sign In" row shown at the bottom
// of the Create Account screen. Navigates back to login.
//
// Props:
//   onPress — called when user taps "Sign In"
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface SignInLinkProps {
  onPress: () => void;
}

export default function SignInLink({ onPress }: SignInLinkProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {/* ── Static text ── */}
      <Text style={[styles.text, {
        color:      colors.subText,
        fontFamily: typography.fontFamily.regular,
        fontSize:   typography.size.xs + 1,
      }]}>
        Already have an account?
      </Text>

      {/* ── Tappable link ── */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
        <Text style={[styles.link, {
          color:      colors.primary,
          fontFamily: typography.fontFamily.semiBold,
          fontSize:   typography.size.xs + 1,
        }]}>
          Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  "row",
    justifyContent: "center",
    alignItems:     "center",
    gap:            6,
  },
  text: {},
  link: {},
});
