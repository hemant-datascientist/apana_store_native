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
  View, Text, ScrollView, FlatList, StyleSheet, StatusBar, Alert,
  ActivityIndicator, ListRenderItemInfo,
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
import { STORE_TYPES } from "../../data/categoryData";
import { useApcBrowser, ApcBrowseGroup } from "../../hooks/useApcBrowser";
import ApcCategorySection from "../../components/tabs/category/ApcCategorySection";
import HomeHeader      from "../../components/tabs/home/HomeHeader";
import HomeSearchBar   from "../../components/tabs/home/HomeSearchBar";
import DiscoveryToggle from "../../components/tabs/home/DiscoveryToggle";
import CategorySection from "../../components/tabs/category/CategorySection";
import StoreTypeGrid   from "../../components/tabs/category/StoreTypeGrid";
import ApcBrowseBanner from "../../components/apc/ApcBrowseBanner";
import MenuDrawer      from "../../components/tabs/home/MenuDrawer";
import { handleMenuSelect } from "../../lib/menuNav";
import { useLocation } from "../../context/LocationContext";
import { useStoreLiveStats } from "../../hooks/useStoreLiveStats";

// Presentation-only accents, rotated per department (APC carries no colours).
const SECTION_ACCENTS = ["#0F4C81", "#E8862E", "#15803D", "#7C3AED", "#B45309", "#0E7490"];

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

  // The browser is driven by the §27 APC classification itself (departments +
  // classes read from the live taxonomy), so it can never drift from the canvas.
  const { groups, loading: apcLoading } = useApcBrowser();

  // One section per department, windowed through a FlatList so only the
  // on-screen departments mount.
  const renderGroup = useCallback(
    ({ item: group, index }: ListRenderItemInfo<ApcBrowseGroup>) => (
      <ApcCategorySection
        group={group}
        accent={SECTION_ACCENTS[index % SECTION_ACCENTS.length]}
        onPress={(code) => router.push(`/(apc)/${code}` as any)}
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
          data={groups}
          keyExtractor={group => group.code}
          renderItem={renderGroup}
          ListHeaderComponent={ApcBrowseBanner}
          ListEmptyComponent={
            <View style={styles.state}>
              {apcLoading
                ? <ActivityIndicator color={colors.primary} />
                : <Text style={{ color: colors.subText, textAlign: "center" }}>
                    Couldn't load the product classification. Pull to retry.
                  </Text>}
            </View>
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
  state:   { paddingVertical: 60, paddingHorizontal: 32, alignItems: "center" },
});
