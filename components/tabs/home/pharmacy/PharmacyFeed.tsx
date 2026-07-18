// ============================================================
// PHARMACY FEED — Apana Store (Home, Products > Pharmacy)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import CategoryLiveProducts from "../live/CategoryLiveProducts";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";

const ACCENT = "#1D4746";

const SUB_CATS: SubCat[] = [
  { key: "medicines",  label: "Medicines",        icon: "medkit-outline",          bg: "#FEE2E2", apc: "APC-06-MED", imageUrl: require("../../../../assets/images/category/products/home_medicines.webp") },
  { key: "vitamins",   label: "Vitamins",         icon: "fitness-outline",         bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_vitamins.webp") },
  { key: "devices",    label: "Health Devices",   icon: "heart-outline",           bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_devices.webp") },
  { key: "babycare",   label: "Baby Care",        icon: "balloon-outline",         bg: "#FCE7F3", apc: "APC-09-BABY", imageUrl: require("../../../../assets/images/category/products/home_ph_babycare.webp") },
  { key: "diabetes",   label: "Diabetes Care",    icon: "analytics-outline",       bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_diabetes.webp") },
  { key: "ayurvedic",  label: "Ayurvedic",        icon: "leaf-outline",            bg: "#ECFDF5", imageUrl: require("../../../../assets/images/category/products/home_ayurvedic.webp") },
  { key: "skinhair",   label: "Skin & Hair",      icon: "sparkles-outline",        bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_skinhair.webp") },
  { key: "pain",       label: "Pain Relief",      icon: "medical-outline",         bg: "#FEE2E2", apc: "APC-06-MED", imageUrl: require("../../../../assets/images/category/products/home_pain.webp") },
  { key: "digestive",  label: "Digestive",        icon: "nutrition-outline",       bg: "#FEF3C7", apc: "APC-06-MED", imageUrl: require("../../../../assets/images/category/products/home_digestive.webp") },
  { key: "eyeear",     label: "Eye & Ear Care",   icon: "eye-outline",             bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_eyeear.webp") },
  { key: "firstaid",   label: "First Aid",        icon: "add-circle-outline",      bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_firstaid.webp") },
  { key: "surgical",   label: "Surgical",         icon: "cut-outline",             bg: "#F3F4F6", imageUrl: require("../../../../assets/images/category/products/home_surgical.webp") },
];

export default function PharmacyFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.pharmacy.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} apc="APC-07-WELL" />
      <CategoryLiveProducts categoryKey="pharmacy" accentColor={ACCENT} />
    </View>
  );
}
