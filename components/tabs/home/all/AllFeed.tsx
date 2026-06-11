// ============================================================
// ALL FEED — Apana Store (Home, Products > All Items)
//
// Rich multi-section home feed:
//   1. BannerCarousel            — promo banners
//   2. Summer Picks              — 4-col seasonal category grid
//   3. Discover                  — Offer Zone / Brands / New Launches tiles
//   4. Daily Essentials          — horizontal scroll + add button
//   5. Flash Deals               — horizontal scroll + % off + add button
//   6. New Arrivals              — horizontal scroll + add button
//   7. Popular Near You          — horizontal scroll of top-rated stores
//   8. Trending in {city}        — PARKED at the bottom (Pune-only data;
//                                  needs real per-city data, see §below)
// ============================================================

import React from "react";
import { View } from "react-native";

import BannerCarousel          from "../BannerCarousel";
import TrendingCitySection     from "./TrendingCitySection";
import SeasonalCategorySection from "./SeasonalCategorySection";
import ProductHScrollSection   from "./ProductHScrollSection";
import FlashDealsSection       from "./FlashDealsSection";
import PopularStoresSection    from "./PopularStoresSection";
import HomeDiscoverRow        from "../HomeDiscoverRow";

import { BANNERS }          from "../../../../data/homeData";
import { useLocation }      from "../../../../context/LocationContext";
import {
  getTrendingForCity,
  SUMMER_CATEGORIES,
  DAILY_ESSENTIALS,
  FLASH_DEALS,
  NEW_ARRIVALS,
  POPULAR_STORES,
} from "../../../../data/allFeedData";

const BRAND_BLUE = "#0F4C81";
const PURPLE     = "#7C3AED";

export default function AllFeed() {
  const { selectedAddress } = useLocation();
  const city = selectedAddress.city;

  return (
    <View>

      {/* ── 1. Promo banners ── */}
      <BannerCarousel
        banners={BANNERS}
        onPress={() => {}}
      />

      {/* ── 2. Summer Picks — seasonal category grid ── */}
      <SeasonalCategorySection
        season="Summer"
        categories={SUMMER_CATEGORIES}
        accent="#E05A00"
      />

      {/* ── 4. Discover — Offer Zone · Brands · New Launches ── */}
      <View style={{ paddingVertical: 14 }}>
        <HomeDiscoverRow />
      </View>

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

      {/* ── 7. Popular Stores Near You ── */}
      <PopularStoresSection stores={POPULAR_STORES} />

      {/* ── 8. Trending in {city} — MOVED TO LAST (parked) ──
           Current data is Pune-only (famous local places/shops/items). India
           cities differ wildly — no shared metro wholesale, food, or places —
           so this needs real per-city data before it's promoted up the feed.
           Replace getTrendingForCity() with
           GET /api/customer/home/trending?city={city} when backend ready. */}
      <TrendingCitySection
        city={city}
        items={getTrendingForCity(city)}
      />

      <View style={{ height: 24 }} />
    </View>
  );
}
