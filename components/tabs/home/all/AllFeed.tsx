// ============================================================
// ALL FEED — Apana Store (Home, Products > All Items)
//
// Multi-section home feed. Product LISTS are real seller inventory only
// (CategoryLiveProducts); the mock product rails (Daily Essentials, Flash
// Deals, New Arrivals, Trending) were removed. The non-product sections —
// promo banners, seasonal CATEGORY tiles, the Discover row, brand-funded
// promos, and popular stores — stay to keep the layout intact.
// ============================================================

import React from "react";
import { View } from "react-native";

import BannerCarousel          from "../BannerCarousel";
import SeasonalCategorySection from "./SeasonalCategorySection";
import BrandDealsSection       from "./BrandDealsSection";
import PopularStoresSection    from "./PopularStoresSection";
import HomeDiscoverRow         from "../HomeDiscoverRow";
import CategoryLiveProducts    from "../live/CategoryLiveProducts";

import { BANNERS }          from "../../../../data/homeData";
import { SEASONS, POPULAR_STORES } from "../../../../data/allFeedData";
import { getActiveBrandDeals } from "../../../../data/brandPromoData";

export default function AllFeed() {
  // Brand-funded promos live now (empty → the section renders nothing).
  const brandDeals = getActiveBrandDeals();

  return (
    <View>

      {/* ── 1. Promo banners ── */}
      <BannerCarousel banners={BANNERS} onPress={() => {}} />

      {/* ── 2. Seasonal Picks — category tiles, arrow-browsed ── */}
      <SeasonalCategorySection seasons={SEASONS} />

      {/* ── 3. Discover — Offer Zone · Brands · New Launches ── */}
      <View style={{ paddingVertical: 14 }}>
        <HomeDiscoverRow />
      </View>

      {/* ── 4. Real seller inventory (replaces the mock product rails) ── */}
      <CategoryLiveProducts categoryKey="all" title="Fresh from local shops" icon="storefront-outline" />

      {/* ── 5. Brand Deals — brand-FUNDED co-op; seller kept whole (empty → hidden) ── */}
      <BrandDealsSection deals={brandDeals} />

      {/* ── 6. Popular Stores Near You ── */}
      <PopularStoresSection stores={POPULAR_STORES} />

      <View style={{ height: 24 }} />
    </View>
  );
}
