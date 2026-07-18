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
import CategoryLiveProducts from "../live/CategoryLiveProducts";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { CATEGORY_FEEDS } from "../../../../data/categoryFeedData";

const ACCENT = "#0437B1";

const SUB_CATS: SubCat[] = [
  { key: "mobiles",    label: "Mobiles",        icon: "phone-portrait-outline",   bg: "#DBEAFE", imageUrl: require("../../../../assets/images/category/products/home_mobiles.webp") },
  { key: "tablets",    label: "Tablets",         icon: "tablet-portrait-outline",  bg: "#EDE9FE", imageUrl: require("../../../../assets/images/category/products/home_tablets.webp") },
  { key: "cases",      label: "Cases",           icon: "phone-landscape-outline",  bg: "#DCFCE7", imageUrl: require("../../../../assets/images/category/products/home_cases.webp") },
  { key: "earbuds",    label: "Earbuds",         icon: "headset-outline",          bg: "#FEF3C7", imageUrl: require("../../../../assets/images/category/products/home_earbuds.webp") },
  { key: "feature",    label: "Feature Phone",   icon: "call-outline",             bg: "#FFEDD5", imageUrl: require("../../../../assets/images/category/products/home_feature.webp") },
  { key: "screenguard",label: "Screenguard",     icon: "shield-outline",           bg: "#F3F4F6", imageUrl: require("../../../../assets/images/category/products/home_screenguard.webp") },
  { key: "recharge",   label: "Recharge & SIM",  icon: "card-outline",             bg: "#FCE7F3", imageUrl: require("../../../../assets/images/category/products/home_recharge.webp") },
  { key: "accessories",label: "Accessories",     icon: "pricetag-outline",         bg: "#E0F2FE", imageUrl: require("../../../../assets/images/category/products/home_accessories.webp") },
];

export default function MobilesFeed() {
  return (
    <View>
      <BannerCarousel
        banners={CATEGORY_FEEDS.mobiles.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} apc="APC-12-A7" />
      <CategoryLiveProducts categoryKey="mobiles" accentColor={ACCENT} />
    </View>
  );
}
