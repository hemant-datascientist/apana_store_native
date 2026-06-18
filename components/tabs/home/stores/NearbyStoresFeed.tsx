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

import React, { useMemo } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { typography } from "../../../../theme/typography";
import useTheme from "../../../../theme/useTheme";
import {
  selectNearbyStores,
  buildHeroStores,
  NearbyStore,
  HeroStore,
} from "../../../../data/nearbyStoresData";
import { useLocation } from "../../../../context/LocationContext";
import NearbyHeroBanner from "./NearbyHeroBanner";
import StoreListCard from "./StoreListCard";

export default function NearbyStoresFeed() {
  const { colors } = useTheme();
  const router = useRouter();
  const { selectedAddress } = useLocation();

  // Sort by real distance from the customer's active address when it has
  // GPS coords; the nearest 4 become the hero banner automatically.
  const lat = selectedAddress.lat ?? null;
  const lng = selectedAddress.lng ?? null;

  const nearbyStores = useMemo(
    () => selectNearbyStores(lat != null && lng != null ? { lat, lng } : null),
    [lat, lng],
  );
  const heroStores = useMemo(() => buildHeroStores(nearbyStores), [nearbyStores]);

  function handleHeroPress(store: HeroStore) {
    router.push(`/store-detail?id=${store.id}`);
  }

  function handleStorePress(store: NearbyStore) {
    router.push(`/store-detail?id=${store.id}`);
  }

  function handleDirection(store: NearbyStore) {
    Alert.alert("Direction", `Getting directions to ${store.name} — coming soon.`);
  }

  function handleViewItems(store: NearbyStore) {
    router.push(`/store-categories?id=${store.id}`);
  }

  return (
    <View style={styles.root}>

      {/* Hero banner carousel — the nearest 4 stores */}
      <NearbyHeroBanner stores={heroStores} onPress={handleHeroPress} />

      {/* Section label */}
      <View style={styles.sectionRow}>
        <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
          Stores Near You
        </Text>
        <Text style={[styles.sectionCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {nearbyStores.length} found
        </Text>
      </View>

      {/* Store list — nearest first */}
      {nearbyStores.map(store => (
        <StoreListCard
          key={store.id}
          store={store}
          onPress={handleStorePress}
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
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  sectionLabel: {},
  sectionCount: {},
});
