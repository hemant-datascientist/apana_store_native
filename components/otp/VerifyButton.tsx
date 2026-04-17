// ============================================================
// VERIFY BUTTON — Apana Store (OTP Component)
//
// Primary CTA on the OTP screen.
// Disabled (gray) until all 6 boxes are filled.
// Label changes per flow:
//   Register step 1 → "Verify Mobile"  + arrow icon
//   All other       → "Verify & Continue" + checkmark icon
//
// Props:
//   isComplete  — all 6 digits entered
//   loading     — shows spinner while verifying
//   isRegister  — true for registration flow
//   step        — "phone" | "email" (affects label on step 1)
//   onPress     — called on valid tap
// ============================================================

import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface VerifyButtonProps {
  isComplete: boolean;
  loading:    boolean;
  isRegister: boolean;
  step:       "phone" | "email";
  onPress:    () => void;
}

export default function VerifyButton({
  isComplete, loading, isRegister, step, onPress,
}: VerifyButtonProps) {
  const { colors } = useTheme();

  // ── Label and icon differ on register step 1 ────────────────
  const isPhoneStep = isRegister && step === "phone";
  const label       = isPhoneStep ? "Verify Mobile" : "Verify & Continue";
  const iconName    = isPhoneStep ? "arrow-forward" : "checkmark-circle-outline";

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isComplete
          ? [styles.btnActive, { backgroundColor: colors.primary, shadowColor: colors.primary }]
          : [styles.btnDisabled, { backgroundColor: colors.subText }],
      ]}
      activeOpacity={isComplete ? 0.88 : 1}
      onPress={isComplete ? onPress : undefined}
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
          <Ionicons name={iconName as any} size={20} color={colors.white} />
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
    width:           "100%",
    marginTop:       12,
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
