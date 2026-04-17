// ============================================================
// ICE CREAM FEED — Apana Store (Home, Products > Ice Cream)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../../data/homeData";

const ACCENT = "#803E96";

const SUB_CATS: SubCat[] = [
  { key: "cones",      label: "Cones",            icon: "ice-cream-outline",       bg: "#FCE7F3" },
  { key: "cups",       label: "Cups & Tubs",      icon: "cafe-outline",            bg: "#DBEAFE" },
  { key: "kulfi",      label: "Kulfi",            icon: "flame-outline",           bg: "#FEF3C7" },
  { key: "stick",      label: "Stick Ice Cream",  icon: "remove-outline",          bg: "#DCFCE7" },
  { key: "family",     label: "Family Pack",      icon: "people-outline",          bg: "#EDE9FE" },
  { key: "party",      label: "Party Pack",       icon: "gift-outline",            bg: "#FCE7F3" },
  { key: "waffles",    label: "Waffles",          icon: "grid-outline",            bg: "#FEF3C7" },
  { key: "sundaes",    label: "Sundaes",          icon: "ice-cream-outline",       bg: "#FFEDD5" },
  { key: "gelato",     label: "Gelato",           icon: "sparkles-outline",        bg: "#EDE9FE" },
  { key: "yogurt",     label: "Frozen Yogurt",    icon: "leaf-outline",            bg: "#ECFDF5" },
  { key: "sorbet",     label: "Sorbet",           icon: "nutrition-outline",       bg: "#FEE2E2" },
  { key: "cakes",      label: "Ice Cream Cakes",  icon: "gift-outline",            bg: "#FCE7F3" },
];

export default function IceCreamFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.icecream.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <TrendingSection
        city={MOCK_LOCATION.area}
        items={CATEGORY_FEEDS.icecream.items}
        title={CATEGORY_FEEDS.icecream.sectionTitle}
        icon={CATEGORY_FEEDS.icecream.sectionIcon}
        onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
      />
    </View>
  );
}
