// ============================================================
// SEARCH RESULTS SCREEN — Apana Store (Customer App)
//
// Global search across all products and stores.
//
// Route: /search-results?q=<query>
//
// Flow:
//   URL ?q=<query> → debounced (350 ms) fetchSearchResults()
//   → loading spinner → Products grid or Stores list
//
// Backend: GET /search?q=<query>&sort=<sort>
//   Swap fetchSearchResults() stub with real fetch — no screen changes.
//
// Layout:
//   ┌──────────────────────────┐  ← grouped toolbar (one surface,
//   │ Header (back + input)    │    one bottom divider, subtle
//   │ Products | Stores tabs   │    elevation)
//   │ Sort chips               │
//   └──────────────────────────┘
//   Content (loading / error / empty / grid / list)
// ============================================================

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  View, ScrollView, ActivityIndicator,
  Text, TouchableOpacity, StyleSheet, StatusBar, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";

import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import {
  fetchSearchResults,
  SearchProductResult,
  SearchStoreResult,
  SearchSort,
} from "../../services/searchService";

import SearchResultsHeader from "../../components/search-results/SearchResultsHeader";
import SearchResultsTabs, { SearchTab } from "../../components/search-results/SearchResultsTabs";
import SearchSortBar       from "../../components/search-results/SearchSortBar";
import SearchProductCard   from "../../components/search-results/SearchProductCard";
import SearchStoreCard     from "../../components/search-results/SearchStoreCard";
import SearchEmptyState    from "../../components/search-results/SearchEmptyState";

// Debounce delay before firing the search service call
const DEBOUNCE_MS = 350;

