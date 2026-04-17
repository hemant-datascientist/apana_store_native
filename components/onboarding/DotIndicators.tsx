// ============================================================
// DOT INDICATORS — Apana Store (Onboarding Component)
//
// Pagination dots shown below the slide carousel.
// Active dot is wider (pill shape) and primary-colored.
// Inactive dots are small circles in a neutral gray.
//
// Props:
//   total     — total number of slides
//   activeIdx — currently visible slide index (0-based)
// ============================================================

import React from "react";
import { View, StyleSheet } from "react-native";
import useTheme from "../../theme/useTheme";

interface DotIndicatorsProps {
  total:     number;
  activeIdx: number;
}

export default function DotIndicators({ total, activeIdx }: DotIndicatorsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === activeIdx
              // ── Active: pill shape, primary color ──
              ? [styles.dotActive,   { backgroundColor: colors.primary }]
              // ── Inactive: small circle, muted color ──
              : [styles.dotInactive, { backgroundColor: colors.border }],
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:   "row",
    justifyContent:  "center",
    alignItems:      "center",
    gap:             8,
    paddingVertical: 16,
  },

  // Base dot style
  dot: {
    height:       8,
    borderRadius: 4,
  },

  // Active pill — wider
  dotActive:   { width: 24 },

  // Inactive circle
  dotInactive: { width:  8 },
});
