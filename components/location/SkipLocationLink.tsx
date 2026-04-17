// ============================================================
// SKIP LOCATION LINK — Apana Store (Location Component)
//
// "Skip for now" ghost link at the bottom of the location-access
// screen. Lets users proceed without granting location access.
// The app falls back to the default Pune address.
//
// Props:
//   onSkip — called when tapped
// ============================================================

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface SkipLocationLinkProps {
  onSkip: () => void;
}

export default function SkipLocationLink({ onSkip }: SkipLocationLinkProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onSkip} activeOpacity={0.7} style={styles.btn}>
      <Text style={[styles.text, {
        color:      colors.subText,
        fontFamily: typography.fontFamily.regular,
        fontSize:   typography.size.sm,
        textDecorationLine: "underline",
      }]}>
        Skip for now
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn:  { alignSelf: "center", paddingVertical: 6 },
  text: {},
});
