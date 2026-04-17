// ============================================================
// NEARBY STORES FEED — Apana Store (Home Screen, Stores Mode)
//
// Rendered inside the main ScrollView when:
//   mode === "stores" && storeTab === "nearby"
//
// Layout:
//   NearbyHeroBanner  — full-width store photo carousel
//   Section label     — "Stores Near You"
//   StoreListCard × N — vertical list
// ============================================================

import React from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { typography } from "../../../../theme/typography";
import useTheme from "../../../../theme/useTheme";
import { HERO_STORES, NEARBY_STORES, NearbyStore, HeroStore } from "../../../../data/nearbyStoresData";
import NearbyHeroBanner from "./NearbyHeroBanner";
import StoreListCard    from "./StoreListCard";

export default function NearbyStoresFeed() {
  const { colors } = useTheme();
  const router     = useRouter();

  function handleHeroPress(store: HeroStore) {
    router.push(`/store-detail?id=${store.id}`);
  }

  function handleDirection(store: NearbyStore) {
    Alert.alert("Direction", `Getting directions to ${store.name} — coming soon.`);
  }

  function handleViewItems(store: NearbyStore) {
    router.push(`/store-detail?id=${store.id}`);
  }

  return (
    <View style={styles.root}>

      {/* Hero banner carousel */}
      <NearbyHeroBanner stores={HERO_STORES} onPress={handleHeroPress} />

      {/* Section label */}
      <View style={styles.sectionRow}>
        <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.base }]}>
          Stores Near You
        </Text>
        <Text style={[styles.sectionCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {NEARBY_STORES.length} found
        </Text>
      </View>

      {/* Store list */}
      {NEARBY_STORES.map(store => (
        <StoreListCard
          key={store.id}
          store={store}
          onDirection={handleDirection}
          onViewItems={handleViewItems}
        />
      ))}

      <View style={{ height: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {},

  sectionRow: {
    flexDirection:     "row",
    alignItems:        "baseline",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    marginTop:          16,
    marginBottom:       10,
  },
  sectionLabel: {},
  sectionCount: {},
});
