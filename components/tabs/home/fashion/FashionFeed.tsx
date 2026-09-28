// ============================================================
// FASHION FEED — Apana Store (Home, Products > Fashion)
//
// Complete fashion category screen:
//   FashionGenderTabs (Men | Women | Boy | Girl)
//   FashionSubCategoryGrid (sub-categories per gender)
//
// Banners/promo carousel removed 2026-09 — parked until there's a real
// user base to justify one; see apana_doc/architecture/home_banners_promo_deferred.md.
//
// Accent color: #660033 (fashion maroon)
// ============================================================

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import FashionGenderTabs      from "./FashionGenderTabs";
import FashionSubCategoryGrid from "./FashionSubCategoryGrid";
import CategoryLiveProducts   from "../live/CategoryLiveProducts";
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
        apc="APC-10-FASH"
      />

      {/* Real seller inventory for fashion */}
      <CategoryLiveProducts categoryKey="fashion" accentColor={FASHION_ACCENT} />

      <View style={{ height: 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {},
});
