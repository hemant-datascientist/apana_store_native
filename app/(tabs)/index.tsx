// ============================================================
// HOME SCREEN — Apana Store (Customer App)
//
// Products mode:
//   Hero  — HomeHeader + HomeSearchBar + DiscoveryToggle + CategoryScroll
//   Feed  — dedicated <XxxFeed /> component per category
//
// Stores mode:
//   Hero  — HomeHeader + HomeSearchBar + DiscoveryToggle + StoreDiscoveryTabs
//   Feed  — StoreFilterBar → store-tab feed
//
// Each category has its own feed folder in components/home/<category>/
// Data: GET /customer/home — replace mocks from homeData.ts
// ============================================================

import React, { useState } from "react";
import {
  View, ScrollView, StyleSheet, StatusBar, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter }    from "expo-router";
import useTheme         from "../../theme/useTheme";
import {
  MOCK_LOCATION,
  STORES_LIVE_COUNT,
  CATEGORIES,
  HEADER_BG,
  DiscoveryMode,
} from "../../data/homeData";

// ── Hero components ──────────────────────────────────────────
import HomeHeader          from "../../components/home/HomeHeader";
import HomeSearchBar       from "../../components/home/HomeSearchBar";
import DiscoveryToggle     from "../../components/home/DiscoveryToggle";
import CategoryScroll      from "../../components/home/CategoryScroll";
import StoreDiscoveryTabs, { StoreTab }    from "../../components/home/StoreDiscoveryTabs";
import StoreFilterBar,     { StoreFilters } from "../../components/home/StoreFilterBar";
import MenuDrawer                          from "../../components/home/MenuDrawer";

// ── Product category feeds ───────────────────────────────────
import AllFeed        from "../../components/home/all/AllFeed";
import GroceryFeed    from "../../components/home/grocery/GroceryFeed";
import FashionFeed    from "../../components/home/fashion/FashionFeed";
import MobilesFeed    from "../../components/home/mobiles/MobilesFeed";
import ElectronicsFeed from "../../components/home/electronics/ElectronicsFeed";
import AppliancesFeed from "../../components/home/appliances/AppliancesFeed";
import BeautyFeed     from "../../components/home/beauty/BeautyFeed";
import SportsFeed     from "../../components/home/sports/SportsFeed";
import HomeFeed       from "../../components/home/home/HomeFeed";
import PharmacyFeed   from "../../components/home/pharmacy/PharmacyFeed";
import FoodFeed       from "../../components/home/food/FoodFeed";
import BooksFeed      from "../../components/home/books/BooksFeed";
import IceCreamFeed   from "../../components/home/icecream/IceCreamFeed";
import FurnitureFeed  from "../../components/home/furniture/FurnitureFeed";
import HardwareFeed   from "../../components/home/hardware/HardwareFeed";
import MiscFeed       from "../../components/home/misc/MiscFeed";

// ── Store feeds ──────────────────────────────────────────────
import NearbyStoresFeed    from "../../components/home/stores/NearbyStoresFeed";
import WholesaleStoresFeed from "../../components/home/stores/WholesaleStoresFeed";
import B2CStoresFeed       from "../../components/home/stores/B2CStoresFeed";
import ServiceStoresFeed   from "../../components/home/stores/ServiceStoresFeed";

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
    setCategoryPrimary(
      !cat || cat.color === "primary" ? null : cat.color
    );
  }

  // Hero background: category color when active, else dark navy
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

  // ── Category feed renderer ───────────────────────────────
  function renderCategoryFeed() {
    switch (category) {
      case "all":         return <AllFeed />;
      case "grocery":     return <GroceryFeed />;
      case "fashion":     return <FashionFeed />;
      case "mobiles":     return <MobilesFeed />;
      case "electronics": return <ElectronicsFeed />;
      case "appliances":  return <AppliancesFeed />;
      case "beauty":      return <BeautyFeed />;
      case "sports":      return <SportsFeed />;
      case "home":        return <HomeFeed />;
      case "pharmacy":    return <PharmacyFeed />;
      case "food":        return <FoodFeed />;
      case "books":       return <BooksFeed />;
      case "icecream":    return <IceCreamFeed />;
      case "furniture":   return <FurnitureFeed />;
      case "hardware":    return <HardwareFeed />;
      case "misc":        return <MiscFeed />;
      default:            return <AllFeed />;
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={heroBg} />

      {/* ── Dark hero ── */}
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

      {/* ── Feed ── */}
      <ScrollView
        style={[styles.feed, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Sticky filter bar — stores only (except map view) */}
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

        {/* Products feed — one component per category */}
        {mode === "products" && renderCategoryFeed()}

        {/* Store feeds */}
        {mode === "stores" && storeTab === "nearby"       && <NearbyStoresFeed />}
        {mode === "stores" && storeTab === "wholesale"    && <WholesaleStoresFeed />}
        {mode === "stores" && storeTab === "b2c"          && <B2CStoresFeed />}
        {mode === "stores" && storeTab === "service_based"&& <ServiceStoresFeed />}

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
