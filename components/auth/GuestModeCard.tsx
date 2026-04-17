// ============================================================
// GUEST MODE CARD — Apana Store (Auth Component)
//
// "Continue as Guest" outlined button + warning disclaimer.
// Shown below the OR divider on the login screen.
// Guest users can browse but cannot add to cart or order.
//
// Props:
//   onPress — calls skipAsGuest() + navigates to tabs
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface GuestModeCardProps {
  onPress: () => void;
}

export default function GuestModeCard({ onPress }: GuestModeCardProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      {/* ── Guest button ── */}
      <TouchableOpacity
        style={[styles.btn, { borderColor: colors.border, backgroundColor: colors.card }]}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <Ionicons name="eye-outline" size={18} color={colors.subText} />
        <Text style={[styles.btnText, {
          color:      colors.text,
          fontFamily: typography.fontFamily.medium,
          fontSize:   typography.size.sm + 1,
        }]}>
          Continue as Guest
        </Text>
      </TouchableOpacity>

      {/* ── Limitation warning ── */}
      <Text style={[styles.warning, {
        color:      colors.subText,
        fontFamily: typography.fontFamily.regular,
        fontSize:   typography.size.xs,
      }]}>
        Guest mode lets you browse but you'll need to sign in to place orders or add items to cart.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 10 },

  // ── Outlined button ─────────────────────────────────────────
  btn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             8,
    paddingVertical: 14,
    borderRadius:    16,
    borderWidth:     1.5,
  },
  btnText: {},

  // ── Disclaimer ──────────────────────────────────────────────
  warning: {
    textAlign:  "center",
    lineHeight: 18,
  },
});
