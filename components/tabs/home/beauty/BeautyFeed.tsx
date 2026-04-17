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
  { key: "skincare",   label: "Skincare",         icon: "sparkles-outline",        bg: "#FCE7F3" },
  { key: "haircare",   label: "Hair Care",        icon: "cut-outline",             bg: "#EDE9FE" },
  { key: "makeup",     label: "Makeup",           icon: "color-palette-outline",   bg: "#FCE7F3" },
  { key: "fragrances", label: "Fragrances",       icon: "flower-outline",          bg: "#F3E8FF" },
  { key: "nailcare",   label: "Nail Care",        icon: "hand-left-outline",       bg: "#FEE2E2" },
  { key: "grooming",   label: "Grooming",         icon: "person-outline",          bg: "#DBEAFE" },
  { key: "sunscreen",  label: "Sunscreen",        icon: "sunny-outline",           bg: "#FEF3C7" },
  { key: "facewash",   label: "Face Wash",        icon: "water-outline",           bg: "#DCFCE7" },
  { key: "moisturizer",label: "Moisturizer",      icon: "leaf-outline",            bg: "#ECFDF5" },
  { key: "lipcare",    label: "Lip Care",         icon: "heart-outline",           bg: "#FCE7F3" },
  { key: "eyecare",    label: "Eye Care",         icon: "eye-outline",             bg: "#EDE9FE" },
  { key: "bodycare",   label: "Body Care",        icon: "body-outline",            bg: "#FFEDD5" },
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
