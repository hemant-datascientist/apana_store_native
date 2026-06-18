// ============================================================
// SERVICE STORES FEED — Apana Store (Home, Stores Service Based tab)
//
// Rendered when mode === "stores" && storeTab === "servicebased".
//
// Layout:
//   ServiceHeroBanner — auto-scrolling promo carousel
//   "Services Near You" — section label with count
//   ServiceStoreCard × N — service provider list
// ============================================================

import React, { useMemo } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../../theme/typography";
import useTheme from "../../../../theme/useTheme";
import { SERVICE_PROMOS, SERVICE_STORES, ServicePromo, ServiceStore } from "../../../../data/serviceStoresData";
import { buildHeroStores, sortByDistance, BannerableStore, HeroStore } from "../../../../lib/storeBanner";
import { getStoreById } from "../../../../data/storeDetailData";
import ServiceHeroBanner from "./ServiceHeroBanner";
import NearbyHeroBanner  from "./NearbyHeroBanner";
import ServiceStoreCard  from "./ServiceStoreCard";

import { useRouter } from "expo-router";

export default function ServiceStoresFeed() {
  const { colors } = useTheme();
  const router = useRouter();

  // Same store banner as Nearby: top-4 providers, city + why-shown pill.
  // Service stores have no category list, so the cards show name + rating.
  const heroStores = useMemo(
    () => buildHeroStores(sortByDistance(
      SERVICE_STORES.map((s): BannerableStore => ({
        id: s.id, name: s.name, rating: s.rating, distanceKm: s.distanceKm,
        categories: [], icon: s.icon, bgColor: s.bgColor,
        city: getStoreById(s.id).city,
      })),
      null,
    )),
    [],
  );

  function handleHeroPress(store: HeroStore) {
    router.push(`/service-detail?id=${store.id}`);
  }

  function handlePromoPress(promo: ServicePromo) {
    Alert.alert(promo.headline, "Service category page coming soon.");
  }

  function handleCall(store: ServiceStore) {
    Alert.alert("Call Now", `Calling ${store.name} at ${store.phone}`);
  }

  function handleDirection(store: ServiceStore) {
    Alert.alert("Direction", `Directions to ${store.name} — coming soon.`);
  }

  function handleViewInfo(store: ServiceStore) {
    router.push(`/service-detail?id=${store.id}`);
  }

  return (
    <View style={styles.root}>

      {/* Promo banner */}
      <ServiceHeroBanner promos={SERVICE_PROMOS} onPress={handlePromoPress} />

      {/* Store banner — nearest top picks (shared with Nearby) */}
      <NearbyHeroBanner stores={heroStores} onPress={handleHeroPress} />

      {/* Section label */}
      <View style={styles.sectionRow}>
        <View style={styles.sectionLeft}>
          <Ionicons name="location-outline" size={16} color={colors.primary} />
          <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.base }]}>
            Services Near You
          </Text>
        </View>
        <Text style={[styles.sectionCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {SERVICE_STORES.length} providers
        </Text>
      </View>

      {/* Service store list */}
      {SERVICE_STORES.map(store => (
        <ServiceStoreCard
          key={store.id}
          store={store}
          onCall={handleCall}
          onDirection={handleDirection}
          onViewInfo={handleViewInfo}
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
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    marginTop:          16,
    marginBottom:       10,
  },
  sectionLeft: {
    flexDirection: "row",
    alignItems:    "center",
    gap:            6,
  },
  sectionLabel: {},
  sectionCount: {},
});
