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
import { useRouter } from "expo-router";
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
import NearbyStoresFeed                    from "../../components/home/stores/NearbyStoresFeed";
import WholesaleStoresFeed                 from "../../components/home/stores/WholesaleStoresFeed";
import B2CStoresFeed                       from "../../components/home/stores/B2CStoresFeed";
import ServiceStoresFeed                   from "../../components/home/stores/ServiceStoresFeed";
import { CATEGORY_FEEDS }                  from "../../data/categoryFeedData";
import GroceryFeed                         from "../../components/home/grocery/GroceryFeed";

export default function HomeScreen() {
  const { colors, setCategoryPrimary } = useTheme();
  const router                         = useRouter();

  // Products mode state
  const [search,   setSearch]   = useState("");
  const [mode,     setMode]     = useState<DiscoveryMode>("products");
  const [category, setCategory] = useState("all");

  function handleCategorySelect(key: string) {
    setCategory(key);
    const cat = CATEGORIES.find(c => c.key === key);
    // "all" or missing → restore brand color; otherwise apply category color
    setCategoryPrimary(
      !cat || cat.color === "primary" ? null : cat.color
    );
  }

  // Hero background: category color when one is active, else default dark navy
  const activeCategory = CATEGORIES.find(c => c.key === category);
  const heroBg = activeCategory && activeCategory.color !== "primary"
    ? activeCategory.color
    : HEADER_BG;

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
      <StatusBar barStyle="light-content" backgroundColor={heroBg} />

      {/* ── Dark navy hero ── */}
      <SafeAreaView style={[styles.hero, { backgroundColor: heroBg }]} edges={["top"]}>

        <HomeHeader
          location={MOCK_LOCATION}
          storesLive={STORES_LIVE_COUNT}
          onLocationPress={() => Alert.alert("Change Location", "Area selector coming soon.")}
          onStoreLivePress={() => router.push("/store-live")}
        />

        <HomeSearchBar
          value={search}
          onChangeText={setSearch}
          mode={mode}
          onMenuPress={() => setDrawerOpen(true)}
          onMicPress={()    => Alert.alert("Voice",         "Voice search coming soon.")}
          onBellPress={()   => Alert.alert("Notifications", "Notifications coming soon.")}
          onScanPress={()   => router.push("/scanner")}
          onLocatePress={() => Alert.alert("Locate",        "GPS locate coming soon.")}
        />

        <DiscoveryToggle mode={mode} onChange={setMode} />

        {/* Products → CategoryScroll | Stores → StoreDiscoveryTabs */}
        {mode === "products" ? (
          <CategoryScroll
            categories={CATEGORIES}
            activeKey={category}
            onSelect={handleCategorySelect}
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
        {/* Sticky: filter bar — stores (except map_view) or blank spacer */}
        {mode === "stores" && storeTab !== "map_view" ? (
          <StoreFilterBar
            filters={filters}
            onFilterChange={setFilters}
            onFilterPress={() => Alert.alert("Filter", "Filter sheet coming soon.")}
            onSortPress={()   => Alert.alert("Sort",   "Sort options coming soon.")}
          />
        ) : (
          <View />
        )}

        {/* Products feed — "All Items" */}
        {mode === "products" && category === "all" && (
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

        {/* Products feed — Grocery (custom layout) */}
        {mode === "products" && category === "grocery" && (
          <GroceryFeed />
        )}

        {/* Products feed — specific category (generic layout) */}
        {mode === "products" && category !== "all" && category !== "grocery" && CATEGORY_FEEDS[category] && (
          <>
            <BannerCarousel
              banners={CATEGORY_FEEDS[category].banners}
              onPress={b => Alert.alert(b.title, b.subtitle)}
            />
            <TrendingSection
              city={MOCK_LOCATION.area}
              items={CATEGORY_FEEDS[category].items}
              title={CATEGORY_FEEDS[category].sectionTitle}
              icon={CATEGORY_FEEDS[category].sectionIcon}
              onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
            />
          </>
        )}


        {/* Stores feed — Nearby tab */}
        {mode === "stores" && storeTab === "nearby" && (
          <NearbyStoresFeed />
        )}

        {/* Stores feed — Wholesale tab */}
        {mode === "stores" && storeTab === "wholesale" && (
          <WholesaleStoresFeed />
        )}

        {/* Stores feed — B2C tab */}
        {mode === "stores" && storeTab === "b2c" && (
          <B2CStoresFeed />
        )}

        {/* Stores feed — Service Based tab */}
        {mode === "stores" && storeTab === "service_based" && (
          <ServiceStoresFeed />
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
