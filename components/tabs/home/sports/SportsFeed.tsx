// ============================================================
// SPORTS FEED — Apana Store (Home, Products > Sports)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../data/homeData";

const ACCENT = "#B45309";

const SUB_CATS: SubCat[] = [
  { key: "cricket",    label: "Cricket",          icon: "baseball-outline",        bg: "#DCFCE7" },
  { key: "football",   label: "Football",         icon: "football-outline",        bg: "#DBEAFE" },
  { key: "badminton",  label: "Badminton",        icon: "flash-outline",           bg: "#FEF3C7" },
  { key: "gym",        label: "Gym & Fitness",    icon: "barbell-outline",         bg: "#FFEDD5" },
  { key: "yoga",       label: "Yoga",             icon: "body-outline",            bg: "#EDE9FE" },
  { key: "cycling",    label: "Cycling",          icon: "bicycle-outline",         bg: "#DCFCE7" },
  { key: "running",    label: "Running",          icon: "walk-outline",            bg: "#FEE2E2" },
  { key: "swimming",   label: "Swimming",         icon: "water-outline",           bg: "#DBEAFE" },
  { key: "tennis",     label: "Tennis",           icon: "tennisball-outline",      bg: "#FEF3C7" },
  { key: "basketball", label: "Basketball",       icon: "basketball-outline",      bg: "#FFEDD5" },
  { key: "indoor",     label: "Indoor Games",     icon: "game-controller-outline", bg: "#FCE7F3" },
  { key: "outdoor",    label: "Outdoor Gear",     icon: "compass-outline",         bg: "#ECFDF5" },
];

export default function SportsFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.sports.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <TrendingSection
        city={MOCK_LOCATION.area}
        items={CATEGORY_FEEDS.sports.items}
        title={CATEGORY_FEEDS.sports.sectionTitle}
        icon={CATEGORY_FEEDS.sports.sectionIcon}
        onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
      />
    </View>
  );
}
