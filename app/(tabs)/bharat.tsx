// ============================================================
// BHARAT SCREEN — Apana Store (Customer App)
//
// All 28 states + 8 UTs shown as state silhouettes grouped by
// region. Tapping a state will eventually open a regional store
// discovery view.
//
// Layout:
//   Header  — "Bharat" title + state count badge
//   MapCard — composite India SVG coloured by region + legend
//   ScrollView — RegionSection per region group
//
// Data: data/bharatData.ts  (REGION_GROUPS)
// SVG:  react-native-svg via StateSvg
// ============================================================

import React from "react";
import {
  View, Text, ScrollView, StyleSheet, Alert, StatusBar, Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { REGION_GROUPS, StateInfo } from "../../data/bharatData";
import RegionSection from "../../components/tabs/bharat/RegionSection";
import IndiaMapSvg   from "../../components/tabs/bharat/IndiaMapSvg";

// Total state + UT count for the badge
const TOTAL_STATES = REGION_GROUPS.reduce((acc, g) => acc + g.states.length, 0);

const { width: SW } = Dimensions.get("window");
// Map renders at 60 % of screen width, centred inside the card
const MAP_WIDTH = Math.round(SW * 0.60);

export default function BharatScreen() {
  const { colors, isDark } = useTheme();

  function handleStatePress(state: StateInfo) {
    Alert.alert(state.name, `Explore stores in ${state.name} — coming soon.`);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.card}
      />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <View style={styles.headerContent}>

          {/* Left: map pin icon */}
          <View style={[styles.headerIcon, { backgroundColor: colors.primary + "18" }]}>
            <Ionicons name="map-outline" size={20} color={colors.primary} />
          </View>

          {/* Center: title + subtitle */}
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
              Bharat
            </Text>
            <Text style={[styles.headerSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              Explore stores across India
            </Text>
          </View>

          {/* Right: state count badge */}
          <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.countText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
              {TOTAL_STATES}
            </Text>
            <Text style={[styles.countLabel, { fontFamily: typography.fontFamily.regular, fontSize: 9 }]}>
              States
            </Text>
          </View>

        </View>
      </SafeAreaView>

      {/* ── Region list ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── India map card ── */}
        <View style={[styles.mapCard, { backgroundColor: colors.primary }]}>

          {/* Card header */}
          <View style={styles.mapCardHeader}>
            <Text style={[styles.mapCardTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.base }]}>
              India — All States
            </Text>
            <View style={styles.mapStatRow}>
              <View style={styles.mapStat}>
                <Text style={[styles.mapStatNum, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                  {TOTAL_STATES}
                </Text>
                <Text style={[styles.mapStatLbl, { fontFamily: typography.fontFamily.regular, fontSize: 9.5 }]}>
                  States & UTs
                </Text>
              </View>
              <View style={styles.mapStatDivider} />
              <View style={styles.mapStat}>
                <Text style={[styles.mapStatNum, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                  {REGION_GROUPS.length}
                </Text>
                <Text style={[styles.mapStatLbl, { fontFamily: typography.fontFamily.regular, fontSize: 9.5 }]}>
                  Regions
                </Text>
              </View>
            </View>
          </View>

          {/* Map + legend */}
          <IndiaMapSvg mapWidth={MAP_WIDTH} />

          <View style={{ height: 4 }} />
        </View>

        {/* Section intro */}
        <View style={[styles.intro, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="location-outline" size={15} color={colors.primary} />
          <Text style={[styles.introText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            Tap any state to discover live stores, trending products, and local deals near you.
          </Text>
        </View>

        {/* Region groups */}
        {REGION_GROUPS.map(group => (
          <RegionSection
            key={group.key}
            group={group}
            primary={colors.primary}
            onPress={handleStatePress}
          />
        ))}

        {/* Bottom padding */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 16,
    paddingVertical:   12,
    gap:               12,
  },
  headerIcon: {
    width:          40,
    height:         40,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    marginBottom: 1,
  },
  headerSub: {
    lineHeight: 15,
  },
  countBadge: {
    width:          44,
    height:         44,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  countText:  { color: "#fff" },
  countLabel: { color: "rgba(255,255,255,0.80)" },

  // Map card
  mapCard: {
    marginHorizontal: 16,
    marginTop:        14,
    borderRadius:     16,
    paddingHorizontal: 16,
    paddingTop:        16,
    paddingBottom:     12,
    alignItems:       "center",
    gap:              14,
  },
  mapCardHeader: {
    width:          "100%",
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
  },
  mapCardTitle: {
    color: "#fff",
  },
  mapStatRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:            10,
  },
  mapStat: {
    alignItems: "center",
  },
  mapStatNum: {
    color: "#fff",
  },
  mapStatLbl: {
    color: "rgba(255,255,255,0.70)",
  },
  mapStatDivider: {
    width:           1,
    height:          24,
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  // Intro
  intro: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               8,
    marginHorizontal:  16,
    marginTop:         14,
    marginBottom:      20,
    padding:           12,
    borderRadius:      10,
    borderWidth:       1,
  },
  introText: {
    flex:       1,
    lineHeight: 18,
  },

  // Content
  content: {
    paddingTop: 0,
  },
});
