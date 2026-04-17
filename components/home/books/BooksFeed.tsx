// ============================================================
// BOOKS FEED — Apana Store (Home, Products > Books)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../data/homeData";

const ACCENT = "#933A00";

const SUB_CATS: SubCat[] = [
  { key: "academic",   label: "Academic",         icon: "school-outline",          bg: "#DBEAFE" },
  { key: "fiction",    label: "Fiction",          icon: "book-outline",            bg: "#FEF3C7" },
  { key: "nonfiction", label: "Non-Fiction",      icon: "library-outline",         bg: "#DCFCE7" },
  { key: "comics",     label: "Comics",           icon: "happy-outline",           bg: "#FCE7F3" },
  { key: "children",   label: "Children's Books", icon: "balloon-outline",         bg: "#EDE9FE" },
  { key: "exams",      label: "Competitive Exams",icon: "ribbon-outline",          bg: "#FEF3C7" },
  { key: "stationery", label: "Stationery",       icon: "create-outline",          bg: "#FFEDD5" },
  { key: "art",        label: "Art Supplies",     icon: "color-palette-outline",   bg: "#FCE7F3" },
  { key: "magazines",  label: "Magazines",        icon: "newspaper-outline",       bg: "#F3F4F6" },
  { key: "regional",   label: "Regional Language",icon: "globe-outline",           bg: "#DBEAFE" },
  { key: "selfhelp",   label: "Self-Help",        icon: "heart-outline",           bg: "#DCFCE7" },
  { key: "business",   label: "Business",         icon: "briefcase-outline",       bg: "#EDE9FE" },
];

export default function BooksFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.books.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <TrendingSection
        city={MOCK_LOCATION.area}
        items={CATEGORY_FEEDS.books.items}
        title={CATEGORY_FEEDS.books.sectionTitle}
        icon={CATEGORY_FEEDS.books.sectionIcon}
        onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
      />
    </View>
  );
}