export default function SearchResultsScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();

  // ── URL param — initial query ─────────────────────────────
  const { q: qParam = "" } = useLocalSearchParams<{ q?: string }>();

  // ── Local state ───────────────────────────────────────────
  const [query,    setQuery]    = useState(decodeURIComponent(qParam));
  const [tab,      setTab]      = useState<SearchTab>("products");
  const [sort,     setSort]     = useState<SearchSort>("relevance");

  // ── Results state (driven by the service) ─────────────────
  const [products, setProducts] = useState<SearchProductResult[]>([]);
  const [stores,   setStores]   = useState<SearchStoreResult[]>([]);
  // Start in loading state if we already have a query — otherwise
  // the empty state would briefly flash during the debounce window.
  const [loading,  setLoading]  = useState(qParam.trim().length > 0);
  const [fetchErr, setFetchErr] = useState<string | null>(null);

  // ── Debounced search — fires on query or sort change ──────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback((q: string, s: SearchSort) => {
    // Blank query → clear results immediately, no network call
    if (!q.trim()) {
      setProducts([]);
      setStores([]);
      setLoading(false);
      setFetchErr(null);
      return;
    }

    setLoading(true);
    setFetchErr(null);

    let cancelled = false;

    fetchSearchResults({ query: q, sort: s })
      .then(res => {
        if (!cancelled) {
          setProducts(res.products);
          setStores(res.stores);
        }
      })
      .catch(err => {
        if (!cancelled) setFetchErr(err?.message ?? "Search failed. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query, sort), DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, sort, runSearch]);

  // ── Handlers ─────────────────────────────────────────────
  const handleProductPress = useCallback((id: string) => {
    router.push(`/product-detail?id=${id}` as any);
  }, [router]);

  const handleStorePress = useCallback((id: string) => {
    router.push(`/store-detail?id=${id}` as any);
  }, [router]);

  const handleAddCart = useCallback(() => {
    Alert.alert("Added", "Item added to cart.");
  }, []);

  const handleDirection = useCallback(() => {
    Alert.alert("Directions", "Mappls navigation coming soon.");
  }, []);

  const handleSuggestion = useCallback((s: string) => {
    setQuery(s);
    setTab("products");
  }, []);

  const handleRetry = useCallback(() => {
    runSearch(query, sort);
  }, [query, sort, runSearch]);

  // ── Product 2-column rows ─────────────────────────────────
  const productRows = useMemo(() => {
    const rows: SearchProductResult[][] = [];
    for (let i = 0; i < products.length; i += 2) rows.push(products.slice(i, i + 2));
    return rows;
  }, [products]);

  // ── Content state flags ───────────────────────────────────
  const isBlankQuery = query.trim().length === 0;
  const hasResults   = tab === "products" ? products.length > 0 : stores.length > 0;
  const showEmpty    = !loading && !fetchErr && !hasResults;

  // ── Render ────────────────────────────────────────────────
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />

      {/* ── Toolbar (single grouped surface) ── */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.card }}>
        <View style={[styles.toolbar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <SearchResultsHeader
            query={query}
            onChangeQuery={setQuery}
            onBack={() => router.back()}
          />
          <SearchResultsTabs
            activeTab={tab}
            onSelect={setTab}
            productCount={products.length}
            storeCount={stores.length}
          />
          <SearchSortBar activeSort={sort} onSelect={setSort} />
        </View>
      </SafeAreaView>

      {/* ── Loading state ── */}
      {loading && (
        <View style={styles.centred}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
            Searching for "{query.trim()}"…
          </Text>
        </View>
      )}

      {/* ── Error state ── */}
      {!loading && !!fetchErr && (
        <View style={styles.centred}>
          <Ionicons name="warning-outline" size={36} color={colors.danger} />
          <Text style={[styles.errTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            Search Failed
          </Text>
          <Text style={[styles.errSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
            {fetchErr}
          </Text>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            onPress={handleRetry}
            activeOpacity={0.85}
          >
            <Ionicons name="refresh-outline" size={15} color="#fff" />
            <Text style={[styles.retryText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Empty / suggestion state ── */}
      {showEmpty && (
        <ScrollView
          contentContainerStyle={styles.emptyScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SearchEmptyState
            query={isBlankQuery ? "" : query}
            onSuggestion={handleSuggestion}
          />
        </ScrollView>
      )}

      {/* ── Products 2-column grid ── */}
      {!loading && !fetchErr && tab === "products" && products.length > 0 && (
        <ScrollView
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {productRows.map((row, ri) => (
            <View key={ri} style={styles.gridRow}>
              {row.map(p => (
                <View key={p.id} style={styles.gridCell}>
                  <SearchProductCard
                    product={p}
                    onPress={() => handleProductPress(p.id)}
                    onAddCart={handleAddCart}
                  />
                </View>
              ))}
              {/* Pad the last odd row so a single card doesn't stretch */}
              {row.length === 1 && <View style={styles.gridCell} />}
            </View>
          ))}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      {/* ── Stores list ── */}
      {!loading && !fetchErr && tab === "stores" && stores.length > 0 && (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {stores.map(s => (
            <SearchStoreCard
              key={s.id}
              store={s}
              onPress={() => handleStorePress(s.id)}
              onDirection={handleDirection}
            />
          ))}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Toolbar — only surface with a bottom divider + subtle shadow.
  // All sub-toolbars (header, tabs, sort) are now border-less so
  // the whole group reads as one card instead of three stripes.
  toolbar: {
    borderBottomWidth: 1,
    // Elevation / shadow for a soft lift under the toolbar.
    shadowColor:   "#000",
    shadowOpacity: 0.04,
    shadowRadius:  6,
    shadowOffset:  { width: 0, height: 2 },
    elevation:     2,
  },

  // Loading / error
  centred: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
    gap:            10,
    padding:        32,
  },
  loadingText: { marginTop: 4, textAlign: "center" },
  errTitle:    {},
  errSub:      { textAlign: "center", lineHeight: 20 },

  // Retry button — matches the pattern used by MapViewFeed
  retryBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    paddingHorizontal: 20,
    paddingVertical:   10,
    borderRadius:      10,
    marginTop:         4,
  },
  retryText: { color: "#fff" },

  // Grid layout
  gridContent: {
    padding: 16,
    gap:     10,
  },
  gridRow: {
    flexDirection: "row",
    gap:           10,
  },
  gridCell: { flex: 1 },

  // List layout
  listContent: {
    paddingTop:    12,
    paddingBottom: 20,
  },

  // Empty state scroll
  emptyScroll: { flexGrow: 1 },

  bottomSpacer: { height: 20 },
});
