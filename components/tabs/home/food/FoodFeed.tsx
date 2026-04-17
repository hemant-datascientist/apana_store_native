// ============================================================
// FOOD FEED — Apana Store (Home, Products > Food & Drink)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../../data/homeData";

const ACCENT = "#6F4C81";

const SUB_CATS: SubCat[] = [
  { key: "restaurants",label: "Restaurants",      icon: "restaurant-outline",      bg: "#FFEDD5" },
  { key: "cafes",      label: "Cafes",            icon: "cafe-outline",            bg: "#FEF3C7" },
  { key: "snacks",     label: "Snacks",           icon: "fast-food-outline",       bg: "#FEE2E2" },
  { key: "sweets",     label: "Sweets & Mithai",  icon: "gift-outline",            bg: "#FCE7F3" },
  { key: "beverages",  label: "Beverages",        icon: "wine-outline",            bg: "#DBEAFE" },
  { key: "bakery",     label: "Bakery",           icon: "storefront-outline",      bg: "#FEF3C7" },
  { key: "street",     label: "Street Food",      icon: "cart-outline",            bg: "#FFEDD5" },
  { key: "biryani",    label: "Biryani",          icon: "flame-outline",           bg: "#DCFCE7" },
  { key: "juice",      label: "Juice Bars",       icon: "nutrition-outline",       bg: "#ECFDF5" },
  { key: "icecream",   label: "Ice Cream",        icon: "ice-cream-outline",       bg: "#FCE7F3" },
  { key: "healthy",    label: "Healthy Food",     icon: "leaf-outline",            bg: "#DCFCE7" },
  { key: "party",      label: "Party Orders",     icon: "people-outline",          bg: "#EDE9FE" },
];

export default function FoodFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.food.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <TrendingSection
        city={MOCK_LOCATION.area}
        items={CATEGORY_FEEDS.food.items}
        title={CATEGORY_FEEDS.food.sectionTitle}
        icon={CATEGORY_FEEDS.food.sectionIcon}
        onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
      />
    </View>
  );
}
