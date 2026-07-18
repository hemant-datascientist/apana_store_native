// ============================================================
// BEAUTY FEED — Apana Store (Home, Products > Beauty)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import CategoryLiveProducts from "../live/CategoryLiveProducts";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";

const ACCENT = "#402A62";

const SUB_CATS: SubCat[] = [
  { key: "skincare",   label: "Skincare",         icon: "sparkles-outline",        bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_skincare.webp") },
  { key: "haircare",   label: "Hair Care",        icon: "cut-outline",             bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_haircare.webp") },
  { key: "makeup",     label: "Makeup",           icon: "color-palette-outline",   bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_makeup.webp") },
  { key: "fragrances", label: "Fragrances",       icon: "flower-outline",          bg: "#F3E8FF", imageUrl: require("../../../../assets/images/category/products/home_fragrances.webp") },
  { key: "nailcare",   label: "Nail Care",        icon: "hand-left-outline",       bg: "#FEE2E2", imageUrl: require("../../../../assets/images/category/products/home_nailcare.webp") },
  { key: "grooming",   label: "Grooming",         icon: "person-outline",          bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_grooming.webp") },
  { key: "sunscreen",  label: "Sunscreen",        icon: "sunny-outline",           bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_sunscreen.webp") },
  { key: "facewash",   label: "Face Wash",        icon: "water-outline",           bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_facewash.webp") },
  { key: "moisturizer",label: "Moisturizer",      icon: "leaf-outline",            bg: "#ECFDF5", imageUrl: require("../../../../assets/images/category/products/home_moisturizer.webp") },
  { key: "lipcare",    label: "Lip Care",         icon: "heart-outline",           bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_lipcare.webp") },
  { key: "eyecare",    label: "Eye Care",         icon: "eye-outline",             bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_eyecare.webp") },
  { key: "bodycare",   label: "Body Care",        icon: "body-outline",            bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_bodycare2.webp") },
];

export default function BeautyFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.beauty.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <CategoryLiveProducts categoryKey="beauty" accentColor={ACCENT} />
    </View>
  );
}
