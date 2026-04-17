// ============================================================
// PHARMACY FEED — Apana Store (Home, Products > Pharmacy)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../../data/homeData";

const ACCENT = "#1D4746";

const SUB_CATS: SubCat[] = [
  { key: "medicines",  label: "Medicines",        icon: "medkit-outline",          bg: "#FEE2E2" },
  { key: "vitamins",   label: "Vitamins",         icon: "fitness-outline",         bg: "#DCFCE7" },
  { key: "devices",    label: "Health Devices",   icon: "heart-outline",           bg: "#DBEAFE" },
  { key: "babycare",   label: "Baby Care",        icon: "balloon-outline",         bg: "#FCE7F3" },
  { key: "diabetes",   label: "Diabetes Care",    icon: "analytics-outline",       bg: "#EDE9FE" },
  { key: "ayurvedic",  label: "Ayurvedic",        icon: "leaf-outline",            bg: "#ECFDF5" },
  { key: "skinhair",   label: "Skin & Hair",      icon: "sparkles-outline",        bg: "#FCE7F3" },
  { key: "pain",       label: "Pain Relief",      icon: "medical-outline",         bg: "#FEE2E2" },
  { key: "digestive",  label: "Digestive",        icon: "nutrition-outline",       bg: "#FEF3C7" },
  { key: "eyeear",     label: "Eye & Ear Care",   icon: "eye-outline",             bg: "#DBEAFE" },
  { key: "firstaid",   label: "First Aid",        icon: "add-circle-outline",      bg: "#DCFCE7" },
  { key: "surgical",   label: "Surgical",         icon: "cut-outline",             bg: "#F3F4F6" },
];

export default function PharmacyFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.pharmacy.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <TrendingSection
        city={MOCK_LOCATION.area}
        items={CATEGORY_FEEDS.pharmacy.items}
        title={CATEGORY_FEEDS.pharmacy.sectionTitle}
        icon={CATEGORY_FEEDS.pharmacy.sectionIcon}
        onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
      />
    </View>
  );
}
