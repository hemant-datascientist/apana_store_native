// ============================================================
// ALL FEED — Apana Store (Home, Products > All Items)
//
// Multi-section home feed. Product LISTS are real seller inventory only
// (CategoryLiveProducts); the mock product rails (Daily Essentials, Flash
// Deals, New Arrivals, Trending) were removed. The non-product sections —
// seasonal CATEGORY tiles, the Discover row — stay to keep the layout intact.
//
// BrandDealsSection was removed (2026-09): its data (data/brandPromoData.ts)
// invents SPECIFIC named sellers ("Sharma General Store", "Gupta Medical
// Store") and claims real FMCG brands (Nestlé, HUL, Mondelez, Tata Consumer,
// Britannia, Reckitt) are funding co-op discounts through Apana — no such
// partnership exists with any of them. That's a materially different problem
// from a placeholder price: it names real trademark holders as commercial
// partners. §19.8 — no real brand-funded promo backend exists, so this shows
// nothing rather than something invented. brandPromoData.ts itself is left
// in place — Cart's discount engine (lib/discount.ts) still imports
// getActiveBrandPromo() from it for real cart-line pricing.
//
// Banners/promo carousel removed 2026-09 — parked until there's a real
// user base to justify one; see apana_doc/architecture/home_banners_promo_deferred.md.
// ============================================================

import React from "react";
import { View } from "react-native";

import SeasonalCategorySection from "./SeasonalCategorySection";
import HomeDiscoverRow         from "../HomeDiscoverRow";
import CategoryLiveProducts    from "../live/CategoryLiveProducts";

import { SEASONS } from "../../../../data/allFeedData";

export default function AllFeed() {
  return (
    <View>

      {/* ── 1. Seasonal Picks — category tiles, arrow-browsed ── */}
      <SeasonalCategorySection seasons={SEASONS} />

      {/* ── 2. Discover — Offer Zone · Brands · New Launches ── */}
      <View style={{ paddingVertical: 14 }}>
        <HomeDiscoverRow />
      </View>

      {/* ── 3. Real seller inventory (replaces the mock product rails) ── */}
      <CategoryLiveProducts categoryKey="all" title="Fresh from local shops" icon="storefront-outline" />

      {/* Real nearby stores live in the Stores discovery mode (NearbyStoresFeed);
          the old mock "Popular Stores" rail was removed (§19.8 — no phantom shops). */}
      <View style={{ height: 24 }} />
    </View>
  );
}
