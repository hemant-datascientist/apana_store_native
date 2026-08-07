// ============================================================
// WHOLESALE STORES FEED — Apana Store (Home, Stores Wholesale)
//
// Rendered when mode === "stores" && storeTab === "wholesale".
//
// Layout:
//   WholesaleHeroBanner — promo ad carousel
//   Section label       — "Wholesale Near You"
//   StoreListCard × N   — list (no LIVE badge for wholesale)
// ============================================================

import React, { useMemo } from "react";
import { View, Text, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { typography } from "../../../../theme/typography";
import useTheme from "../../../../theme/useTheme";
import {
  WHOLESALE_PROMOS,
  WholesalePromo,
} from "../../../../data/wholesaleStoresData";
import { useStoreBucket } from "../../../../hooks/useStoreBucket";
import { toCardData } from "../../../../services/storeBucketService";
import { buildHeroStores, sortByDistance, BannerableStore, HeroStore } from "../../../../lib/storeBanner";
import { getStoreById } from "../../../../data/storeDetailData";
import WholesaleHeroBanner from "./WholesaleHeroBanner";
import NearbyHeroBanner    from "./NearbyHeroBanner";
import StoreListCard       from "./StoreListCard";

export default function WholesaleStoresFeed() {
  const { colors } = useTheme();
  const router = useRouter();

  // Same store banner as Nearby: top-4 of this tab's list (nearest-first
  // by listed distance), city + why-shown pill. Colour/icon cards until
  // wholesale stores carry photos.
  // REAL wholesale sellers (ASC-WHL-* / channel b2b). This read a bundled mock
  // list before, so the tab showed shops that exist nowhere and cannot be
  // ordered from. Not proximity-scoped: a wholesaler serves a region, so there
  // is no pin to rank by.
  const { stores: liveStores, loading, error, isEmpty } = useStoreBucket("wholesale");
  const cards = useMemo(() => liveStores.map(toCardData), [liveStores]);

  const heroStores = useMemo(
    () => buildHeroStores(sortByDistance(
      cards.map((s): BannerableStore => ({ ...s, distanceKm: s.distanceKm ?? 0, city: s.city ?? "" })),
      null,
    )),
    [cards],
  );

  function handleHeroPress(store: HeroStore) {
    router.push(`/store-detail?id=${store.id}`);
  }

  function handlePromoPress(promo: WholesalePromo) {
    Alert.alert(promo.brandName, "Wholesale offer page coming soon.");
  }

  function handleDirection(store: { id: string; name: string }) {
    Alert.alert("Direction", `Getting directions to ${store.name} — coming soon.`);
  }

  function handleStorePress(store: { id: string; name: string }) {
    router.push(`/store-detail?id=${store.id}`);
  }

  function handleViewItems(store: { id: string; name: string }) {
    router.push(`/store-categories?id=${store.id}`);
  }

  return (
    <View style={styles.root}>

      {/* Promo banner */}
      <WholesaleHeroBanner promos={WHOLESALE_PROMOS} onPress={handlePromoPress} />

      {/* Store banner — nearest top picks (shared with Nearby) */}
      <NearbyHeroBanner stores={heroStores} onPress={handleHeroPress} />

      {/* Section label */}
      <View style={styles.sectionRow}>
        <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.base }]}>
          Wholesale Near You
        </Text>
        <Text style={[styles.sectionCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {loading ? "…" : `${cards.length} found`}
        </Text>
      </View>

      {/* Honest states: a dead backend must not look like "no wholesalers here",
          and an empty bucket must not be filled with placeholders (§19.8). */}
      {loading && <ActivityIndicator color={colors.primary} style={{ marginVertical: 24 }} />}
      {error && (
        <Text style={[styles.emptyText, { color: colors.danger, fontFamily: typography.fontFamily.regular }]}>
          {error}
        </Text>
      )}
      {isEmpty && (
        <Text style={[styles.emptyText, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
          No wholesale stores here yet.
        </Text>
      )}

      {/* Store list — wholesale stores have no LIVE badge */}
      {cards.map(({ city: _city, ...store }) => (
        <StoreListCard
          key={store.id}
          store={{ ...store, distanceKm: store.distanceKm ?? 0, isLive: false }}
          onPress={() => handleStorePress(store)}
          onDirection={() => handleDirection(store)}
          onViewItems={() => handleViewItems(store)}
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
  emptyText: {
    textAlign:  "center",
    fontSize:   13,
    lineHeight: 20,
    marginVertical: 24,
    paddingHorizontal: 24,
  },
});
