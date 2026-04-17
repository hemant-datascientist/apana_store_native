// ============================================================
// MISC FEED — Apana Store (Home, Products > Miscellaneous)
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../../data/homeData";

const ACCENT = "#4A4A6A";

const SUB_CATS: SubCat[] = [
  { key: "pets",       label: "Pet Supplies",     icon: "paw-outline",             bg: "#FEF3C7" },
  { key: "baby",       label: "Baby Care",        icon: "balloon-outline",         bg: "#FCE7F3" },
  { key: "gifts",      label: "Gifts",            icon: "gift-outline",            bg: "#EDE9FE" },
  { key: "travel",     label: "Travel",           icon: "airplane-outline",        bg: "#DBEAFE" },
  { key: "luggage",    label: "Luggage",          icon: "briefcase-outline",       bg: "#F3F4F6" },
  { key: "seasonal",   label: "Seasonal Decor",   icon: "sparkles-outline",        bg: "#FEF3C7" },
  { key: "office",     label: "Office Supplies",  icon: "print-outline",           bg: "#DCFCE7" },
  { key: "toys",       label: "Toys",             icon: "game-controller-outline", bg: "#FCE7F3" },
  { key: "artcraft",   label: "Art & Craft",      icon: "color-palette-outline",   bg: "#ECFDF5" },
  { key: "party",      label: "Party Supplies",   icon: "people-outline",          bg: "#FFEDD5" },
  { key: "auto",       label: "Automotive",       icon: "car-outline",             bg: "#EDE9FE" },
  { key: "garden",     label: "Gardening",        icon: "leaf-outline",            bg: "#DCFCE7" },
];

export default function MiscFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.misc.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <TrendingSection
        city={MOCK_LOCATION.area}
        items={CATEGORY_FEEDS.misc.items}
        title={CATEGORY_FEEDS.misc.sectionTitle}
        icon={CATEGORY_FEEDS.misc.sectionIcon}
        onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
      />
    </View>
  );
}
