// ============================================================
// ALL FEED — Apana Store (Home, Products > All Items)
//
// Default home feed: promo banners + trending stores/items.
// No sub-category grid — shows everything across categories.
// ============================================================

import React from "react";
import { View, Alert } from "react-native";
import BannerCarousel  from "../BannerCarousel";
import TrendingSection from "../TrendingSection";
import { BANNERS, TRENDING_ITEMS, MOCK_LOCATION } from "../../../data/homeData";

export default function AllFeed() {
  return (
    <View>
      <BannerCarousel
        banners={BANNERS}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />
      <TrendingSection
        city={MOCK_LOCATION.area}
        items={TRENDING_ITEMS}
        onPress={item => Alert.alert(item.name, `${item.category} · ${item.area}`)}
      />
    </View>
  );
}
