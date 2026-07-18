// ============================================================
// HARDWARE FEED — Apana Store (Home, Products > Hardware)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import CategoryLiveProducts from "../live/CategoryLiveProducts";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";

const ACCENT = "#374151";

const SUB_CATS: SubCat[] = [
  { key: "paints",     label: "Paints",           icon: "color-fill-outline",      bg: "#FEE2E2", imageUrl: require("../../../../assets/images/category/products/home_hw_paints.webp") },
  { key: "electrical", label: "Electrical",       icon: "flash-outline",           bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_hw_electrical.webp") },
  { key: "plumbing",   label: "Plumbing",         icon: "water-outline",           bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_hw_plumbing.webp") },
  { key: "powertools", label: "Power Tools",      icon: "construct-outline",       bg: "#F3F4F6", imageUrl: require("../../../../assets/images/category/products/home_hw_powertools.webp") },
  { key: "handtools",  label: "Hand Tools",       icon: "hammer-outline",          bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_hw_handtools.webp") },
  { key: "safety",     label: "Safety Gear",      icon: "shield-outline",          bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_hw_safety.webp") },
  { key: "building",   label: "Cement & Building",icon: "layers-outline",          bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_hw_building.webp") },
  { key: "tiles",      label: "Tiles & Flooring", icon: "grid-outline",            bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_hw_tiles.webp") },
  { key: "glass",      label: "Glass & Aluminium",icon: "square-outline",          bg: "#E0F2FE", imageUrl: require("../../../../assets/images/category/products/home_hw_glass.webp") },
  { key: "sanitary",   label: "Sanitary Ware",    icon: "water-outline",           bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_hw_sanitary.webp") },
  { key: "adhesives",  label: "Adhesives",        icon: "link-outline",            bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_hw_adhesives.webp") },
  { key: "gardening",  label: "Gardening Tools",  icon: "leaf-outline",            bg: "#ECFDF5", imageUrl: require("../../../../assets/images/category/products/home_hw_gardening.webp") },
];

export default function HardwareFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.hardware.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <CategoryLiveProducts categoryKey="hardware" accentColor={ACCENT} />
    </View>
  );
}
