// ============================================================
// CATEGORY SCREEN — Apana Store (Customer App)
//
// Same dark navy hero as Home (header + search + toggle),
// no CategoryScroll. Below the hero: full category browser —
// each CategorySection shows a group title + 3-col sub-grid.
//
// Data: GET /customer/categories — replace mocks from categoryData.ts
// ============================================================

import React, { useState } from "react";
import { View, ScrollView, StyleSheet, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../theme/useTheme";
import {
  MOCK_LOCATION,
  STORES_LIVE_COUNT,
  HEADER_BG,
  DiscoveryMode,
} from "../../data/homeData";
import { CATEGORY_GROUPS } from "../../data/categoryData";
import HomeHeader      from "../../components/home/HomeHeader";
import HomeSearchBar   from "../../components/home/HomeSearchBar";
import DiscoveryToggle from "../../components/home/DiscoveryToggle";
import CategorySection from "../../components/category/CategorySection";

export default function CategoryScreen() {
  const { colors } = useTheme();

  const [search, setSearch] = useState("");
  const [mode,   setMode]   = useState<DiscoveryMode>("products");

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

      {/* ── Category browser ── */}
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {CATEGORY_GROUPS.map(group => (
          <CategorySection
            key={group.key}
            group={group}
            onPress={(_groupKey, subKey) =>
              Alert.alert(
                group.title,
                `"${group.subs.find(s => s.key === subKey)?.label}" coming soon.`
              )
            }
          />
        ))}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1 },
  hero:    {},
  scroll:  { flex: 1 },
  content: { paddingVertical: 12, paddingBottom: 32 },
});
