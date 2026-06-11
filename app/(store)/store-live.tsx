// ============================================================
// STORE LIVE SCREEN — Apana Store (Customer App)
//
// Accessible by tapping "Stores Live – 410" in HomeHeader (all-India) or a
// state's live badge (state scope). Data comes from useStoreLiveStats —
// mock-bundled today, GET /stores/live-stats when the BE lands; this screen
// renders the same StoreLiveStats either way.
//
// Sections:
//   1. Live count chip + "Updated Xm ago" snapshot time
//   2. DonutChart       — store distribution pie
//   3. HorizontalBars   — percentage bar list
//   4. StoreTable       — Live | Close Now data table
// States: first-load spinner · error + retry (stale data stays visible if
// a poll fails) · pull-to-refresh.
// ============================================================

import React from "react";
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar,
  ActivityIndicator, RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { useStoreLiveStats } from "../../hooks/useStoreLiveStats";
import DonutChart    from "../../components/store-live/DonutChart";
import HorizontalBars from "../../components/store-live/HorizontalBars";
import StoreTable    from "../../components/store-live/StoreTable";
import { formatCount } from "../../utils/formatUtils";

// Snapshot age — "Just now / Xm ago / Xh ago"
function asOfLabel(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.max(0, Math.floor((Date.now() - then) / 60000));
  if (mins < 1) return "Updated just now";
  if (mins < 60) return `Updated ${mins}m ago`;
  return `Updated ${Math.floor(mins / 60)}h ago`;
}

export default function StoreLiveScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { stateKey, stateName, storesLive } = useLocalSearchParams<{
    stateKey?: string; stateName?: string; storesLive?: string;
  }>();

  const isStateSpecific = !!stateName;
  const { stats, isLoading, isError, refetch } = useStoreLiveStats({
    stateKey,
    stateName,
    mockStateTotal: storesLive ? parseInt(storesLive, 10) : undefined,
  });

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    // refetch resolves through the hook's state; brief visual ack is enough
    setTimeout(() => setRefreshing(false), 600);
  }, [refetch]);

  const scopeLabel = isStateSpecific ? `${stateName} Stores Live` : "All India Stores Live";

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
          {isStateSpecific ? `${stateName} Store Live` : "All India Store Live"}
        </Text>

        <TouchableOpacity onPress={refetch} style={styles.headerBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="refresh-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* ── First load ── */}
      {isLoading && !stats && (
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.stateText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
            Loading live store data…
          </Text>
        </View>
      )}

      {/* ── Error with nothing to show ── */}
      {isError && !stats && !isLoading && (
        <View style={styles.centerWrap}>
          <Ionicons name="cloud-offline-outline" size={44} color={colors.subText} />
          <Text style={[styles.stateText, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md }]}>
            Couldn't load live data
          </Text>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            onPress={refetch}
            activeOpacity={0.85}
          >
            <Text style={[styles.retryText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Content ── */}
      {stats && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
        >

          {/* Stale-data banner — poll failed but last snapshot still shown */}
          {isError && (
            <TouchableOpacity
              style={[styles.staleBanner, { backgroundColor: colors.card, borderColor: colors.warning }]}
              onPress={refetch}
              activeOpacity={0.8}
            >
              <Ionicons name="warning-outline" size={14} color={colors.warning} />
              <Text style={[styles.staleText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                Live update failed — showing last data. Tap to retry.
              </Text>
            </TouchableOpacity>
          )}

          {/* Live count chip */}
          <View style={[styles.liveChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.liveDot} />
            <Text style={[styles.liveText, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
              {scopeLabel} – {formatCount(stats.totalLive)}
            </Text>
          </View>

          {/* Snapshot time */}
          <Text style={[styles.asOf, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {asOfLabel(stats.asOf)}
          </Text>

          {/* Donut chart */}
          <DonutChart data={stats.breakdown} totalLive={stats.totalLive} />

          {/* Section label */}
          <Text style={[styles.sectionLabel, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            DISTRIBUTION BY STORE TYPE
          </Text>

          {/* Horizontal bars */}
          <HorizontalBars data={stats.breakdown} totalLive={stats.totalLive} />

          {/* Section label */}
          <Text style={[styles.sectionLabel, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs, marginTop: 20 }]}>
            LIVE vs CLOSED
          </Text>

          {/* Data table */}
          <StoreTable data={stats.breakdown} totalLive={stats.totalLive} />

        </ScrollView>
      )}
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

  // Loading / error states
  centerWrap: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
    gap:            12,
    paddingHorizontal: 32,
  },
  stateText: { textAlign: "center" },
  retryBtn: {
    paddingHorizontal: 28,
    paddingVertical:   10,
    borderRadius:      22,
    marginTop:         4,
  },
  retryText: { color: "#fff" },

  // Stale banner
  staleBanner: {
    flexDirection:    "row",
    alignItems:       "center",
    gap:               8,
    marginHorizontal: 16,
    marginBottom:     12,
    paddingHorizontal: 12,
    paddingVertical:    8,
    borderRadius:      10,
    borderWidth:        1,
  },
  staleText: { flex: 1 },

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

  // Snapshot timestamp
  asOf: {
    alignSelf:    "center",
    marginBottom: 4,
  },

  // Section labels
  sectionLabel: {
    letterSpacing:    0.8,
    paddingHorizontal: 16,
    marginBottom:      10,
    marginTop:         16,
  },
});
