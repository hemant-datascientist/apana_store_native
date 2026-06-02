// ============================================================
// BEAUTY FEED — Apana Store (Home, Products > Beauty)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../../data/homeData";

const ACCENT = "#402A62";

const SUB_CATS: SubCat[] = [
  { key: "skincare",   label: "Skincare",         icon: "sparkles-outline",        bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_skincare.png") },
  { key: "haircare",   label: "Hair Care",        icon: "cut-outline",             bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_haircare.png") },
  { key: "makeup",     label: "Makeup",           icon: "color-palette-outline",   bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_makeup.png") },
  { key: "fragrances", label: "Fragrances",       icon: "flower-outline",          bg: "#F3E8FF", imageUrl: require("../../../../assets/images/category/products/home_fragrances.png") },
  { key: "nailcare",   label: "Nail Care",        icon: "hand-left-outline",       bg: "#FEE2E2", imageUrl: require("../../../../assets/images/category/products/home_nailcare.png") },
  { key: "grooming",   label: "Grooming",         icon: "person-outline",          bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_grooming.png") },
  { key: "sunscreen",  label: "Sunscreen",        icon: "sunny-outline",           bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_sunscreen.png") },
  { key: "facewash",   label: "Face Wash",        icon: "water-outline",           bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_facewash.png") },
  { key: "moisturizer",label: "Moisturizer",      icon: "leaf-outline",            bg: "#ECFDF5", imageUrl: require("../../../../assets/images/category/products/home_moisturizer.png") },
  { key: "lipcare",    label: "Lip Care",         icon: "heart-outline",           bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_lipcare.png") },
  { key: "eyecare",    label: "Eye Care",         icon: "eye-outline",             bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_eyecare.png") },
  { key: "bodycare",   label: "Body Care",        icon: "body-outline",            bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_bodycare2.png") },
];

export default function BeautyFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.beauty.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <TrendingSection
        city={MOCK_LOCATION.area}
        items={CATEGORY_FEEDS.beauty.items}
        title={CATEGORY_FEEDS.beauty.sectionTitle}
        icon={CATEGORY_FEEDS.beauty.sectionIcon}
        onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
      />
    </View>
  );
}
