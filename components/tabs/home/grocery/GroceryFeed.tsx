// ============================================================
// GROCERY FEED — Apana Store (Home, Products > Grocery)
//
// Grocery category screen:
//   BannerCarousel (grocery-specific promos)
//   GroceryCategoryGrid (12 APC-aligned grocery sub-categories)
//   CategoryLiveProducts (real seller grocery inventory)
// ============================================================

import React from "react";
import { View, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import BannerCarousel   from "../BannerCarousel";
import GroceryCategoryGrid from "./GroceryCategoryGrid";
import CategoryLiveProducts from "../live/CategoryLiveProducts";
import {
  GROCERY_SUB_CATEGORIES,
  GrocerySubCategory,
} from "../../../../data/groceryData";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";

export default function GroceryFeed() {
  const router = useRouter();

  // Each grocery tile carries its own APC class (§27) — open the classification
  // browser for it directly.
  function handleSubCategory(cat: GrocerySubCategory) {
    router.push(`/(apc)/${cat.apc}` as never);
  }

  return (
    <View style={styles.root}>

      {/* Grocery promo banners */}
      <BannerCarousel
        banners={CATEGORY_FEEDS.grocery.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />

      {/* Sub-category grid (Vegetables, Fruits, Dairy …) */}
      <GroceryCategoryGrid
        categories={GROCERY_SUB_CATEGORIES}
        onSelect={handleSubCategory}
      />

      {/* Real seller inventory for grocery (was mock product grids) */}
      <CategoryLiveProducts categoryKey="grocery" title="Available now" icon="basket-outline" />

      <View style={{ height: 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {},
});
