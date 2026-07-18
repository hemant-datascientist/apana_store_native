// ============================================================
// CATEGORY SCREEN — Apana Store (Customer App)
//
// Same dark navy hero as Home (header + search + toggle),
// no CategoryScroll. Below the hero: full category browser —
// each CategorySection shows a group title + 3-col sub-grid.
//
// Data: GET /customer/categories — replace mocks from categoryData.ts
// ============================================================

import React, { useState, useCallback } from "react";
import {
  View, ScrollView, FlatList, StyleSheet, StatusBar, Alert,
  ListRenderItemInfo,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter }    from "expo-router";
import useTheme from "../../theme/useTheme";
import {
  MOCK_LOCATION,
  STORES_LIVE_COUNT,
  HEADER_BG,
  DiscoveryMode,
} from "../../data/homeData";
import { CATEGORY_GROUPS, STORE_TYPES, CategoryGroup } from "../../data/categoryData";
import { apcForTile } from "../../data/categoryApcMap";
import HomeHeader      from "../../components/tabs/home/HomeHeader";
import HomeSearchBar   from "../../components/tabs/home/HomeSearchBar";
import DiscoveryToggle from "../../components/tabs/home/DiscoveryToggle";
import CategorySection from "../../components/tabs/category/CategorySection";
import StoreTypeGrid   from "../../components/tabs/category/StoreTypeGrid";
import ApcBrowseBanner from "../../components/apc/ApcBrowseBanner";
import CategoryLiveProducts from "../../components/tabs/home/live/CategoryLiveProducts";
import MenuDrawer      from "../../components/tabs/home/MenuDrawer";
import { handleMenuSelect } from "../../lib/menuNav";
import { useLocation } from "../../context/LocationContext";
import { useStoreLiveStats } from "../../hooks/useStoreLiveStats";

export default function CategoryScreen() {
  const { colors } = useTheme();
  const router     = useRouter();

  const [search,     setSearch]     = useState("");
  const [mode,       setMode]       = useState<DiscoveryMode>("products");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Live store count for the header badge — same city scope as home.
  const { selectedAddress } = useLocation();
  const liveStats = useStoreLiveStats({
    city: selectedAddress.city,
    mockStateTotal: STORES_LIVE_COUNT,
  });
  const storesLiveCount = liveStats.stats?.totalLive ?? null;

  // One section per group. Rendered through a FlatList so only the on-screen
  // groups mount — the grid holds 308 tiles / 279 images, and mounting them
  // all at once (old ScrollView) thrashed decode + memory and stalled scroll.
  // Windowing keeps ~3-4 groups (≈ 30-48 images) live at any time.
  const renderGroup = useCallback(
    ({ item: group }: ListRenderItemInfo<CategoryGroup>) => (
      <CategorySection
        group={group}
        onPress={(_groupKey, subKey) => {
          // Merchandising tile -> real §27 classification. A mapped tile opens
          // its APC class directly; an unmapped one (store-type tiles, a handful
          // of niche ones) falls back to search, which surfaces the APC category
          // strip — so a tap is never a dead end.
          const code = apcForTile(subKey);
          if (code) {
            router.push(`/(apc)/${code}` as any);
            return;
          }
          const label = group.subs.find(s => s.key === subKey)?.label ?? "";
          router.push(`/search-results?q=${encodeURIComponent(label)}` as any);
        }}
      />
    ),
    [router],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_BG} />

      {/* ── Menu drawer (Modal — doesn't affect layout) ── */}
      <MenuDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelect={key => handleMenuSelect(router, key)}
      />

      {/* ── Dark navy hero ── */}
      <SafeAreaView style={[styles.hero, { backgroundColor: HEADER_BG }]} edges={["top"]}>

        <HomeHeader
          location={MOCK_LOCATION}
          storesLive={storesLiveCount}
          onLocationPress={() => Alert.alert("Change Location", "Area selector coming soon.")}
        />

        <HomeSearchBar
          value={search}
          onChangeText={setSearch}
          onSubmit={q => q.trim() && router.push(`/search-results?q=${encodeURIComponent(q.trim())}` as any)}
          mode={mode}
          onMenuPress={()   => setDrawerOpen(true)}
          onMicPress={()    => Alert.alert("Voice",         "Voice search coming soon.")}
          onBellPress={() => router.push("/notifications")}
          onScanPress={() => router.push("/scanner")}
          onLocatePress={() => Alert.alert("Locate",        "GPS locate coming soon.")}
        />

        <DiscoveryToggle mode={mode} onChange={setMode} />

      </SafeAreaView>

      {/* ── Category browser ── */}
      {mode === "stores" ? (
        /* Stores mode — small list, non-virtualized ScrollView is fine */
        <ScrollView
          style={[styles.scroll, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <StoreTypeGrid
            stores={STORE_TYPES}
            onPress={item => Alert.alert(item.label, `${item.sub} — coming soon.`)}
          />
        </ScrollView>
      ) : (
        /* Products mode — APC banner header, then virtualized group sections */
        <FlatList
          style={[styles.scroll, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.content}
          data={CATEGORY_GROUPS}
          keyExtractor={group => group.key}
          renderItem={renderGroup}
          ListHeaderComponent={
            <>
              <ApcBrowseBanner />
              {/* Real seller inventory (same as the home feed) */}
              <CategoryLiveProducts categoryKey="all" title="Fresh from local shops" icon="storefront-outline" />
            </>
          }
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={5}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1 },
  hero:    {},
  scroll:  { flex: 1 },
  content: { paddingVertical: 12, paddingBottom: 32 },
});
