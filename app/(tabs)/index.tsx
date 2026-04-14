// ============================================================
// HOME SCREEN — Apana Store (Customer App)
//
// Products mode:
//   Hero  — HomeHeader + HomeSearchBar + DiscoveryToggle + CategoryScroll
//   Feed  — BannerCarousel → TrendingSection
//
// Stores mode:
//   Hero  — HomeHeader + HomeSearchBar + DiscoveryToggle + StoreDiscoveryTabs
//   Feed  — StoreFilterBar → (stores feed coming soon)
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
import HomeHeader          from "../../components/home/HomeHeader";
import HomeSearchBar       from "../../components/home/HomeSearchBar";
import DiscoveryToggle     from "../../components/home/DiscoveryToggle";
import CategoryScroll      from "../../components/home/CategoryScroll";
import BannerCarousel      from "../../components/home/BannerCarousel";
import TrendingSection     from "../../components/home/TrendingSection";
import StoreDiscoveryTabs, { StoreTab } from "../../components/home/StoreDiscoveryTabs";
import StoreFilterBar,     { StoreFilters } from "../../components/home/StoreFilterBar";
import MenuDrawer                           from "../../components/home/MenuDrawer";

export default function HomeScreen() {
  const { colors } = useTheme();

  // Products mode state
  const [search,   setSearch]   = useState("");
  const [mode,     setMode]     = useState<DiscoveryMode>("products");
  const [category, setCategory] = useState("all");

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Stores mode state
  const [storeTab, setStoreTab] = useState<StoreTab>("nearby");
  const [filters,  setFilters]  = useState<StoreFilters>({
    nearest:  true,
    liveOnly: true,
    topRated: false,
  });

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
          onMenuPress={() => setDrawerOpen(true)}
          onMicPress={()    => Alert.alert("Voice",         "Voice search coming soon.")}
          onBellPress={()   => Alert.alert("Notifications", "Notifications coming soon.")}
          onScanPress={()   => Alert.alert("Scanner",       "Barcode scanner coming soon.")}
          onLocatePress={() => Alert.alert("Locate",        "GPS locate coming soon.")}
        />

        <DiscoveryToggle mode={mode} onChange={setMode} />

        {/* Products → CategoryScroll | Stores → StoreDiscoveryTabs */}
        {mode === "products" ? (
          <CategoryScroll
            categories={CATEGORIES}
            activeKey={category}
            onSelect={setCategory}
          />
        ) : (
          <StoreDiscoveryTabs
            activeTab={storeTab}
            onChange={setStoreTab}
          />
        )}

      </SafeAreaView>

      {/* ── Menu drawer ── */}
      <MenuDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelect={key => Alert.alert("Menu", `"${key}" coming soon.`)}
      />

      {/* ── Themed feed ── */}
      <ScrollView
        style={[styles.feed, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Sticky: filter bar (stores) or blank spacer (products) */}
        {mode === "stores" ? (
          <StoreFilterBar
            filters={filters}
            onFilterChange={setFilters}
            onFilterPress={() => Alert.alert("Filter", "Filter sheet coming soon.")}
            onSortPress={()   => Alert.alert("Sort",   "Sort options coming soon.")}
          />
        ) : (
          <View />
        )}

        {/* Products feed */}
        {mode === "products" && (
          <>
            <BannerCarousel
              banners={BANNERS}
              onPress={b => Alert.alert(b.title, b.subtitle)}
            />
            <TrendingSection
              city={MOCK_LOCATION.area}
              items={TRENDING_ITEMS}
              onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
            />
          </>
        )}

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
