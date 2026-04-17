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
import BannerCarousel   from "../BannerCarousel";
import GroceryCategoryGrid from "./GroceryCategoryGrid";
import GroceryProductGrid  from "./GroceryProductGrid";
import {
  GROCERY_SUB_CATEGORIES,
  GROCERY_SECTIONS,
  GrocerySubCategory,
} from "../../../../data/groceryData";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";

export default function GroceryFeed() {
  function handleSubCategory(cat: GrocerySubCategory) {
    Alert.alert(cat.label, `${cat.label} product list coming soon.`);
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

      {/* Product sections: Regular Items + Seasonal */}
      {GROCERY_SECTIONS.map(section => (
        <GroceryProductGrid key={section.key} section={section} />
      ))}

      <View style={{ height: 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {},
});
