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

import React from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../../theme/typography";
import useTheme from "../../../../theme/useTheme";
import { B2C_PROMOS, B2C_STORES, B2CPromo, B2CStore } from "../../../../data/b2cStoresData";
import B2CHeroBanner from "./B2CHeroBanner";
import B2CStoreCard  from "./B2CStoreCard";

export default function B2CStoresFeed() {
  const { colors } = useTheme();
  const router = useRouter();

  function handlePromoPress(promo: B2CPromo) {
    Alert.alert(promo.headline, "Brand category page coming soon.");
  }

  function handleDirection(store: B2CStore) {
    Alert.alert("Direction", `Directions to ${store.name} — coming soon.`);
  }

  function handleStorePress(store: B2CStore) {
    router.push(`/store-detail?id=${store.id}`);
  }

  function handleViewItems(store: B2CStore) {
    router.push(`/store-categories?id=${store.id}`);
  }

  function handleWebsite(store: B2CStore) {
    Alert.alert(store.name, "Opening website — coming soon.");
  }

  return (
    <View style={styles.root}>

      {/* Promo banner */}
      <B2CHeroBanner promos={B2C_PROMOS} onPress={handlePromoPress} />

      {/* Section label */}
      <View style={styles.sectionRow}>
        <View style={styles.sectionLeft}>
          <Ionicons name="flame-outline" size={16} color="#E11D48" />
          <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.base }]}>
            Most Popular
          </Text>
        </View>
        <Text style={[styles.sectionCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {B2C_STORES.length} brands
        </Text>
      </View>

      {/* Brand list */}
      {B2C_STORES.map(store => (
        <B2CStoreCard
          key={store.id}
          store={store}
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
});
