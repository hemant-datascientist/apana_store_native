// ============================================================
// BHARAT SCREEN — Apana Store (Customer App) — COMING SOON
//
// Parked on purpose (founder, 2026-10-15): Bharat will become the place to
// discover GI-tagged products from every state of India, once there is a team
// to curate them. Until then the launch focus is Home, Category, Cart and
// Profile — so this tab says plainly that it is coming, instead of showing a
// state grid whose stores and counts mostly aren't there yet.
//
// The full state browser is kept for that day: components/tabs/bharat/*,
// app/(store)/state-detail.tsx, data/bharatData.ts, hooks/useStateLiveCounts.
// Restoring it = bring back the previous version of this file from git
// (before 2026-10-15).
// ============================================================

import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import IndiaMapSvg from "../../components/tabs/bharat/IndiaMapSvg";
import RegionSection from "../../components/tabs/bharat/RegionSection";
import { REGION_GROUPS } from "../../data/bharatData";
import MenuDrawer from "../../components/tabs/home/MenuDrawer";
import { handleMenuSelect } from "../../lib/menuNav";

const { width: SW } = Dimensions.get("window");
const MAP_WIDTH = Math.round(SW * 0.55);

export default function BharatScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />

      <MenuDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelect={key => handleMenuSelect(router, key)}
      />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={[styles.headerIcon, { backgroundColor: colors.primary + "18" }]}
            onPress={() => setDrawerOpen(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
          >
            <Ionicons name="menu-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Bharat</Text>
          <View style={styles.headerIcon} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
        <View style={[styles.mapCard, { backgroundColor: colors.primary }]}>
          <IndiaMapSvg mapWidth={MAP_WIDTH} />
        </View>

        <View style={[styles.soonPill, { backgroundColor: colors.primary + "18" }]}>
          <Text style={[styles.soonText, { color: colors.primary }]}>COMING SOON</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          The best of every state, in one place
        </Text>
        <Text style={[styles.copy, { color: colors.subText }]}>
          Bharat will bring you GI-tagged products — the crafts, foods and textiles each state of India
          is known for — straight from the people who make them.
        </Text>
        <Text style={[styles.copy, { color: colors.subText }]}>
          For now, we are starting with the shops near you.
        </Text>

        <TouchableOpacity
          style={[styles.cta, { backgroundColor: colors.primary }]}
          onPress={() => router.navigate("/(tabs)")}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Ionicons name="storefront-outline" size={18} color={colors.white} />
          <Text style={[styles.ctaText, { color: colors.white }]}>Shop near you</Text>
        </TouchableOpacity>
        </View>

        {/* A preview of what Bharat will cover: every state and UT, by region.
            Shapes and names only — no store counts, nothing to tap yet. */}
        <Text style={[styles.previewTitle, { color: colors.text }]}>Every state, coming to Bharat</Text>
        {REGION_GROUPS.map((g) => (
          <RegionSection key={g.key} group={g} primary={colors.primary} preview />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { borderBottomWidth: 1 },
  headerContent: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 10,
  },
  headerIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg },
  scroll: { paddingBottom: 120 },
  body: { padding: 20, alignItems: "center", gap: 14 },
  previewTitle: {
    fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg,
    paddingHorizontal: 16, marginTop: 8, marginBottom: 12,
  },
  mapCard: { borderRadius: 20, paddingVertical: 20, width: "100%", alignItems: "center" },
  soonPill: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginTop: 6 },
  soonText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs, letterSpacing: 1 },
  title: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl, textAlign: "center" },
  copy: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, textAlign: "center", lineHeight: 21 },
  cta: {
    flexDirection: "row", alignItems: "center", gap: 8,
    borderRadius: 14, paddingHorizontal: 22, paddingVertical: 13, marginTop: 8,
  },
  ctaText: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md },
});
