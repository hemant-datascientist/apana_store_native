// ============================================================
// SEND OTP BUTTON — Apana Store (Auth Component)
//
// Primary CTA on the login screen.
// Disabled (gray, no shadow) when the input is invalid.
// Shows a spinner while the OTP is being sent.
//
// Props:
//   isValid  — enables the button when true
//   loading  — shows ActivityIndicator when true
//   onPress  — called on a valid tap
//   label    — button text (default: "Send OTP")
// ============================================================

import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface SendOtpButtonProps {
  isValid:  boolean;
  loading:  boolean;
  onPress:  () => void;
  label?:   string;
}

export default function SendOtpButton({
  isValid, loading, onPress, label = "Send OTP",
}: SendOtpButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isValid
          // ── Active: branded + shadow ──
          ? [styles.btnActive, { backgroundColor: colors.primary, shadowColor: colors.primary }]
          // ── Disabled: flat gray ──
          : [styles.btnDisabled, { backgroundColor: colors.subText }],
      ]}
      activeOpacity={isValid ? 0.88 : 1}
      onPress={isValid ? onPress : undefined}
    >
      {loading ? (
        // ── Loading spinner ──
        <ActivityIndicator color={colors.white} />
      ) : (
        <>
          <Text style={[styles.label, {
            color:      colors.white,
            fontFamily: typography.fontFamily.bold,
            fontSize:   typography.size.md,
          }]}>
            {label}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             10,
    borderRadius:    16,
    paddingVertical: 17,
    marginTop:       4,
  },
  btnActive: {
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius:  10,
    elevation:     5,
  },
  btnDisabled: {
    shadowOpacity: 0,
    elevation:     0,
  },
  label: {},
});
