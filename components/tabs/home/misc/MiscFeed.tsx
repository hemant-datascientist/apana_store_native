// ============================================================
// MISC FEED — Apana Store (Home, Products > Miscellaneous)
//
// Banners/promo carousel removed 2026-09 — parked until there's a real
// user base to justify one; see apana_doc/architecture/home_banners_promo_deferred.md.
// ============================================================

import React from "react";
import { View } from "react-native";
import CategoryLiveProducts from "../live/CategoryLiveProducts";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { assetImg } from "../../../../lib/assetImg";

const ACCENT = "#4A4A6A";

const SUB_CATS: SubCat[] = [
  { key: "pets",       label: "Pet Supplies",     icon: "paw-outline",             bg: "#FEF3C7", imageUrl: assetImg("category/products/home_misc_pets.webp") },
  { key: "baby",       label: "Baby Care",        icon: "balloon-outline",         bg: "#FCE7F3", imageUrl: assetImg("category/products/home_misc_baby.webp") },
  { key: "gifts",      label: "Gifts",            icon: "gift-outline",            bg: "#EDE9FE", imageUrl: assetImg("category/products/home_misc_gifts.webp") },
  { key: "travel",     label: "Travel",           icon: "airplane-outline",        bg: "#DBEAFE", imageUrl: assetImg("category/products/home_misc_travel.webp") },
  { key: "luggage",    label: "Luggage",          icon: "briefcase-outline",       bg: "#F3F4F6", imageUrl: assetImg("category/products/home_misc_luggage.webp") },
  { key: "seasonal",   label: "Seasonal Decor",   icon: "sparkles-outline",        bg: "#FEF3C7", imageUrl: assetImg("category/products/home_misc_seasonal.webp") },
  { key: "office",     label: "Office Supplies",  icon: "print-outline",           bg: "#DCFCE7", imageUrl: assetImg("category/products/home_misc_office.webp") },
  { key: "toys",       label: "Toys",             icon: "game-controller-outline", bg: "#FCE7F3", imageUrl: assetImg("category/products/home_misc_toys.webp") },
  { key: "artcraft",   label: "Art & Craft",      icon: "color-palette-outline",   bg: "#ECFDF5", imageUrl: assetImg("category/products/home_misc_artcraft.webp") },
  { key: "party",      label: "Party Supplies",   icon: "people-outline",          bg: "#FFEDD5", imageUrl: assetImg("category/products/home_misc_party.webp") },
  { key: "auto",       label: "Automotive",       icon: "car-outline",             bg: "#EDE9FE", imageUrl: assetImg("category/products/home_misc_auto.webp") },
  { key: "garden",     label: "Gardening",        icon: "leaf-outline",            bg: "#DCFCE7", imageUrl: assetImg("category/products/home_misc_gardening.webp") },
];

export default function MiscFeed() {
  return (
    <View>
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} />
      <CategoryLiveProducts categoryKey="misc" accentColor={ACCENT} />
    </View>
  );
}
