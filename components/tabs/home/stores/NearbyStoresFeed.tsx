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
import { View, Text, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { typography } from "../../../../theme/typography";
import useTheme from "../../../../theme/useTheme";
import {
  buildHeroStores,
  NearbyStore,
  HeroStore,
} from "../../../../data/nearbyStoresData";
import { useLocation } from "../../../../context/LocationContext";
import { useStoreBucket } from "../../../../hooks/useStoreBucket";
import { toCardData } from "../../../../services/storeBucketService";
import NearbyHeroBanner from "./NearbyHeroBanner";
import StoreListCard from "./StoreListCard";

export default function NearbyStoresFeed() {
  const { colors } = useTheme();
  const router = useRouter();
  const { selectedAddress, deviceCoords } = useLocation();

  // REAL shops in the customer's k-ring. This rendered a bundled array before,
  // so the tab showed the same four invented stores to everyone, everywhere —
  // including in cities where Apana has no sellers at all.
  //
  // Prefer the DEVICE fix over the saved address: "near you" means where the
  // person is standing, not where they last chose to have something delivered.
  // Falls back to the address pin when GPS is unavailable.
  const lat = deviceCoords?.lat ?? selectedAddress.lat ?? null;
  const lng = deviceCoords?.lng ?? selectedAddress.lng ?? null;
  const coords = lat != null && lng != null ? { lat, lng } : null;

  const { stores: liveStores, loading, error, isEmpty } = useStoreBucket("local", coords);
  // The server already sorted by distance; toCardData only reshapes.
  const nearbyStores = useMemo(
    () => liveStores.map(toCardData).map((s) => ({ ...s, distanceKm: s.distanceKm ?? 0, isLive: true })),
    [liveStores],
  );
  const heroStores = useMemo(
    () => buildHeroStores(nearbyStores.map((s) => ({ ...s, city: s.city ?? "" }))),
    [nearbyStores],
  );

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
          {loading ? "…" : `${nearbyStores.length} found`}
        </Text>
      </View>

      {loading && <ActivityIndicator color={colors.primary} style={{ marginVertical: 24 }} />}
      {error && (
        <Text style={[styles.emptyText, { color: colors.danger, fontFamily: typography.fontFamily.regular }]}>
          {error}
        </Text>
      )}
      {/* Two DIFFERENT empty states. "No pin" is the customer's to fix; "no
          shops" is ours. Showing one message for both sends people looking in
          the wrong place. */}
      {!loading && !error && !coords && (
        <Text style={[styles.emptyText, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
          Set your location to see shops near you.
        </Text>
      )}
      {isEmpty && coords && (
        <Text style={[styles.emptyText, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
          No Apana shops near you yet.
        </Text>
      )}

      {/* Store list — nearest first */}
      {nearbyStores.map(({ city: _city, ...store }) => (
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

  emptyText: {
    textAlign:  "center",
    fontSize:   13,
    lineHeight: 20,
    marginVertical: 24,
    paddingHorizontal: 24,
  },

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
