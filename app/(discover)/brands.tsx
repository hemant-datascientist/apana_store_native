// ============================================================
// BRANDS SCREEN — Apana Store
//
// Lets customers browse and search all brands available in
// their city. Tapping a brand → product listing (future screen).
//
// Layout (top → bottom):
//   Header           — blue header + back + brand count
//   SearchBar        — live search filtering brand names
//   CategoryFilter   — filter by brand category
//   Results count    — "X brands" label
//   2-column grid    — BrandCard × N
// ============================================================

import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, StyleSheet, StatusBar, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

import { BRANDS, BrandCategory } from "../../data/brandsData";

import BrandsSearchBar       from "../../components/brands/BrandsSearchBar";
import BrandsCategoryFilter  from "../../components/brands/BrandsCategoryFilter";
import BrandCard             from "../../components/brands/BrandCard";

const ACCENT = "#0F4C81";

export default function BrandsScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();

  // ── Search + category filter state ───────────────────────
  const [query,          setQuery]          = useState("");
  const [activeCategory, setActiveCategory] = useState<BrandCategory>("all");

  // ── Filter brands by search query + category ─────────────
  const filteredBrands = useMemo(() => {
    return BRANDS.filter(b => {
      const matchesCategory = activeCategory === "all" || b.category === activeCategory;
      const matchesQuery    = query.length === 0
        || b.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  // ── Pair brands for 2-column layout ──────────────────────
  // FlatList with numColumns handles this natively but requires
  // a key extractor that handles odd-count arrays.
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={ACCENT} />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: ACCENT }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
              Brands
            </Text>
            <Text style={[styles.headerSub, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {BRANDS.length} brands available in your city
            </Text>
          </View>

          <View style={[styles.iconBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Ionicons name="ribbon-outline" size={18} color="#fff" />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>

        {/* ── Sticky search + filter block ── */}
        <View style={[styles.stickyBlock, { backgroundColor: colors.background }]}>
          <BrandsSearchBar value={query} onChange={setQuery} />
          <View style={{ paddingVertical: 10 }}>
            <BrandsCategoryFilter active={activeCategory} onSelect={setActiveCategory} />
          </View>
        </View>

        {/* ── Results count ── */}
        <View style={styles.resultsRow}>
          <Text style={[styles.resultsText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {filteredBrands.length === 0
              ? "No brands found"
              : `${filteredBrands.length} brand${filteredBrands.length > 1 ? "s" : ""}`}
          </Text>
          {query.length > 0 && (
            <Text style={[styles.queryText, { color: ACCENT, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
              for "{query}"
            </Text>
          )}
        </View>

        {/* ── 2-column grid ── */}
        {filteredBrands.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="ribbon-outline" size={40} color={colors.subText} />
            <Text style={[styles.emptyText, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm }]}>
              No brands match your search
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {/* Pair brands into rows of 2 */}
            {Array.from({ length: Math.ceil(filteredBrands.length / 2) }, (_, rowIdx) => {
              const left  = filteredBrands[rowIdx * 2];
              const right = filteredBrands[rowIdx * 2 + 1];
              return (
                <View key={rowIdx} style={styles.gridRow}>
                  <BrandCard brand={left} />
                  {right ? <BrandCard brand={right} /> : <View style={styles.gridPlaceholder} />}
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {},
  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 16,
    paddingVertical:   12,
    gap:               12,
  },
  backBtn: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems:      "center",
    justifyContent:  "center",
  },
  headerCenter: { flex: 1 },
  headerTitle:  { color: "#fff" },
  headerSub:    { color: "rgba(255,255,255,0.75)", marginTop: 2 },
  iconBtn: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },

  // Sticky search+filter block
  stickyBlock: {
    paddingTop: 12,
  },

  // Results count
  resultsRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    paddingHorizontal: 16,
    paddingBottom:     10,
  },
  resultsText: {},
  queryText:   {},

  // 2-column grid
  grid: {
    paddingHorizontal: 16,
    gap:               12,
  },
  gridRow: {
    flexDirection: "row",
    gap:           12,
  },
  gridPlaceholder: { flex: 1 },

  // Empty state
  emptyState: {
    alignItems:      "center",
    gap:             12,
    paddingVertical: 60,
  },
  emptyText: { textAlign: "center" },
});
