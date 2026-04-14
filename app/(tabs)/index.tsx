// ============================================================
// HOME SCREEN — Apana Store (Customer App)
//
// Layout (top → bottom):
//   Dark navy hero  — HomeHeader + HomeSearchBar + DiscoveryToggle
//   Themed feed     — CategoryScroll (icon pills)
//                   → BannerCarousel (auto-scroll promo)
//                   → TrendingSection ("Trending in Pune")
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
  BANNERS,
  TRENDING_ITEMS,
  HEADER_BG,
  DiscoveryMode,
} from "../../data/homeData";
import HomeHeader      from "../../components/home/HomeHeader";
import HomeSearchBar   from "../../components/home/HomeSearchBar";
import DiscoveryToggle from "../../components/home/DiscoveryToggle";
import CategoryScroll  from "../../components/home/CategoryScroll";
import BannerCarousel  from "../../components/home/BannerCarousel";
import TrendingSection from "../../components/home/TrendingSection";

export default function HomeScreen() {
  const { colors } = useTheme();

  const [search,   setSearch]   = useState("");
  const [mode,     setMode]     = useState<DiscoveryMode>("products");
  const [category, setCategory] = useState("all");

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_BG} />

      {/* ── Dark navy hero ── */}
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
          onMenuPress={()   => Alert.alert("Menu",          "Drawer coming soon.")}
          onMicPress={()    => Alert.alert("Voice",         "Voice search coming soon.")}
          onBellPress={()   => Alert.alert("Notifications", "Notifications coming soon.")}
          onScanPress={()   => Alert.alert("Scanner",       "Barcode scanner coming soon.")}
          onLocatePress={() => Alert.alert("Locate",        "GPS locate coming soon.")}
        />

        <DiscoveryToggle mode={mode} onChange={setMode} />

      </SafeAreaView>

      {/* ── Themed feed ── */}
      <ScrollView
        style={[styles.feed, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Sticky category scroll — index 0 */}
        <CategoryScroll
          categories={CATEGORIES}
          activeKey={category}
          onSelect={setCategory}
        />

        {/* Banners */}
        <BannerCarousel
          banners={BANNERS}
          onPress={b => Alert.alert(b.title, b.subtitle)}
        />

        {/* Trending in Pune */}
        <TrendingSection
          city={MOCK_LOCATION.area}
          items={TRENDING_ITEMS}
          onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
        />

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1 },
  hero:        {},
  feed:        { flex: 1 },
  feedContent: { paddingBottom: 32 },
});
