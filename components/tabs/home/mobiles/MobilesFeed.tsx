// ============================================================
// MOBILES FEED — Apana Store (Home, Products > Mobiles)
//
// Layout: sub-category grid → stores near you.
// Sub-cats: Mobiles, Tablets, Cases, Earbuds, Feature Phone,
//           Screenguard, Recharge & SIM, Accessories
//
// Banners/promo carousel removed 2026-09 — parked until there's a real
// user base to justify one; see apana_doc/architecture/home_banners_promo_deferred.md.
// ============================================================

import React from "react";
import { View } from "react-native";
import CategoryLiveProducts from "../live/CategoryLiveProducts";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { assetImg } from "../../../../lib/assetImg";

const ACCENT = "#0437B1";

const SUB_CATS: SubCat[] = [
  { key: "mobiles",    label: "Mobiles",        icon: "phone-portrait-outline",   bg: "#DBEAFE", imageUrl: assetImg("category/products/home_mobiles.webp") },
  { key: "tablets",    label: "Tablets",         icon: "tablet-portrait-outline",  bg: "#EDE9FE", imageUrl: assetImg("category/products/home_tablets.webp") },
  { key: "cases",      label: "Cases",           icon: "phone-landscape-outline",  bg: "#DCFCE7", imageUrl: assetImg("category/products/home_cases.webp") },
  { key: "earbuds",    label: "Earbuds",         icon: "headset-outline",          bg: "#FEF3C7", imageUrl: assetImg("category/products/home_earbuds.webp") },
  { key: "feature",    label: "Feature Phone",   icon: "call-outline",             bg: "#FFEDD5", imageUrl: assetImg("category/products/home_feature.webp") },
  { key: "screenguard",label: "Screenguard",     icon: "shield-outline",           bg: "#F3F4F6", imageUrl: assetImg("category/products/home_screenguard.webp") },
  { key: "recharge",   label: "Recharge & SIM",  icon: "card-outline",             bg: "#FCE7F3", imageUrl: assetImg("category/products/home_recharge.webp") },
  { key: "accessories",label: "Accessories",     icon: "pricetag-outline",         bg: "#E0F2FE", imageUrl: assetImg("category/products/home_accessories.webp") },
];

export default function MobilesFeed() {
  return (
    <View>
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} apc="APC-12-A7" />
      <CategoryLiveProducts categoryKey="mobiles" accentColor={ACCENT} />
    </View>
  );
}
