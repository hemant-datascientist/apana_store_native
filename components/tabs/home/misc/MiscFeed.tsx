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
  { key: "pets",       label: "Pet Supplies", apc: "APC-26-PET",     icon: "paw-outline",             bg: "#FEF3C7", imageUrl: assetImg("category/products/home_misc_pets.webp") },
  { key: "baby",       label: "Baby Care", apc: "APC-09-BABYM",        icon: "balloon-outline",         bg: "#FCE7F3", imageUrl: assetImg("category/products/home_misc_baby.webp") },
  { key: "gifts",      label: "Gifts",            icon: "gift-outline",            bg: "#EDE9FE", imageUrl: assetImg("category/products/home_misc_gifts.webp") },
  { key: "travel",     label: "Travel",           icon: "airplane-outline",        bg: "#DBEAFE", imageUrl: assetImg("category/products/home_misc_travel.webp") },
  { key: "luggage",    label: "Luggage", apc: "APC-10-FASH",          icon: "briefcase-outline",       bg: "#F3F4F6", imageUrl: assetImg("category/products/home_misc_luggage.webp") },
  { key: "seasonal",   label: "Seasonal Decor", apc: "APC-16-HFUR",   icon: "sparkles-outline",        bg: "#FEF3C7", imageUrl: assetImg("category/products/home_misc_seasonal.webp") },
  { key: "office",     label: "Office Supplies", apc: "APC-21-BOOK",  icon: "print-outline",           bg: "#DCFCE7", imageUrl: assetImg("category/products/home_misc_office.webp") },
  { key: "toys",       label: "Toys", apc: "APC-24-TOY",             icon: "game-controller-outline", bg: "#FCE7F3", imageUrl: assetImg("category/products/home_misc_toys.webp") },
  { key: "artcraft",   label: "Art & Craft", apc: "APC-22-ART",      icon: "color-palette-outline",   bg: "#ECFDF5", imageUrl: assetImg("category/products/home_misc_artcraft.webp") },
  { key: "party",      label: "Party Supplies",   icon: "people-outline",          bg: "#FFEDD5", imageUrl: assetImg("category/products/home_misc_party.webp") },
  { key: "auto",       label: "Automotive", apc: "APC-30-AUTO",       icon: "car-outline",             bg: "#EDE9FE", imageUrl: assetImg("category/products/home_misc_auto.webp") },
  { key: "garden",     label: "Gardening", apc: "APC-27-PLANT",        icon: "leaf-outline",            bg: "#DCFCE7", imageUrl: assetImg("category/products/home_misc_gardening.webp") },
];

export default function MiscFeed() {
  return (
    <View>
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} apc="APC-34-MISC" />
      <CategoryLiveProducts categoryKey="misc" accentColor={ACCENT} />
    </View>
  );
}
