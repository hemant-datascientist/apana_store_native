// ============================================================
// B2C STORES FEED — Apana Store (Home, Stores B2C tab)
//
// Rendered when mode === "stores" && storeTab === "b2c".
//
// Layout:
//   B2CHeroBanner  — FMCG category promo carousel
//   "Most Popular" — section label
//   B2CStoreCard × N — manufacturer/brand list
// ============================================================

import React, { useMemo } from "react";
import { openDirections } from "../../../../lib/openDirections";
import { View, Text, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../../theme/typography";
import useTheme from "../../../../theme/useTheme";
import { B2C_PROMOS, B2CPromo, B2CStore } from "../../../../data/b2cStoresData";
import { useStoreBucket } from "../../../../hooks/useStoreBucket";
import { toCardData, type StoreCardData } from "../../../../services/storeBucketService";

// The B2C card carries brand chrome (logo letters, website flag) the API does
// not return. Derived here rather than invented: the initials come from the
// real name, and `website` is false because we genuinely do not know one.
function toB2CCard(s: StoreCardData): B2CStore {
  return {
    id: s.id, name: s.name,
    category: s.type, categoryColor: s.typeColor, categoryBg: s.typeBg,
    rating: s.rating, reviews: s.reviews, distanceKm: s.distanceKm ?? 0,
    website: false,
    tags: s.categories,
    description: "",
    logoColor: s.bgColor,
    logoText: s.name.split(/\s+/).slice(0, 2).map(w => w[0] ?? "").join("").toUpperCase() || "A",
    logoTextColor: s.typeColor,
    icon: s.icon,
  };
}
import { buildHeroStores, sortByDistance, BannerableStore, HeroStore } from "../../../../lib/storeBanner";
import B2CHeroBanner from "./B2CHeroBanner";
import NearbyHeroBanner from "./NearbyHeroBanner";
import B2CStoreCard  from "./B2CStoreCard";

export default function B2CStoresFeed() {
  const { colors } = useTheme();
  const router = useRouter();

  // Same store banner as Nearby: top-4 brands, city + why-shown pill.
  // B2C carries its categories as `tags` and brand colour as `logoColor`.
  // REAL brand-direct sellers: the `brand_direct` bucket = manufacturers
  // (ASC-FAC-*) plus retail sellers who declared own_brand / franchise.
  //
  // ⚠ NOT the backend's `channel: "b2c"`. That channel covers all 83 retail
  // types INCLUDING every kirana, so using it here would fill this tab with
  // exactly the neighbourhood shops it exists to separate out.
  //
  // Not proximity-scoped: a manufacturer ships from wherever it ships from.
  const { stores: liveStores, loading, error, isEmpty } = useStoreBucket("brand_direct");
  const cards = useMemo(() => liveStores.map(toCardData), [liveStores]);

  const heroStores = useMemo(
    () => buildHeroStores(sortByDistance(
      cards.map((s): BannerableStore => ({
        id: s.id, name: s.name, rating: s.rating, distanceKm: s.distanceKm ?? 0,
        categories: s.categories, icon: s.icon, bgColor: s.bgColor,
        city: s.city ?? "",
      })),
      null,
    )),
    [cards],
  );

  function handleHeroPress(store: HeroStore) {
    router.push(`/store-detail?id=${store.id}`);
  }

  function handlePromoPress(promo: B2CPromo) {
    Alert.alert(promo.headline, "This is a category banner — browse the brand-direct sellers listed below it.");
  }

  // Real Mappls navigation. openDirections says so honestly when the shop
  // never set a pin — it does NOT fall back to a city centre.
  function handleDirection(store: B2CStore) {
    void openDirections(store.lat, store.lng, store.name);
  }

  function handleStorePress(store: B2CStore) {
    router.push(`/store-detail?id=${store.id}`);
  }

  function handleViewItems(store: B2CStore) {
    router.push(`/store-categories?id=${store.id}`);
  }

  function handleWebsite(store: B2CStore) {
    Alert.alert(store.name, "Apana doesn't hold a website for this seller.");
  }

  return (
    <View style={styles.root}>

      {/* Promo banner */}
      <B2CHeroBanner promos={B2C_PROMOS} onPress={handlePromoPress} />

      {/* Store banner — nearest top picks (shared with Nearby) */}
      <NearbyHeroBanner stores={heroStores} onPress={handleHeroPress} />

      {/* Section label */}
      <View style={styles.sectionRow}>
        <View style={styles.sectionLeft}>
          <Ionicons name="flame-outline" size={16} color="#E11D48" />
          <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.base }]}>
            Most Popular
          </Text>
        </View>
        <Text style={[styles.sectionCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {loading ? "…" : `${cards.length} brands`}
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
          No brands or manufacturers listed yet.
        </Text>
      )}

      {/* Brand list */}
      {cards.map(store => (
        <B2CStoreCard
          key={store.id}
          store={toB2CCard(store)}
          onPress={handleStorePress}
          onDirection={handleDirection}
          onViewItems={handleViewItems}
          onWebsite={handleWebsite}
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
