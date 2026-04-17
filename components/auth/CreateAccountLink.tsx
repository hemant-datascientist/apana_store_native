// ============================================================
// CREATE ACCOUNT LINK — Apana Store (Auth Component)
//
// "New here? Create Account" inline row shown on the login
// screen between the Send OTP button and the OR divider.
//
// Props:
//   onPress — navigates to /create-account
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface CreateAccountLinkProps {
  onPress: () => void;
}

export default function CreateAccountLink({ onPress }: CreateAccountLinkProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {/* ── Prompt text ── */}
      <Text style={[styles.prompt, {
        color:      colors.subText,
        fontFamily: typography.fontFamily.regular,
        fontSize:   typography.size.xs + 1,
      }]}>
        New here?
      </Text>

      {/* ── Tappable link ── */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
        <Text style={[styles.link, {
          color:      colors.primary,
          fontFamily: typography.fontFamily.semiBold,
          fontSize:   typography.size.xs + 1,
        }]}>
          Create Account
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
    marginTop:      -4,
  },
  prompt: {},
  link:   {},
});
