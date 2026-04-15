// ============================================================
// STORE LIVE SCREEN — Apana Store (Customer App)
//
// Accessible by tapping "Stores Live – 410" in HomeHeader.
//
// Sections:
//   1. Live count chip
//   2. DonutChart       — store distribution pie
//   3. HorizontalBars   — percentage bar list
//   4. StoreTable       — Live | Close Now data table
// ============================================================

import React from "react";
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../theme/useTheme";
import { typography } from "../theme/typography";
import { STORE_LIVE_DATA, TOTAL_LIVE } from "../data/storeLiveData";
import DonutChart    from "../components/store-live/DonutChart";
import HorizontalBars from "../components/store-live/HorizontalBars";
import StoreTable    from "../components/store-live/StoreTable";

export default function StoreLiveScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.card}
      />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
          Store Live
        </Text>

        <TouchableOpacity style={styles.headerBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="help-circle-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* ── Content ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Live count chip */}
        <View style={[styles.liveChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.liveDot} />
          <Text style={[styles.liveText, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
            Stores Live – {TOTAL_LIVE.toLocaleString("en-IN")}
          </Text>
        </View>

        {/* Donut chart */}
        <DonutChart data={STORE_LIVE_DATA} />

        {/* Section label */}
        <Text style={[styles.sectionLabel, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
          DISTRIBUTION BY STORE TYPE
        </Text>

        {/* Horizontal bars */}
        <HorizontalBars data={STORE_LIVE_DATA} />

        {/* Section label */}
        <Text style={[styles.sectionLabel, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs, marginTop: 20 }]}>
          LIVE vs CLOSED
        </Text>

        {/* Data table */}
        <StoreTable data={STORE_LIVE_DATA} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1 },

  // Header
  header: {
    flexDirection:    "row",
    alignItems:       "center",
    paddingHorizontal: 16,
    paddingBottom:     12,
    borderBottomWidth: 1,
  },
  headerBtn:   { width: 36 },
  headerTitle: { flex: 1, textAlign: "center" },

  // Content
  content: {
    paddingTop:    16,
    paddingBottom: 40,
    gap:           0,
  },

  // Live chip
  liveChip: {
    flexDirection:     "row",
    alignItems:        "center",
    alignSelf:         "center",
    gap:                8,
    paddingHorizontal: 18,
    paddingVertical:   8,
    borderRadius:      24,
    borderWidth:       1,
    marginBottom:      4,
  },
  liveDot: {
    width:           10,
    height:          10,
    borderRadius:    5,
    backgroundColor: "#22C55E",
  },
  liveText: {},

  // Section labels
  sectionLabel: {
    letterSpacing:    0.8,
    paddingHorizontal: 16,
    marginBottom:      10,
    marginTop:         16,
  },
});
