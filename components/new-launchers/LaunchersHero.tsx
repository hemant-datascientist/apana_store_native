// ============================================================
// LAUNCHERS HERO — Apana Store
//
// Top card on the New Launchers screen.
// Shows "What's new in {city}" headline with two stat pills:
//   Live count  (green)
//   Coming soon count (violet)
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../theme/typography";

interface LaunchersHeroProps {
  city:          string;
  liveCount:     number;
  comingSoonCount: number;
}

export default function LaunchersHero({ city, liveCount, comingSoonCount }: LaunchersHeroProps) {
  return (
    <View style={styles.card}>
      {/* Decorative sparkle icon */}
      <View style={styles.iconWrap}>
        <Ionicons name="rocket-outline" size={28} color="#fff" />
      </View>

      <Text style={[styles.eyebrow, { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
        What's new in
      </Text>
      <Text style={[styles.city, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xxl }]}>
        {city}
      </Text>
      <Text style={[styles.tagline, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
        Fresh stores, new products &amp; bold concepts — landing near you
      </Text>

      {/* Stat pills */}
      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Ionicons name="radio-button-on" size={10} color="#22C55E" />
          <Text style={[styles.statText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
            {liveCount} Live now
          </Text>
        </View>
        <View style={[styles.statPill, styles.statPillViolet]}>
          <Ionicons name="calendar-outline" size={10} color="#C4B5FD" />
          <Text style={[styles.statText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
            {comingSoonCount} Coming soon
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius:     20,
    backgroundColor:  "#7C3AED",
    padding:          20,
    gap:              8,
  },

  iconWrap: {
    width:          48,
    height:         48,
    borderRadius:   14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   4,
  },

  eyebrow: { color: "rgba(255,255,255,0.7)" },
  city:    { color: "#fff" },
  tagline: { color: "rgba(255,255,255,0.75)", lineHeight: 20 },

  statsRow: {
    flexDirection: "row",
    gap:           10,
    marginTop:     4,
  },

  statPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    backgroundColor:   "rgba(34,197,94,0.18)",
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      20,
  },
  statPillViolet: {
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  statText: { color: "#fff" },
});
