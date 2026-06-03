// ============================================================
// BOOKS FEED — Apana Store (Home, Products > Books)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../../data/homeData";

const ACCENT = "#933A00";

const SUB_CATS: SubCat[] = [
  { key: "academic",   label: "Academic",         icon: "school-outline",          bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_books_academic.png") },
  { key: "fiction",    label: "Fiction",          icon: "book-outline",            bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_books_fiction.png") },
  { key: "nonfiction", label: "Non-Fiction",      icon: "library-outline",         bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_books_nonfiction.png") },
  { key: "comics",     label: "Comics",           icon: "happy-outline",           bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_books_comics.png") },
  { key: "children",   label: "Children's Books", icon: "balloon-outline",         bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_books_children.png") },
  { key: "exams",      label: "Competitive Exams",icon: "ribbon-outline",          bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_books_exams.png") },
  { key: "stationery", label: "Stationery",       icon: "create-outline",          bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_books_stationery.png") },
  { key: "art",        label: "Art Supplies",     icon: "color-palette-outline",   bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_books_art.png") },
  { key: "magazines",  label: "Magazines",        icon: "newspaper-outline",       bg: "#F3F4F6", imageUrl: require("../../../../assets/images/category/products/home_books_magazines.png") },
  { key: "regional",   label: "Regional Language",icon: "globe-outline",           bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_books_regional.png") },
  { key: "selfhelp",   label: "Self-Help",        icon: "heart-outline",           bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_selfhelp.png") },
  { key: "business",   label: "Business",         icon: "briefcase-outline",       bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_books_business.png") },
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
