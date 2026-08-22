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
  View, Text, FlatList, ScrollView, StyleSheet, StatusBar, Alert,
  ActivityIndicator, ListRenderItemInfo,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter }    from "expo-router";
import useTheme from "../../theme/useTheme";
import {
  STORES_LIVE_COUNT,
  HEADER_BG,
  DiscoveryMode,
} from "../../data/homeData";
import { useApcBrowser, ApcBrowseGroup } from "../../hooks/useApcBrowser";
import ApcDeptGrid from "../../components/tabs/category/ApcDeptGrid";
import { useAscBrowser, AscBrowseGroup } from "../../hooks/useAscBrowser";
import AscCategorySection from "../../components/tabs/category/AscCategorySection";
import HomeHeader      from "../../components/tabs/home/HomeHeader";
import HomeSearchBar   from "../../components/tabs/home/HomeSearchBar";
import DiscoveryToggle from "../../components/tabs/home/DiscoveryToggle";
import CategorySection from "../../components/tabs/category/CategorySection";
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

  // Level-1 nested browser: tap a DEPARTMENT → its classes (Level 2). A
  // single-class department (Beverages, Fashion…) skips straight to products so
  // the seller/customer never sees a "Beverages → Beverages" repeat.
  const handleDept = useCallback(
    (group: ApcBrowseGroup) => {
      if (group.classes.length === 1) {
        router.push(`/category-products?code=${encodeURIComponent(group.classes[0].code)}` as any);
      } else {
        router.push(`/apc-classes?code=${encodeURIComponent(group.code)}&title=${encodeURIComponent(group.title)}` as any);
      }
    },
    [router],
  );

  // Stores mode is driven by the §16 ASC taxonomy the same way.
  const { groups: ascGroups, loading: ascLoading } = useAscBrowser();

  const renderAscGroup = useCallback(
    ({ item: group, index }: ListRenderItemInfo<AscBrowseGroup>) => (
      <AscCategorySection
        group={group}
        accent={SECTION_ACCENTS[index % SECTION_ACCENTS.length]}
        onPress={(code) => router.push(`/store-type?code=${encodeURIComponent(code)}` as any)}
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
          location={{ area: selectedAddress.city, state: selectedAddress.state, pincode: selectedAddress.pincode }}
          storesLive={storesLiveCount}
          // Real: the location screen already exists and is the one place a
          // location can be set. It used to open an Alert saying an area
          // selector was "coming soon" — while /(auth)/location-access was
          // sitting there doing exactly that job.
          onLocationPress={() => router.push("/(auth)/location-access")}
        />

        <HomeSearchBar
          value={search}
          onChangeText={setSearch}
          onSubmit={q => q.trim() && router.push(`/search-results?q=${encodeURIComponent(q.trim())}` as any)}
          mode={mode}
          onMenuPress={()   => setDrawerOpen(true)}
          onBellPress={() => router.push("/notifications")}
          onScanPress={() => router.push("/scanner")}
          // Same destination — that screen has the GPS button.
          onLocatePress={() => router.push("/(auth)/location-access")}
        />

        <DiscoveryToggle mode={mode} onChange={setMode} />

      </SafeAreaView>

      {/* ── Category browser ── */}
      {mode === "stores" ? (
        /* Stores mode — the §16 ASC taxonomy: 5 classes, 106 store types */
        <FlatList
          style={[styles.scroll, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.content}
          data={ascGroups}
          keyExtractor={g => g.cls.id}
          renderItem={renderAscGroup}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          windowSize={5}
          ListEmptyComponent={
            <View style={styles.state}>
              {ascLoading
                ? <ActivityIndicator color={colors.primary} />
                : <Text style={{ color: colors.subText, textAlign: "center" }}>
                    Couldn't load the store classification. Pull to retry.
                  </Text>}
            </View>
          }
        />
      ) : (
        /* Products mode — Level 1: the department grid (nested browser). */
        <ScrollView
          style={[styles.scroll, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ApcBrowseBanner />
          {groups.length === 0 ? (
            <View style={styles.state}>
              {apcLoading
                ? <ActivityIndicator color={colors.primary} />
                : <Text style={{ color: colors.subText, textAlign: "center" }}>
                    Couldn't load the product classification. Pull to retry.
                  </Text>}
            </View>
          ) : (
            <ApcDeptGrid groups={groups} onSelect={handleDept} />
          )}
        </ScrollView>
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
