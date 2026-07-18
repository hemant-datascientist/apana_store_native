// ============================================================
// ICE CREAM FEED — Apana Store (Home, Products > Ice Cream)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import CategoryLiveProducts from "../live/CategoryLiveProducts";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";

const ACCENT = "#803E96";

const SUB_CATS: SubCat[] = [
  { key: "cones",      label: "Cones",            icon: "ice-cream-outline",       bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_ice_cones.webp") },
  { key: "cups",       label: "Cups & Tubs",      icon: "cafe-outline",            bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_ice_cups.webp") },
  { key: "kulfi",      label: "Kulfi",            icon: "flame-outline",           bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_ice_kulfi.webp") },
  { key: "stick",      label: "Stick Ice Cream",  icon: "remove-outline",          bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_ice_stick.webp") },
  { key: "family",     label: "Family Pack",      icon: "people-outline",          bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_ice_family.webp") },
  { key: "party",      label: "Party Pack",       icon: "gift-outline",            bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_ice_party.webp") },
  { key: "waffles",    label: "Waffles",          icon: "grid-outline",            bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_ice_waffles.webp") },
  { key: "sundaes",    label: "Sundaes",          icon: "ice-cream-outline",       bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_ice_sundaes.webp") },
  { key: "gelato",     label: "Gelato",           icon: "sparkles-outline",        bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_ice_gelato.webp") },
  { key: "yogurt",     label: "Frozen Yogurt",    icon: "leaf-outline",            bg: "#ECFDF5", imageUrl: require("../../../../assets/images/category/products/home_ice_yogurt.webp") },
  { key: "sorbet",     label: "Sorbet",           icon: "nutrition-outline",       bg: "#FEE2E2", imageUrl: require("../../../../assets/images/category/products/home_ice_sorbet.webp") },
  { key: "cakes",      label: "Ice Cream Cakes",  icon: "gift-outline",            bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_ice_cakes.webp") },
];

export default function IceCreamFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.icecream.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} apc="APC-01-DAI" />
      <CategoryLiveProducts categoryKey="icecream" accentColor={ACCENT} />
    </View>
  );
}
