// ============================================================
// SAVE BUTTON — Apana Store (Profile Component)
//
// "Save Changes" primary CTA on the Edit Profile screen.
// Disabled (gray) until fields are dirty and valid.
// Shows ActivityIndicator while save API call is in-flight.
//
// Props:
//   canSave  — dirty && all fields valid
//   loading  — API call in-flight
//   onPress  — called on valid tap
// ============================================================

import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

interface SaveButtonProps {
  canSave:  boolean;
  loading:  boolean;
  onPress:  () => void;
}

export default function SaveButton({ canSave, loading, onPress }: SaveButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        canSave
          ? [styles.btnActive, { backgroundColor: colors.primary, shadowColor: colors.primary }]
          : [styles.btnDisabled, { backgroundColor: colors.subText }],
      ]}
      activeOpacity={canSave ? 0.88 : 1}
      onPress={canSave ? onPress : undefined}
    >
      {loading ? (
        // ── Spinner ──
        <ActivityIndicator color={colors.white} />
      ) : (
        <>
          <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
          <Text style={[styles.label, {
            color:      colors.white,
            fontFamily: typography.fontFamily.bold,
            fontSize:   typography.size.md,
          }]}>
            Save Changes
          </Text>
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
