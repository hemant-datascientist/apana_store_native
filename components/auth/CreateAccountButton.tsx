// ============================================================
// CREATE ACCOUNT BUTTON — Apana Store (Auth Component)
//
// Primary CTA on the Create Account screen.
// Active when all fields are valid; disabled (gray) otherwise.
// Shows ActivityIndicator while API call is in-flight.
//
// Props:
//   canSubmit — all 3 fields valid
//   loading   — API call in-flight
//   onPress   — called on valid tap
// ============================================================

import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface CreateAccountButtonProps {
  canSubmit: boolean;
  loading:   boolean;
  onPress:   () => void;
}

export default function CreateAccountButton({ canSubmit, loading, onPress }: CreateAccountButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        canSubmit
          ? [styles.btnActive, { backgroundColor: colors.primary, shadowColor: colors.primary }]
          : [styles.btnDisabled, { backgroundColor: colors.subText }],
      ]}
      activeOpacity={canSubmit ? 0.88 : 1}
      onPress={canSubmit ? onPress : undefined}
    >
      {loading ? (
        // ── Spinner while API call is in-flight ──
        <ActivityIndicator color={colors.white} />
      ) : (
        <>
          <Text style={[styles.label, {
            color:      colors.white,
            fontFamily: typography.fontFamily.bold,
            fontSize:   typography.size.md,
          }]}>
            Create Account
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
