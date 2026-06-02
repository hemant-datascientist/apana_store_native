// ============================================================
// APPLIANCES FEED — Apana Store (Home, Products > Appliances)
//
// Layout: promo banner → "Home Appliances" section grid
//         → stores near you.
// Sub-cats: TV, Refrigerator, Air Conditioner, Mixer Grinder,
//           Speakers, Microwave, Fan & Cooler, Air Fryers,
//           Chimney, Iron Presser, Vacuum Cleaner, Washing Machine
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../../data/homeData";

const ACCENT = "#2C5282";

const APPLIANCE_CATS: SubCat[] = [
  { key: "tv",         label: "TV",               icon: "tv-outline",              bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_tv.png") },
  { key: "fridge",     label: "Refrigerator",     icon: "snow-outline",            bg: "#E0F2FE", imageUrl: require("../../../../assets/images/category/products/home_fridge.png") },
  { key: "ac",         label: "Air Conditioner",  icon: "thermometer-outline",     bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_ac.png") },
  { key: "mixer",      label: "Mixer Grinder",    icon: "restaurant-outline",      bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_mixer.png") },
  { key: "speakers",   label: "Speakers",         icon: "musical-notes-outline",   bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_speakers.png") },
  { key: "microwave",  label: "Microwave",        icon: "flame-outline",           bg: "#FEE2E2", imageUrl: require("../../../../assets/images/category/products/home_microwave.png") },
  { key: "fan",        label: "Fan & Cooler",     icon: "sync-outline",            bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_fan.png") },
  { key: "airfryer",   label: "Air Fryers",       icon: "flame-outline",           bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_airfryer.png") },
  { key: "chimney",    label: "Chimney",          icon: "cloud-outline",           bg: "#F3F4F6", imageUrl: require("../../../../assets/images/category/products/home_chimney.png") },
  { key: "iron",       label: "Iron Presser",     icon: "shirt-outline",           bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_iron.png") },
  { key: "vacuum",     label: "Vacuum Cleaner",   icon: "flash-outline",           bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_vacuum.png") },
  { key: "washing",    label: "Washing Machine",  icon: "water-outline",           bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_washing.png") },
];

export default function AppliancesFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.appliances.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid
        title="Home Appliances"
        subCats={APPLIANCE_CATS}
        accent={ACCENT}
      />
      <TrendingSection
        city={MOCK_LOCATION.area}
        items={CATEGORY_FEEDS.appliances.items}
        title={CATEGORY_FEEDS.appliances.sectionTitle}
        icon={CATEGORY_FEEDS.appliances.sectionIcon}
        onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
      />
    </View>
  );
}
