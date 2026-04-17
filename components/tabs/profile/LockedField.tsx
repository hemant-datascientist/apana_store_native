// ============================================================
// LOCKED FIELD — Apana Store (Profile Component)
//
// Read-only field for values that cannot be edited inline.
// Used for Mobile Number on the Edit Profile screen.
// Shows a "Locked" badge and an explanatory hint below.
//
// Props:
//   label — field label
//   icon  — Ionicons glyph
//   value — display value (read-only)
//   hint  — explanation text shown below the field
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

interface LockedFieldProps {
  label: string;
  icon:  string;
  value: string;
  hint:  string;
}

export default function LockedField({ label, icon, value, hint }: LockedFieldProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.block}>
      {/* ── Label ── */}
      <Text style={[styles.label, {
        color:      colors.subText,
        fontFamily: typography.fontFamily.medium,
        fontSize:   typography.size.xs + 1,
      }]}>
        {label}
      </Text>

      {/* ── Locked row ── */}
      <View style={[styles.row, {
        borderColor:     colors.border,
        backgroundColor: colors.background,
      }]}>
        <Ionicons name={icon as any} size={18} color={colors.subText} />

        {/* Value text */}
        <Text style={[styles.value, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.md - 1,
        }]}>
          {value}
        </Text>

        {/* Locked badge */}
        <View style={[styles.badge, { backgroundColor: colors.border }]}>
          <Ionicons name="lock-closed" size={11} color={colors.subText} />
          <Text style={[styles.badgeText, {
            color:      colors.subText,
            fontFamily: typography.fontFamily.medium,
            fontSize:   typography.size.xs - 2,
          }]}>
            Locked
          </Text>
        </View>
      </View>

      {/* ── Hint ── */}
      <Text style={[styles.hint, {
        color:      colors.subText,
        fontFamily: typography.fontFamily.regular,
        fontSize:   typography.size.xs - 1,
        opacity:    0.7,
      }]}>
        {hint}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 6 },
  label: {},
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    borderWidth:       1.5,
    borderRadius:      12,
    paddingHorizontal: 12,
    paddingVertical:   4,
    gap:               8,
  },
  value: {
    flex:            1,
    paddingVertical: 12,
  },
  badge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               3,
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderRadius:      8,
  },
  badgeText: {},
  hint:      { marginTop: 2 },
});
