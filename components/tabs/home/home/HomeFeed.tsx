// ============================================================
// HOME DECOR FEED — Apana Store (Home, Products > Home)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../../data/homeData";

const ACCENT = "#7C4438";

const SUB_CATS: SubCat[] = [
  { key: "bedding",    label: "Bedding",          icon: "bed-outline",             bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_bedding.webp") },
  { key: "curtains",   label: "Curtains",         icon: "expand-outline",          bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_curtains.webp") },
  { key: "walldecor",  label: "Wall Decor",       icon: "image-outline",           bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_walldecor.webp") },
  { key: "lighting",   label: "Lighting",         icon: "bulb-outline",            bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_lighting.webp") },
  { key: "cushions",   label: "Cushions",         icon: "square-outline",          bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_cushions.webp") },
  { key: "rugs",       label: "Rugs & Carpets",   icon: "grid-outline",            bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_rugs.webp") },
  { key: "storage",    label: "Kitchen Storage",  icon: "basket-outline",          bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_kitchen_storage.webp") },
  { key: "bathroom",   label: "Bathroom",         icon: "water-outline",           bg: "#E0F2FE", imageUrl: require("../../../../assets/images/category/products/home_bathroom.webp") },
  { key: "candles",    label: "Candles",          icon: "flame-outline",           bg: "#FEE2E2", imageUrl: require("../../../../assets/images/category/products/home_candles.webp") },
  { key: "frames",     label: "Photo Frames",     icon: "image-outline",           bg: "#F3F4F6", imageUrl: require("../../../../assets/images/category/products/home_frames.webp") },
  { key: "clocks",     label: "Clocks",           icon: "time-outline",            bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_clocks.webp") },
  { key: "garden",     label: "Garden",           icon: "leaf-outline",            bg: "#ECFDF5", imageUrl: require("../../../../assets/images/category/products/home_garden.webp") },
];

export default function HomeFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.home.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <TrendingSection
        city={MOCK_LOCATION.area}
        items={CATEGORY_FEEDS.home.items}
        title={CATEGORY_FEEDS.home.sectionTitle}
        icon={CATEGORY_FEEDS.home.sectionIcon}
        onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
      />
    </View>
  );
}
