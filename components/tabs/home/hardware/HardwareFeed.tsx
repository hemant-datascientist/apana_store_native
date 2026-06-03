// ============================================================
// HARDWARE FEED — Apana Store (Home, Products > Hardware)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../../data/homeData";

const ACCENT = "#374151";

const SUB_CATS: SubCat[] = [
  { key: "paints",     label: "Paints",           icon: "color-fill-outline",      bg: "#FEE2E2", imageUrl: require("../../../../assets/images/category/products/home_hw_paints.png") },
  { key: "electrical", label: "Electrical",       icon: "flash-outline",           bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_hw_electrical.png") },
  { key: "plumbing",   label: "Plumbing",         icon: "water-outline",           bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_hw_plumbing.png") },
  { key: "powertools", label: "Power Tools",      icon: "construct-outline",       bg: "#F3F4F6", imageUrl: require("../../../../assets/images/category/products/home_hw_powertools.png") },
  { key: "handtools",  label: "Hand Tools",       icon: "hammer-outline",          bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_hw_handtools.png") },
  { key: "safety",     label: "Safety Gear",      icon: "shield-outline",          bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_hw_safety.png") },
  { key: "building",   label: "Cement & Building",icon: "layers-outline",          bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_hw_building.png") },
  { key: "tiles",      label: "Tiles & Flooring", icon: "grid-outline",            bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_hw_tiles.png") },
  { key: "glass",      label: "Glass & Aluminium",icon: "square-outline",          bg: "#E0F2FE", imageUrl: require("../../../../assets/images/category/products/home_hw_glass.png") },
  { key: "sanitary",   label: "Sanitary Ware",    icon: "water-outline",           bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_hw_sanitary.png") },
  { key: "adhesives",  label: "Adhesives",        icon: "link-outline",            bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_hw_adhesives.png") },
  { key: "gardening",  label: "Gardening Tools",  icon: "leaf-outline",            bg: "#ECFDF5", imageUrl: require("../../../../assets/images/category/products/home_hw_gardening.png") },
];

export default function HardwareFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.hardware.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <TrendingSection
        city={MOCK_LOCATION.area}
        items={CATEGORY_FEEDS.hardware.items}
        title={CATEGORY_FEEDS.hardware.sectionTitle}
        icon={CATEGORY_FEEDS.hardware.sectionIcon}
        onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
      />
    </View>
  );
}
