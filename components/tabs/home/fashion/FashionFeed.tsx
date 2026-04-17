// ============================================================
// FASHION FEED — Apana Store (Home, Products > Fashion)
//
// Complete fashion category screen:
//   BannerCarousel  (fashion-specific promos)
//   FashionGenderTabs (Men | Women | Boy | Girl)
//   FashionSubCategoryGrid (sub-categories per gender)
//
// Accent color: #660033 (fashion maroon)
// ============================================================

import React, { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import BannerCarousel         from "../BannerCarousel";
import FashionGenderTabs      from "./FashionGenderTabs";
import FashionSubCategoryGrid from "./FashionSubCategoryGrid";
import { CATEGORY_FEEDS }     from "../../../../data/categoryFeedData";
import {
  FASHION_GENDERS,
  FashionGender,
} from "../../../../data/fashionData";

const FASHION_ACCENT = "#660033";

export default function FashionFeed() {
  const [activeGender, setActiveGender] = useState<FashionGender>("men");

  const activeConfig = FASHION_GENDERS.find(g => g.key === activeGender)!;

  return (
    <View style={styles.root}>

      {/* Fashion promo banners */}
      <BannerCarousel
        banners={CATEGORY_FEEDS.fashion.banners}
        onPress={b => Alert.alert(b.title, b.subtitle)}
      />

      {/* Gender / age selector tabs */}
      <FashionGenderTabs
        genders={FASHION_GENDERS}
        activeKey={activeGender}
        onChange={setActiveGender}
        accent={FASHION_ACCENT}
      />

      {/* Sub-category grid for selected gender */}
      <FashionSubCategoryGrid
        subCats={activeConfig.subCats}
        accent={FASHION_ACCENT}
      />

      <View style={{ height: 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {},
});
