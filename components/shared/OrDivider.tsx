// ============================================================
// OR DIVIDER — Apana Store (Shared Component)
//
// Horizontal line divider with centered "OR" label.
// Used on login, create-account, and any auth screen
// that needs to separate primary from secondary actions.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export default function OrDivider() {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {/* Left line */}
      <View style={[styles.line, { backgroundColor: colors.border }]} />

      {/* Label */}
      <Text style={[styles.label, {
        color:      colors.subText,
        fontFamily: typography.fontFamily.medium,
        fontSize:   typography.size.xs,
      }]}>
        OR
      </Text>

      {/* Right line */}
      <View style={[styles.line, { backgroundColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           10,
  },
  line:  { flex: 1, height: 1 },
  label: {},
});
