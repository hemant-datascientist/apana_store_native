// ============================================================
// BOOKS FEED — Apana Store (Home, Products > Books)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import CategoryLiveProducts from "../live/CategoryLiveProducts";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";

const ACCENT = "#933A00";

const SUB_CATS: SubCat[] = [
  { key: "academic",   label: "Academic",         icon: "school-outline",          bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_books_academic.webp") },
  { key: "fiction",    label: "Fiction",          icon: "book-outline",            bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_books_fiction.webp") },
  { key: "nonfiction", label: "Non-Fiction",      icon: "library-outline",         bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_books_nonfiction.webp") },
  { key: "comics",     label: "Comics",           icon: "happy-outline",           bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_books_comics.webp") },
  { key: "children",   label: "Children's Books", icon: "balloon-outline",         bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_books_children.webp") },
  { key: "exams",      label: "Competitive Exams",icon: "ribbon-outline",          bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_books_exams.webp") },
  { key: "stationery", label: "Stationery",       icon: "create-outline",          bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_books_stationery.webp") },
  { key: "art",        label: "Art Supplies",     icon: "color-palette-outline",   bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_books_art.webp") },
  { key: "magazines",  label: "Magazines",        icon: "newspaper-outline",       bg: "#F3F4F6", imageUrl: require("../../../../assets/images/category/products/home_books_magazines.webp") },
  { key: "regional",   label: "Regional Language",icon: "globe-outline",           bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_books_regional.webp") },
  { key: "selfhelp",   label: "Self-Help",        icon: "heart-outline",           bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_selfhelp.webp") },
  { key: "business",   label: "Business",         icon: "briefcase-outline",       bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_books_business.webp") },
];

export default function BooksFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.books.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} apc="APC-21-BOOK" />
      <CategoryLiveProducts categoryKey="books" accentColor={ACCENT} />
    </View>
  );
}
