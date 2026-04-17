// ============================================================
// ALL FEED — Apana Store (Home, Products > All Items)
//
// Rich multi-section home feed:
//   1. BannerCarousel         — promo banners
//   2. Trending in {city}     — 3-col product grid
//   3. Seasonal Picks         — 3-col product grid
//   4. Daily Essentials       — horizontal scroll
//   5. Flash Deals            — horizontal scroll + % off badge
//   6. New Arrivals           — horizontal scroll + "New" badge
// ============================================================

import React from "react";
import { View } from "react-native";

import BannerCarousel        from "../BannerCarousel";
import ProductGridSection    from "./ProductGridSection";
import ProductHScrollSection from "./ProductHScrollSection";
import FlashDealsSection     from "./FlashDealsSection";

import { BANNERS, MOCK_LOCATION } from "../../../data/homeData";
import {
  TRENDING_PRODUCTS,
  SEASONAL_PRODUCTS,
  DAILY_ESSENTIALS,
  FLASH_DEALS,
  NEW_ARRIVALS,
} from "../../../data/allFeedData";

const BRAND_BLUE   = "#0F4C81";
const GROCERY_GREEN= "#026451";
const PURPLE       = "#7C3AED";

export default function AllFeed() {
  const city = MOCK_LOCATION.area;

  return (
    <View>

      {/* ── 1. Promo banners ── */}
      <BannerCarousel
        banners={BANNERS}
        onPress={() => {}}
      />

      {/* ── 2. Trending in {city} — 3-col grid ── */}
      <ProductGridSection
        icon="flame-outline"
        title={`Trending in ${city}`}
        accentColor="#F97316"
        products={TRENDING_PRODUCTS}
      />

      {/* ── 3. Seasonal Picks — 3-col grid ── */}
      <ProductGridSection
        icon="sunny-outline"
        title="Seasonal Picks"
        accentColor={GROCERY_GREEN}
        products={SEASONAL_PRODUCTS}
      />

      {/* ── 4. Daily Essentials — horizontal scroll ── */}
      <ProductHScrollSection
        icon="cart-outline"
        title="Daily Essentials"
        accentColor={BRAND_BLUE}
        products={DAILY_ESSENTIALS}
      />

      {/* ── 5. Flash Deals — horizontal scroll with % off ── */}
      <FlashDealsSection deals={FLASH_DEALS} />

      {/* ── 6. New Arrivals — horizontal scroll ── */}
      <ProductHScrollSection
        icon="sparkles-outline"
        title="New Arrivals"
        accentColor={PURPLE}
        products={NEW_ARRIVALS}
      />

      <View style={{ height: 24 }} />
    </View>
  );
}
