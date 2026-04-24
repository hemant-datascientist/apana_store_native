// ============================================================
// NEW LAUNCHERS SCREEN — Apana Store
//
// Showcases what's fresh in the city — new stores, new products,
// and new business concepts — both live and coming soon.
//
// Layout (top → bottom):
//   Header          — violet header + back
//   LaunchersHero   — "What's new in {city}" stats card
//   Live Now        — section header + LaunchCard × N
//   Coming Soon     — section header + ComingSoonCard × N
// ============================================================

import React from "react";
import {
  View, Text, ScrollView, StyleSheet, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { useLocation } from "../../context/LocationContext";

import { getLiveLaunches, getComingSoonLaunches } from "../../data/newLaunchersData";

import LaunchersHero  from "../../components/new-launchers/LaunchersHero";
import LaunchCard     from "../../components/new-launchers/LaunchCard";
import ComingSoonCard from "../../components/new-launchers/ComingSoonCard";

const ACCENT = "#7C3AED";

export default function NewLaunchersScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();
  const { city }           = useLocation();

  const liveLaunches      = getLiveLaunches();
  const comingSoon        = getComingSoonLaunches();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={ACCENT} />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: ACCENT }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
              New Launches
            </Text>
            <Text style={[styles.headerSub, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              Freshest in {city}
            </Text>
          </View>

          <View style={[styles.iconBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Ionicons name="rocket-outline" size={18} color="#fff" />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Hero card ── */}
        <LaunchersHero
          city={city}
          liveCount={liveLaunches.length}
          comingSoonCount={comingSoon.length}
        />

        {/* ── Live Now section ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.liveDot, { backgroundColor: "#22C55E" }]} />
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
              Live Now
            </Text>
            <View style={[styles.countPill, { backgroundColor: "#22C55E" + "20" }]}>
              <Text style={[styles.countText, { color: "#22C55E", fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
                {liveLaunches.length}
              </Text>
            </View>
          </View>

          {liveLaunches.map(launch => (
            <LaunchCard key={launch.id} launch={launch} />
          ))}
        </View>

        {/* ── Coming Soon section ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={18} color={ACCENT} />
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
              Coming Soon
            </Text>
            <View style={[styles.countPill, { backgroundColor: ACCENT + "20" }]}>
              <Text style={[styles.countText, { color: ACCENT, fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
                {comingSoon.length}
              </Text>
            </View>
          </View>

          {comingSoon.map(launch => (
            <ComingSoonCard key={launch.id} launch={launch} />
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {},
  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 16,
    paddingVertical:   12,
    gap:               12,
  },
  backBtn: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems:      "center",
    justifyContent:  "center",
  },
  headerCenter: { flex: 1 },
  headerTitle:  { color: "#fff" },
  headerSub:    { color: "rgba(255,255,255,0.75)", marginTop: 2 },
  iconBtn: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },

  scroll: { gap: 20, paddingVertical: 20 },

  // Sections
  section: {
    paddingHorizontal: 16,
    gap:               12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
  },
  liveDot: {
    width:        10,
    height:       10,
    borderRadius: 5,
  },
  sectionTitle: {},
  countPill: {
    paddingHorizontal: 8,
    paddingVertical:   2,
    borderRadius:      20,
  },
  countText: {},
});
