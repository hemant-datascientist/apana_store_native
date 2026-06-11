// ============================================================
// REGION SECTION — Apana Store (Bharat Screen)
//
// One regional group displayed as a horizontal scroll row:
//   • Bold region title + state count chip
//   • Horizontal ScrollView of StateCards (no wrap)
// ============================================================

import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { typography } from "../../../theme/typography";
import useTheme from "../../../theme/useTheme";
import { RegionGroup, StateInfo } from "../../../data/bharatData";
import StateCard from "./StateCard";

interface RegionSectionProps {
  group:    RegionGroup;
  primary:  string;
  // Live per-state counts (normalised state name → live). undefined = mock
  // mode (cards use bundled numbers); null = live mode still loading.
  liveCounts?: Record<string, number> | null;
  onPress?: (state: StateInfo) => void;
}

// Same normalisation as the service — bharat names → response keys.
const norm = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export default function RegionSection({ group, primary, liveCounts, onPress }: RegionSectionProps) {
  const { colors } = useTheme();

  // undefined → mock passthrough · null → loading · map → count (absent = 0)
  const liveFor = (state: StateInfo): number | null | undefined =>
    liveCounts === undefined ? undefined
    : liveCounts === null    ? null
    : liveCounts[norm(state.name)] ?? 0;

  return (
    <View style={styles.section}>

      {/* Title row */}
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.base }]}>
            {group.title}
          </Text>
          <View style={[styles.accent, { backgroundColor: primary }]} />
        </View>

        {/* State count chip */}
        <View style={[styles.chip, { backgroundColor: primary + "15", borderColor: primary + "30" }]}>
          <Text style={[styles.chipText, { color: primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            {group.states.length} {group.states.length === 1 ? "state" : "states"}
          </Text>
        </View>
      </View>

      {/* Horizontal strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}
      >
        {group.states.map(state => (
          <StateCard
            key={state.key}
            state={state}
            primary={primary}
            liveCount={liveFor(state)}
            onPress={onPress}
          />
        ))}
        {/* Right padding sentinel */}
        <View style={{ width: 6 }} />
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },

  titleRow: {
    flexDirection:     "row",
    alignItems:        "flex-end",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    marginBottom:      12,
  },
  titleLeft: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  accent: {
    width:        28,
    height:       3,
    borderRadius: 2,
  },

  chip: {
    paddingHorizontal: 10,
    paddingVertical:    4,
    borderRadius:      20,
    borderWidth:        1,
    marginLeft:        10,
    marginBottom:       2,
  },
  chipText: {},

  strip: {
    paddingLeft:  16,
    paddingRight: 10,
    alignItems:   "flex-start",
  },
});
