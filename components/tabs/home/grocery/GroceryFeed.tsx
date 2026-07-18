// ============================================================
// GROCERY FEED — Apana Store (Home, Products > Grocery)
//
// Complete grocery category screen:
//   BannerCarousel (grocery-specific promos)
//   GroceryCategoryGrid (12 sub-categories)
//   GroceryProductGrid × N (Regular Items, Seasonal, etc.)
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
import { apcForTile } from "../../../../data/categoryApcMap";

export default function GroceryFeed() {
  const router = useRouter();

  // Same bridge as the Category tab: a mapped tile opens its APC class; anything
  // unmapped falls back to search (which shows the APC category strip).
  function handleSubCategory(cat: GrocerySubCategory) {
    const code = apcForTile(cat.key);
    if (code) {
      router.push(`/(apc)/${code}` as never);
      return;
    }
    router.push(`/search-results?q=${encodeURIComponent(cat.label)}` as never);
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
