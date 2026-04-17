// ============================================================
// MOBILES FEED — Apana Store (Home, Products > Mobiles)
//
// Layout: promo banner → sub-category grid → stores near you.
// Sub-cats: Mobiles, Tablets, Cases, Earbuds, Feature Phone,
//           Screenguard, Recharge & SIM, Accessories
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel    from "../BannerCarousel";
import TrendingSection   from "../TrendingSection";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../data/categoryFeedData";
import { MOCK_LOCATION }  from "../../../data/homeData";

const ACCENT = "#0437B1";

const SUB_CATS: SubCat[] = [
  { key: "mobiles",    label: "Mobiles",        icon: "phone-portrait-outline",   bg: "#DBEAFE" },
  { key: "tablets",    label: "Tablets",         icon: "tablet-portrait-outline",  bg: "#EDE9FE" },
  { key: "cases",      label: "Cases",           icon: "phone-landscape-outline",  bg: "#DCFCE7" },
  { key: "earbuds",    label: "Earbuds",         icon: "headset-outline",          bg: "#FEF3C7" },
  { key: "feature",    label: "Feature Phone",   icon: "call-outline",             bg: "#FFEDD5" },
  { key: "screenguard",label: "Screenguard",     icon: "shield-outline",           bg: "#F3F4F6" },
  { key: "recharge",   label: "Recharge & SIM",  icon: "card-outline",             bg: "#FCE7F3" },
  { key: "accessories",label: "Accessories",     icon: "pricetag-outline",         bg: "#E0F2FE" },
];

export default function MobilesFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.mobiles.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <TrendingSection
        city={MOCK_LOCATION.area}
        items={CATEGORY_FEEDS.mobiles.items}
        title={CATEGORY_FEEDS.mobiles.sectionTitle}
        icon={CATEGORY_FEEDS.mobiles.sectionIcon}
        onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
      />
    </View>
  );
}
