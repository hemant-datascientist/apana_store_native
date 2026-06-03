// ============================================================
// ICE CREAM FEED — Apana Store (Home, Products > Ice Cream)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../../data/homeData";

const ACCENT = "#803E96";

const SUB_CATS: SubCat[] = [
  { key: "cones",      label: "Cones",            icon: "ice-cream-outline",       bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_ice_cones.png") },
  { key: "cups",       label: "Cups & Tubs",      icon: "cafe-outline",            bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_ice_cups.png") },
  { key: "kulfi",      label: "Kulfi",            icon: "flame-outline",           bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_ice_kulfi.png") },
  { key: "stick",      label: "Stick Ice Cream",  icon: "remove-outline",          bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_ice_stick.png") },
  { key: "family",     label: "Family Pack",      icon: "people-outline",          bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_ice_family.png") },
  { key: "party",      label: "Party Pack",       icon: "gift-outline",            bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_ice_party.png") },
  { key: "waffles",    label: "Waffles",          icon: "grid-outline",            bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_ice_waffles.png") },
  { key: "sundaes",    label: "Sundaes",          icon: "ice-cream-outline",       bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_ice_sundaes.png") },
  { key: "gelato",     label: "Gelato",           icon: "sparkles-outline",        bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_ice_gelato.png") },
  { key: "yogurt",     label: "Frozen Yogurt",    icon: "leaf-outline",            bg: "#ECFDF5", imageUrl: require("../../../../assets/images/category/products/home_ice_yogurt.png") },
  { key: "sorbet",     label: "Sorbet",           icon: "nutrition-outline",       bg: "#FEE2E2", imageUrl: require("../../../../assets/images/category/products/home_ice_sorbet.png") },
  { key: "cakes",      label: "Ice Cream Cakes",  icon: "gift-outline",            bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_ice_cakes.png") },
];

export default function IceCreamFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.icecream.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <TrendingSection
        city={MOCK_LOCATION.area}
        items={CATEGORY_FEEDS.icecream.items}
        title={CATEGORY_FEEDS.icecream.sectionTitle}
        icon={CATEGORY_FEEDS.icecream.sectionIcon}
        onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
      />
    </View>
  );
}
