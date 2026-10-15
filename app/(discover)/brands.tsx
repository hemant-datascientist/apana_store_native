// ============================================================
// BRANDS SCREEN — Apana Store
//
// Brands that shops near the customer actually stock — GET /catalog/brands,
// grouped from live shelves, with how many products and shops carry each.
// It used to be a bundled list of famous companies (Amul, Britannia…) with no
// shop behind them; tapping one searched for something nobody nearby sold.
//
// Tapping a brand runs the real product search, which matches the brand.
// Empty is shown as empty (§19.8): no shops near you yet = no brands.
// ============================================================

import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, StatusBar, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { goBackOr } from "../../lib/goBack";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { useNearbyBrands } from "../../hooks/useNearbyBrands";
import type { NearbyBrand } from "../../services/liveCatalogService";
import BrandsSearchBar from "../../components/brands/BrandsSearchBar";
import BrandCard from "../../components/brands/BrandCard";
import StateView from "../../components/ui/StateView";
import { SkeletonList } from "../../components/ui/Skeleton";

export default function BrandsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { brands, loading, failed, reload } = useNearbyBrands();
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? brands.filter((b) => b.name.toLowerCase().includes(q)) : brands;
  }, [brands, query]);

  function open(brand: NearbyBrand) {
    router.push(`/search-results?q=${encodeURIComponent(brand.name)}` as never);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <SafeAreaView style={[styles.header, { backgroundColor: colors.primary }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => goBackOr()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.white }]}>Brands</Text>
            <Text style={[styles.headerSub, { color: colors.white }]}>Stocked by shops near you</Text>
          </View>
          <View style={styles.backBtn} />
        </View>
      </SafeAreaView>

      <View style={styles.searchWrap}>
        <BrandsSearchBar value={query} onChange={setQuery} />
      </View>

      {loading ? (
        <SkeletonList count={6} />
      ) : failed ? (
        <StateView variant="error" onAction={reload} />
      ) : brands.length === 0 ? (
        <StateView
          variant="empty"
          title="No brands near you yet"
          message="As shops near you list branded products, they'll appear here."
        />
      ) : (
        <FlatList
          data={shown}
          keyExtractor={(b) => b.name}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={[styles.count, { color: colors.subText }]}>
              {shown.length === 0 ? `No brand matches "${query}"` : `${shown.length} brand${shown.length === 1 ? "" : "s"}`}
            </Text>
          }
          renderItem={({ item }) => <BrandCard brand={item} onPress={() => open(item)} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingBottom: 12 },
  headerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 6 },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl },
  headerSub: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs, opacity: 0.85 },
  searchWrap: { paddingTop: 12 },
  list: { padding: 16, paddingTop: 4, gap: 12 },
  row: { gap: 12 },
  count: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs, marginBottom: 8 },
});
