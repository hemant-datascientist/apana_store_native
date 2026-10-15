// ============================================================
// FOOD FEED — Apana Store (Home, Products > Food & Drink)
//
// Banners/promo carousel removed 2026-09 — parked until there's a real
// user base to justify one; see apana_doc/architecture/home_banners_promo_deferred.md.
// ============================================================

import React from "react";
import { View } from "react-native";
import CategoryLiveProducts from "../live/CategoryLiveProducts";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { assetImg } from "../../../../lib/assetImg";

const ACCENT = "#6F4C81";

const SUB_CATS: SubCat[] = [
  { key: "restaurants",label: "Restaurants", route: "/menu-stores",      icon: "restaurant-outline",      bg: "#FFEDD5", imageUrl: assetImg("category/products/home_food_restaurants.webp") },
  { key: "cafes",      label: "Cafes", route: "/menu-stores",            icon: "cafe-outline",            bg: "#FEF3C7", imageUrl: assetImg("category/products/home_food_cafes.webp") },
  { key: "snacks",     label: "Snacks", apc: "APC-01-CHIPSNAMKEEN",           icon: "fast-food-outline",       bg: "#FEE2E2", imageUrl: assetImg("category/products/home_food_snacks.webp") },
  { key: "sweets",     label: "Sweets & Mithai", apc: "APC-01-BARFIFUDGE",  icon: "gift-outline",            bg: "#FCE7F3", imageUrl: assetImg("category/products/home_food_sweets.webp") },
  { key: "beverages",  label: "Beverages", apc: "APC-02-CLD",        icon: "wine-outline",            bg: "#DBEAFE", imageUrl: assetImg("category/products/home_food_beverages.webp") },
  { key: "bakery",     label: "Bakery", apc: "APC-01-BKY",           icon: "storefront-outline",      bg: "#FEF3C7", imageUrl: assetImg("category/products/home_food_bakery.webp") },
  { key: "street",     label: "Street Food", route: "/menu-stores",      icon: "cart-outline",            bg: "#FFEDD5", imageUrl: assetImg("category/products/home_food_street.webp") },
  { key: "biryani",    label: "Biryani", route: "/menu-stores",          icon: "flame-outline",           bg: "#DCFCE7", imageUrl: assetImg("category/products/home_food_biryani.webp") },
  { key: "juice",      label: "Juice Bars", route: "/menu-stores",       icon: "nutrition-outline",       bg: "#ECFDF5", imageUrl: assetImg("category/products/home_food_juice.webp") },
  { key: "icecream",   label: "Ice Cream", apc: "APC-01-ICECREAMBARSCUPSCONES",        icon: "ice-cream-outline",       bg: "#FCE7F3", imageUrl: assetImg("category/products/home_food_icecream.webp") },
  { key: "healthy",    label: "Healthy Food", apc: "APC-01-PROTEINHEALTHBARS",     icon: "leaf-outline",            bg: "#DCFCE7", imageUrl: assetImg("category/products/home_food_healthy.webp") },
  { key: "party",      label: "Party Orders", route: "/menu-stores",     icon: "people-outline",          bg: "#EDE9FE", imageUrl: assetImg("category/products/home_food_party.webp") },
];

export default function FoodFeed() {
  return (
    <View>
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <CategoryLiveProducts categoryKey="food" accentColor={ACCENT} />
    </View>
  );
}
