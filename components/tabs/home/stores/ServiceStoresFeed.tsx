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
import { openDirections } from "../../../../lib/openDirections";
import { View, Text, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../../theme/typography";
import useTheme from "../../../../theme/useTheme";
import { SERVICE_PROMOS, ServicePromo, ServiceStore } from "../../../../data/serviceStoresData";
import { useStoreBucket } from "../../../../hooks/useStoreBucket";
import { toCardData, type StoreCardData } from "../../../../services/storeBucketService";

// The service card wants owner/contact chrome the API does not expose yet.
// Left EMPTY rather than invented — a fake phone number on a Call Now button is
// worse than a disabled one (§19.8).
function toServiceCard(s: StoreCardData): ServiceStore {
  return {
    id: s.id, name: s.name,
    type: s.type, typeColor: s.typeColor, typeBg: s.typeBg,
    rating: s.rating, reviews: s.reviews, distanceKm: s.distanceKm ?? 0,
    website: false,
    bgColor: s.bgColor, icon: s.icon,
    phone: "", ownerName: "", ownerPhoto: "", ownerMessage: "",
  };
}
import { buildHeroStores, sortByDistance, BannerableStore, HeroStore } from "../../../../lib/storeBanner";
import ServiceHeroBanner from "./ServiceHeroBanner";
import NearbyHeroBanner  from "./NearbyHeroBanner";
import ServiceStoreCard  from "./ServiceStoreCard";

import { useRouter } from "expo-router";

export default function ServiceStoresFeed() {
  const { colors } = useTheme();
  const router = useRouter();

  // Same store banner as Nearby: top-4 providers, city + why-shown pill.
  // Service stores have no category list, so the cards show name + rating.
  // REAL service providers — the ASvC side (ASC-SVC-*). Was a bundled mock, so
  // the tab listed salons and repair shops that exist nowhere and cannot be
  // booked.
  const { stores: liveStores, loading, error, isEmpty } = useStoreBucket("service");
  const cards = useMemo(() => liveStores.map(toCardData), [liveStores]);

  const heroStores = useMemo(
    () => buildHeroStores(sortByDistance(
      cards.map((s): BannerableStore => ({
        id: s.id, name: s.name, rating: s.rating, distanceKm: s.distanceKm ?? 0,
        categories: [], icon: s.icon, bgColor: s.bgColor,
        city: s.city ?? "",
      })),
      null,
    )),
    [cards],
  );

  function handleHeroPress(store: HeroStore) {
    router.push(`/service-store?id=${store.id}`);
  }

  function handlePromoPress(promo: ServicePromo) {
    Alert.alert(promo.headline, "This is a category banner — browse the service shops listed below it.");
  }

  // toServiceCard sets phone: "" — this feed's card data has never carried a
  // number, so the old Alert read "Calling <shop> at " with nothing after it.
  // The store detail screen holds the real number (getStoreMeta), so Call takes
  // you where calling actually works instead of faking it here.
  function handleCall(store: ServiceStore) {
    router.push(`/service-store?id=${store.id}`);
  }

  // Real Mappls navigation. openDirections says so honestly when the shop
  // never set a pin — it does NOT fall back to a city centre.
  function handleDirection(store: ServiceStore) {
    void openDirections(store.lat, store.lng, store.name);
  }

  function handleViewInfo(store: ServiceStore) {
    router.push(`/service-store?id=${store.id}`);
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
          {loading ? "…" : `${cards.length} providers`}
        </Text>
      </View>

      {loading && <ActivityIndicator color={colors.primary} style={{ marginVertical: 24 }} />}
      {error && (
        <Text style={[styles.emptyText, { color: colors.danger, fontFamily: typography.fontFamily.regular }]}>
          {error}
        </Text>
      )}
      {isEmpty && (
        <Text style={[styles.emptyText, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
          No service providers here yet.
        </Text>
      )}

      {/* Service store list */}
      {cards.map(store => (
        <ServiceStoreCard
          key={store.id}
          store={toServiceCard(store)}
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
  emptyText: {
    textAlign:  "center",
    fontSize:   13,
    lineHeight: 20,
    marginVertical: 24,
    paddingHorizontal: 24,
  },
});
