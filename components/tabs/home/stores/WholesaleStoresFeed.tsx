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

import React from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { typography } from "../../../../theme/typography";
import useTheme from "../../../../theme/useTheme";
import {
  WHOLESALE_PROMOS, WHOLESALE_STORES,
  WholesalePromo, WholesaleStore,
} from "../../../../data/wholesaleStoresData";
import WholesaleHeroBanner from "./WholesaleHeroBanner";
import StoreListCard       from "./StoreListCard";

export default function WholesaleStoresFeed() {
  const { colors } = useTheme();

  function handlePromoPress(promo: WholesalePromo) {
    Alert.alert(promo.brandName, "Wholesale offer page coming soon.");
  }

  function handleDirection(store: WholesaleStore) {
    Alert.alert("Direction", `Getting directions to ${store.name} — coming soon.`);
  }

  function handleViewItems(store: WholesaleStore) {
    Alert.alert(store.name, "Bulk catalogue coming soon.");
  }

  return (
    <View style={styles.root}>

      {/* Promo banner */}
      <WholesaleHeroBanner promos={WHOLESALE_PROMOS} onPress={handlePromoPress} />

      {/* Section label */}
      <View style={styles.sectionRow}>
        <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.base }]}>
          Wholesale Near You
        </Text>
        <Text style={[styles.sectionCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {WHOLESALE_STORES.length} found
        </Text>
      </View>

      {/* Store list — wholesale stores have no LIVE badge */}
      {WHOLESALE_STORES.map(store => (
        <StoreListCard
          key={store.id}
          store={{ ...store, isLive: false }}
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
});
