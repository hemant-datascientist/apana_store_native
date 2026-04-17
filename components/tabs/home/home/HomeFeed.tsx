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
  { key: "bedding",    label: "Bedding",          icon: "bed-outline",             bg: "#DBEAFE" },
  { key: "curtains",   label: "Curtains",         icon: "expand-outline",          bg: "#FEF3C7" },
  { key: "walldecor",  label: "Wall Decor",       icon: "image-outline",           bg: "#FCE7F3" },
  { key: "lighting",   label: "Lighting",         icon: "bulb-outline",            bg: "#FEF3C7" },
  { key: "cushions",   label: "Cushions",         icon: "square-outline",          bg: "#EDE9FE" },
  { key: "rugs",       label: "Rugs & Carpets",   icon: "grid-outline",            bg: "#FFEDD5" },
  { key: "storage",    label: "Kitchen Storage",  icon: "basket-outline",          bg: "#DCFCE7" },
  { key: "bathroom",   label: "Bathroom",         icon: "water-outline",           bg: "#E0F2FE" },
  { key: "candles",    label: "Candles",          icon: "flame-outline",           bg: "#FEE2E2" },
  { key: "frames",     label: "Photo Frames",     icon: "image-outline",           bg: "#F3F4F6" },
  { key: "clocks",     label: "Clocks",           icon: "time-outline",            bg: "#EDE9FE" },
  { key: "garden",     label: "Garden",           icon: "leaf-outline",            bg: "#ECFDF5" },
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
