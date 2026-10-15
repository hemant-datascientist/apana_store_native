// ============================================================
// HOME DECOR FEED — Apana Store (Home, Products > Home)
//
// Banners/promo carousel removed 2026-09 — parked until there's a real
// user base to justify one; see apana_doc/architecture/home_banners_promo_deferred.md.
// ============================================================

import React from "react";
import { View } from "react-native";
import CategoryLiveProducts from "../live/CategoryLiveProducts";
import CategorySubGrid, { SubCat } from "../shared/CategorySubGrid";
import { assetImg } from "../../../../lib/assetImg";

const ACCENT = "#7C4438";

const SUB_CATS: SubCat[] = [
  { key: "bedding",    label: "Bedding",          icon: "bed-outline",             bg: "#DBEAFE", imageUrl: assetImg("category/products/home_bedding.webp") },
  { key: "curtains",   label: "Curtains",         icon: "expand-outline",          bg: "#FEF3C7", imageUrl: assetImg("category/products/home_curtains.webp") },
  { key: "walldecor",  label: "Wall Decor",       icon: "image-outline",           bg: "#FCE7F3", imageUrl: assetImg("category/products/home_walldecor.webp") },
  { key: "lighting",   label: "Lighting", apc: "APC-15-ELEC",         icon: "bulb-outline",            bg: "#FEF3C7", imageUrl: assetImg("category/products/home_lighting.webp") },
  { key: "cushions",   label: "Cushions",         icon: "square-outline",          bg: "#EDE9FE", imageUrl: assetImg("category/products/home_cushions.webp") },
  { key: "rugs",       label: "Rugs & Carpets",   icon: "grid-outline",            bg: "#FFEDD5", imageUrl: assetImg("category/products/home_rugs.webp") },
  { key: "storage",    label: "Kitchen Storage", apc: "APC-17-KTCH",  icon: "basket-outline",          bg: "#DCFCE7", imageUrl: assetImg("category/products/home_kitchen_storage.webp") },
  { key: "bathroom",   label: "Bathroom", apc: "APC-19-SANI",         icon: "water-outline",           bg: "#E0F2FE", imageUrl: assetImg("category/products/home_bathroom.webp") },
  { key: "candles",    label: "Candles",          icon: "flame-outline",           bg: "#FEE2E2", imageUrl: assetImg("category/products/home_candles.webp") },
  { key: "frames",     label: "Photo Frames",     icon: "image-outline",           bg: "#F3F4F6", imageUrl: assetImg("category/products/home_frames.webp") },
  { key: "clocks",     label: "Clocks",           icon: "time-outline",            bg: "#EDE9FE", imageUrl: assetImg("category/products/home_clocks.webp") },
  { key: "garden",     label: "Garden", apc: "APC-27-PLANT",           icon: "leaf-outline",            bg: "#ECFDF5", imageUrl: assetImg("category/products/home_garden.webp") },
];

export default function HomeFeed() {
  return (
    <View>
      <CategorySubGrid subCats={SUB_CATS} accent={ACCENT} apc="APC-16-HFUR" />
      <CategoryLiveProducts categoryKey="home" accentColor={ACCENT} />
    </View>
  );
}
