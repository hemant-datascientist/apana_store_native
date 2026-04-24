// ============================================================
// STORE DETAIL SCREEN — Apana Store (Customer App)
//
// Sections (top → bottom):
//   StoreHeroBanner      — colored hero with icon, LIVE badge, rating
//   StoreInfoHeader      — name, tagline, address, open/closed status
//   StoreActionButtons   — Directions | Book Ride | Call | Website
//   StoreProductSearch   — search bar scoped to this store's products
//   StoreHoursCard       — weekly opening hours, today highlighted
//   StoreContactCard     — address + phone + report issue link
//   StoreProductCategories — filterable category rows with product count
//
// Navigation:
//   router.push("/store-detail?id=s1")
//
// State:
//   productSearch — filters category list by label
//
// Backend: GET /stores/:id
// ============================================================

import React, { useState } from "react";
import {
  View, ScrollView, StyleSheet, Alert,
} from "react-native";
import { SafeAreaView }        from "react-native-safe-area-context";
import { Ionicons }            from "@expo/vector-icons";
import { TouchableOpacity }    from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme                from "../../theme/useTheme";
import { typography }          from "../../theme/typography";
import { Text }                from "react-native";
import {
  getStoreById,
  DEFAULT_STORE_ID,
  StoreProductCategory,
} from "../../data/storeDetailData";

import StoreHeroBanner        from "../../components/store/StoreHeroBanner";
import StoreInfoHeader        from "../../components/store/StoreInfoHeader";
import StoreActionButtons     from "../../components/store/StoreActionButtons";
import StoreProductSearch     from "../../components/store/StoreProductSearch";
import StoreHoursCard         from "../../components/store/StoreHoursCard";
import StoreContactCard       from "../../components/store/StoreContactCard";
import StoreProductCategories from "../../components/store/StoreProductCategories";

export default function StoreDetailScreen() {
  const { colors }         = useTheme();
  const router             = useRouter();
  const { id }             = useLocalSearchParams<{ id?: string }>();

  const store = getStoreById(id ?? DEFAULT_STORE_ID);

  const [productSearch, setProductSearch] = useState("");

  // ── Actions ───────────────────────────────────────────────────
  function handleDirections() {
    Alert.alert(
      "Directions",
      `Opening directions to ${store.name}.\n(Mappls navigation integration coming soon.)`,
    );
  }

  function handleBookRide() {
    Alert.alert(
      "Book Ride",
      `Book a ride to ${store.name}.\n(Apana Partner ride booking coming soon.)`,
    );
  }

  function handleCategorySelect(cat: StoreProductCategory) {
    Alert.alert(
      cat.label,
      `Browse ${cat.productCount} products in "${cat.label}" from ${store.name}.\n(Product listing screen coming soon.)`,
    );
  }

  function handleSearchSubmit() {
    if (!productSearch.trim()) return;
    Alert.alert(
      "Search",
      `Searching "${productSearch}" in ${store.name}.\n(Product search results coming soon.)`,
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>

      {/* ── Back button floating over hero ── */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: "rgba(0,0,0,0.35)" }]}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, {
          color:      "#fff",
          fontFamily: typography.fontFamily.semiBold,
          fontSize:   typography.size.md,
        }]}
          numberOfLines={1}
        >
          {store.name}
        </Text>

        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: "rgba(0,0,0,0.35)" }]}
          activeOpacity={0.8}
          onPress={() => Alert.alert("Share", "Share store link coming soon.")}
        >
          <Ionicons name="share-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Hero banner ── */}
        <StoreHeroBanner store={store} />

        {/* ── Store name, address, status ── */}
        <StoreInfoHeader store={store} />

        {/* ── Action tiles ── */}
        <StoreActionButtons
          store={store}
          onDirections={handleDirections}
          onBookRide={handleBookRide}
        />

        {/* ── Product search bar ── */}
        <StoreProductSearch
          value={productSearch}
          onChange={setProductSearch}
          onClear={() => setProductSearch("")}
          onSubmit={handleSearchSubmit}
        />

        {/* ── Opening hours ── */}
        <StoreHoursCard hours={store.hours} />

        {/* ── Contact info ── */}
        <StoreContactCard store={store} />

        {/* ── Product categories ── */}
        <StoreProductCategories
          categories={store.categories}
          storeColor={store.heroBg}
          query={productSearch}
          onSelect={handleCategorySelect}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // ── Floating header bar overlaid on hero ──
  headerBar: {
    position:          "absolute",
    top:               0,
    left:              0,
    right:             0,
    zIndex:            20,
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 14,
    paddingTop:        12,
    paddingBottom:     8,
  },
  backBtn: {
    width:          36,
    height:         36,
    borderRadius:   18,
    alignItems:     "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex:      1,
    textAlign: "center",
    marginHorizontal: 8,
  },

  // ── Scroll content ──
  content: {
    paddingBottom: 40,
    gap:           16,
  },
});
