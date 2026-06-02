// ============================================================
// SPORTS FEED — Apana Store (Home, Products > Sports)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../../data/homeData";

const ACCENT = "#B45309";

const SUB_CATS: SubCat[] = [
  { key: "cricket",    label: "Cricket",          icon: "baseball-outline",        bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_cricket.png") },
  { key: "football",   label: "Football",         icon: "football-outline",        bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_football.png") },
  { key: "badminton",  label: "Badminton",        icon: "flash-outline",           bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_badminton.png") },
  { key: "gym",        label: "Gym & Fitness",    icon: "barbell-outline",         bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_gym.png") },
  { key: "yoga",       label: "Yoga",             icon: "body-outline",            bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_yoga.png") },
  { key: "cycling",    label: "Cycling",          icon: "bicycle-outline",         bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_cycling.png") },
  { key: "running",    label: "Running",          icon: "walk-outline",            bg: "#FEE2E2", imageUrl: require("../../../../assets/images/category/products/home_running.png") },
  { key: "swimming",   label: "Swimming",         icon: "water-outline",           bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_swimming.png") },
  { key: "tennis",     label: "Tennis",           icon: "tennisball-outline",      bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_tennis.png") },
  { key: "basketball", label: "Basketball",       icon: "basketball-outline",      bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_basketball.png") },
  { key: "indoor",     label: "Indoor Games",     icon: "game-controller-outline", bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_indoor.png") },
  { key: "outdoor",    label: "Outdoor Gear",     icon: "compass-outline",         bg: "#ECFDF5", imageUrl: require("../../../../assets/images/category/products/home_outdoor.png") },
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
