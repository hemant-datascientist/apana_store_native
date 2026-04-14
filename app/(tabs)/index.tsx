// ============================================================
// HOME SCREEN — Apana Store (Customer App)
//
// Orchestrates the full home experience:
//   HomeHeader      — location + live stores count
//   HomeSearchBar   — hamburger + search pill + action icons
//   DiscoveryToggle — Products ↔ Stores mode switch
//   CategoryScroll  — horizontal category filter bar
//   [Feed]          — products or stores grid (coming soon)
//
// The top hero section (header through categories) always uses
// HEADER_BG (deep dark navy), regardless of light/dark theme.
// The feed below uses the app's standard background color.
//
// Data: GET /customer/home — replace mocks from homeData.ts
// ============================================================

import React, { useState } from "react";
import {
  View, ScrollView, StyleSheet, StatusBar, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../theme/useTheme";
import {
  MOCK_LOCATION,
  STORES_LIVE_COUNT,
  CATEGORIES,
  HEADER_BG,
  DiscoveryMode,
} from "../../data/homeData";
import HomeHeader      from "../../components/home/HomeHeader";
import HomeSearchBar   from "../../components/home/HomeSearchBar";
import DiscoveryToggle from "../../components/home/DiscoveryToggle";
import CategoryScroll  from "../../components/home/CategoryScroll";

export default function HomeScreen() {
  const { colors } = useTheme();

  const [search,   setSearch]   = useState("");
  const [mode,     setMode]     = useState<DiscoveryMode>("products");
  const [category, setCategory] = useState("all");

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_BG} />

      {/* ── Hero header (dark navy — always) ── */}
      <SafeAreaView style={[styles.hero, { backgroundColor: HEADER_BG }]} edges={["top"]}>

        <HomeHeader
          location={MOCK_LOCATION}
          storesLive={STORES_LIVE_COUNT}
          onLocationPress={() => Alert.alert("Change Location", "Area selector coming soon.")}
        />

        <HomeSearchBar
          value={search}
          onChangeText={setSearch}
          mode={mode}
          onMenuPress={()   => Alert.alert("Menu", "Drawer coming soon.")}
          onMicPress={()    => Alert.alert("Voice", "Voice search coming soon.")}
          onBellPress={()   => Alert.alert("Notifications", "Notifications coming soon.")}
          onScanPress={()   => Alert.alert("Scanner", "Barcode scanner coming soon.")}
          onLocatePress={() => Alert.alert("Locate", "GPS locate coming soon.")}
        />

        <DiscoveryToggle mode={mode} onChange={setMode} />

        <CategoryScroll
          categories={CATEGORIES}
          activeKey={category}
          onSelect={setCategory}
        />

      </SafeAreaView>

      {/* ── Feed area (themed background) ── */}
      <ScrollView
        style={[styles.feed, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Products / stores grid coming soon */}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: {
    // Dark navy hero — no flex: 1 so it wraps its content
  },
  feed:        { flex: 1 },
  feedContent: { paddingBottom: 120, paddingTop: 16, minHeight: 400 },
});
