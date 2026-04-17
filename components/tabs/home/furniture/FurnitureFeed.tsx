// ============================================================
// FURNITURE FEED — Apana Store (Home, Products > Furniture)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../../data/homeData";

const ACCENT = "#6D4924";

const SUB_CATS: SubCat[] = [
  { key: "sofa",       label: "Sofa & Seating",   icon: "people-outline",          bg: "#FFEDD5" },
  { key: "beds",       label: "Beds & Mattresses", icon: "bed-outline",             bg: "#DBEAFE" },
  { key: "wardrobes",  label: "Wardrobes",        icon: "layers-outline",          bg: "#EDE9FE" },
  { key: "dining",     label: "Dining Sets",      icon: "restaurant-outline",      bg: "#FEF3C7" },
  { key: "chairs",     label: "Office Chairs",    icon: "desktop-outline",         bg: "#DCFCE7" },
  { key: "tables",     label: "Tables & Desks",   icon: "tablet-landscape-outline",bg: "#FEF3C7" },
  { key: "tvunit",     label: "TV Units",         icon: "tv-outline",              bg: "#DBEAFE" },
  { key: "shelves",    label: "Bookshelves",      icon: "library-outline",         bg: "#FFEDD5" },
  { key: "outdoor",    label: "Outdoor Furniture",icon: "leaf-outline",            bg: "#ECFDF5" },
  { key: "storage",    label: "Storage",          icon: "server-outline",          bg: "#F3F4F6" },
  { key: "kids",       label: "Kids Furniture",   icon: "balloon-outline",         bg: "#FCE7F3" },
  { key: "beanbags",   label: "Bean Bags",        icon: "ellipse-outline",         bg: "#EDE9FE" },
];

export default function FurnitureFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.furniture.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <TrendingSection
        city={MOCK_LOCATION.area}
        items={CATEGORY_FEEDS.furniture.items}
        title={CATEGORY_FEEDS.furniture.sectionTitle}
        icon={CATEGORY_FEEDS.furniture.sectionIcon}
        onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
      />
    </View>
  );
}
