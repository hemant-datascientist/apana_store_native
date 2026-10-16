// ============================================================
// STORE PRODUCTS — the shop's REAL catalogue, filterable by APC category.
//
// 🔴 THIS SCREEN USED TO INVENT ITS OWN STOCK.
//
// It ran on getStoreById() (bundled demo data) and a getDummyProducts()
// helper that generated rows called "Personal Care Product 1..4" priced with
// `Math.random()`. A customer opening a real shop's category saw fabricated
// items at fabricated prices, and the two entry points into it — the store
// page's category rows and its search box — were Alert popups saying
// "Product listing screen coming soon."
//
// It now reads the same live catalogue the store page already loaded
// (useStoreCatalog → GET /customer/catalog/stores/:id/products), so what is
// listed here is exactly what the seller listed, at the price they set.
//
// Params:
//   id  — the store
//   cat — optional APC category key to pre-select
//   q   — optional search term to pre-fill
// ============================================================

import React, { useMemo, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { goBackOr } from "../../lib/goBack";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { useStoreCatalog } from "../../hooks/useStoreCatalog";
import type { LiveProduct } from "../../services/liveCatalogService";
import StateView from "../../components/ui/StateView";
import { SkeletonList } from "../../components/ui/Skeleton";
import StoreProductSearch from "../../components/store/StoreProductSearch";
import ApcGridCard from "../../components/category/ApcGridCard";
import { useLiveProductCart } from "../../hooks/useLiveProductCart";

export default function StoreCategoriesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id, cat, q } = useLocalSearchParams<{ id?: string; cat?: string; q?: string }>();

  const live = useStoreCatalog(id);
  const cartOps = useLiveProductCart();

  const [searchQuery, setSearchQuery] = useState(q ?? "");
  const [selectedCategory, setSelectedCategory] = useState<string>(cat ?? "all");

  // Every hook runs before any early return — a bail-out between hooks is the
  // "Rendered more hooks than during the previous render" crash fixed in
  // RevenueChart, and this screen has exactly the same empty-first shape.
  const tabs = useMemo(
    () => [{ key: "all", label: "All items" }, ...live.categories.map((c) => ({ key: c.key, label: c.label }))],
    [live.categories],
  );

  const products = useMemo<LiveProduct[]>(() => {
    const inCategory =
      selectedCategory === "all"
        ? live.products
        : (live.categories.find((c) => c.key === selectedCategory)?.products ?? []);
    const term = searchQuery.trim().toLowerCase();
    if (!term) return inCategory;
    return inCategory.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.brand ?? "").toLowerCase().includes(term),
    );
  }, [live.products, live.categories, selectedCategory, searchQuery]);

  const heroColor = colors.primary;

  if (live.loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={{ padding: 16 }}><SkeletonList count={6} variant="row" /></View>
      </SafeAreaView>
    );
  }

  // A store we could not load is an error, not an empty shop.
  if (!live.meta) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <StateView
          variant="error"
          title="Couldn't load this store"
          message="We couldn't reach the server. Check your connection and try again."
          actionLabel="Try again"
          onAction={live.reload}
        />
      </SafeAreaView>
    );
  }

  // Same card + add/stepper as the category screens, so a shop's own page can
  // put items in the cart (it used to show prices with no way to buy).
  const renderProduct = ({ item }: { item: LiveProduct }) => (
    <View style={styles.cell}>
      <ApcGridCard
        product={item}
        qty={cartOps.qtyOf(item)}
        onOpen={() => router.push(`/live-product-detail?id=${item.id}` as never)}
        onAdd={() => cartOps.add(item)}
        onInc={() => cartOps.inc(item)}
        onDec={() => cartOps.dec(item)}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      <View style={[styles.header, { backgroundColor: heroColor }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => goBackOr()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text numberOfLines={1} style={styles.headerTitle}>{live.meta.name}</Text>
        </View>
      </View>

      <View style={{ backgroundColor: heroColor, paddingBottom: 16, paddingTop: 4 }}>
        <StoreProductSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
          onSubmit={() => {}}
        />
      </View>

      {/* One tab per category the shop ACTUALLY has — no fixed list, so a
          kirana with three shelves shows three tabs, not twenty empty ones. */}
      {tabs.length > 1 && (
        <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {tabs.map((tab) => {
              const on = selectedCategory === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tabBtn,
                    on
                      ? { backgroundColor: heroColor, borderColor: heroColor }
                      : { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                  onPress={() => setSelectedCategory(tab.key)}
                >
                  <Text style={[styles.tabText, { color: on ? "#fff" : colors.subText }]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          // "empty", not "error": the request succeeded and this shop simply
          // has nothing matching. A retry would change nothing, so none offered.
          <StateView
            variant="empty"
            title={searchQuery.trim() ? "Nothing matches that" : "No items here yet"}
            message={
              searchQuery.trim()
                ? `This shop has nothing matching "${searchQuery.trim()}".`
                : "This shop hasn't listed anything in this section yet."
            }
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 12 },
  backBtn: { padding: 8 },
  headerTitleWrap: { flex: 1, paddingHorizontal: 12 },
  headerTitle: { fontSize: 18, color: "#fff", fontFamily: typography.fontFamily.bold },
  tabsContainer: { borderBottomWidth: 1, paddingVertical: 12 },
  tabsScroll: { paddingHorizontal: 16, gap: 8 },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  tabText: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs },
  listContent: { padding: 12, paddingBottom: 32 },
  columnWrapper: { gap: 12 },
  cell: { flex: 1, maxWidth: "50%", marginBottom: 12 },
});
