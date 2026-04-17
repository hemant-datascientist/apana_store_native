// ============================================================
// LOCATION HERO — Apana Store (Location Component)
//
// Top section of the location-access screen.
// Large icon + title + subtitle explaining why location is needed.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export default function LocationHero() {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      {/* ── Icon circle ── */}
      <View style={[styles.iconCircle, { backgroundColor: colors.primary + "15" }]}>
        <Ionicons name="location" size={52} color={colors.primary} />
      </View>

      {/* ── Heading ── */}
      <Text style={[styles.title, {
        color:      colors.text,
        fontFamily: typography.fontFamily.bold,
        fontSize:   typography.size.xxl,
      }]}>
        Find Stores Near You
      </Text>

      {/* ── Subtitle ── */}
      <Text style={[styles.sub, {
        color:      colors.subText,
        fontFamily: typography.fontFamily.regular,
        fontSize:   typography.size.sm,
      }]}>
        Allow location access to discover local stores, get accurate delivery times, and see live offers in your area.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap:         20,
    paddingTop:  16,
  },
  iconCircle: {
    width:          110,
    height:         110,
    borderRadius:   34,
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   8,
  },
  title: {
    textAlign: "center",
    lineHeight: 32,
  },
  sub: {
    textAlign:  "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
});
