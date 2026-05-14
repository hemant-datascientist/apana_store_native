// ============================================================
// STORE PRODUCTS SCREEN — Apana Store (Customer App)
//
// Full-screen product listing with horizontal category tabs.
// ============================================================

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { getStoreById, DEFAULT_STORE_ID, StoreProductCategory } from "../../data/storeDetailData";
import StoreProductSearch from "../../components/store/StoreProductSearch";

export default function StoreCategoriesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const store = getStoreById(id ?? DEFAULT_STORE_ID);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const tabs = [{ key: "all", label: "All Items" }, ...store.categories];

  // Placeholder for actual product rendering
  const renderProductPlaceholder = ({ item, index }: { item: any, index: number }) => (
    <View style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.productImagePlaceholder, { backgroundColor: store.heroBg + "22" }]}>
        <Ionicons name="cube-outline" size={32} color={store.heroBg} />
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]} numberOfLines={2}>
          {item.categoryLabel} Product {index + 1}
        </Text>
        <Text style={[styles.productPrice, { color: store.heroBg, fontFamily: typography.fontFamily.bold }]}>
          ₹{Math.floor(Math.random() * 500) + 50}
        </Text>
        <TouchableOpacity style={[styles.addBtn, { borderColor: store.heroBg }]}>
          <Text style={{ color: store.heroBg, fontFamily: typography.fontFamily.semiBold, fontSize: 12 }}>ADD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Generate some dummy products based on selected tab
  const getDummyProducts = () => {
    let products = [];
    if (selectedCategory === "all") {
      store.categories.forEach(cat => {
        for(let i=0; i<4; i++) {
          products.push({ id: `${cat.key}-${i}`, categoryLabel: cat.label });
        }
      });
    } else {
      const cat = store.categories.find(c => c.key === selectedCategory);
      for(let i=0; i<10; i++) {
        products.push({ id: `${selectedCategory}-${i}`, categoryLabel: cat?.label || "Item" });
      }
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      products = products.filter(p => p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) || `product ${p.id}`.includes(searchQuery.toLowerCase()));
    }
    return products;
  };

  const products = getDummyProducts();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: store.heroBg }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: "#fff", fontFamily: typography.fontFamily.bold }]}>
            {store.name}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Ionicons name="bag-handle-outline" size={22} color="#fff" />
        </View>
      </View>

      {/* ── Search Bar (Seamless with Header) ── */}
      <View style={{ backgroundColor: store.heroBg, paddingBottom: 16, paddingTop: 4 }}>
        <StoreProductSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
          onSubmit={() => {}}
        />
      </View>

      {/* ── Horizontal Category Tabs ── */}
      <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {tabs.map((tab) => {
            const isSelected = selectedCategory === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabBtn,
                  isSelected && { backgroundColor: store.heroBg, borderColor: store.heroBg },
                  !isSelected && { backgroundColor: colors.card, borderColor: colors.border }
                ]}
                onPress={() => setSelectedCategory(tab.key)}
              >
                <Text style={[
                  styles.tabText,
                  { fontFamily: isSelected ? typography.fontFamily.bold : typography.fontFamily.medium },
                  isSelected ? { color: "#fff" } : { color: colors.subText }
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Products Grid ── */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProductPlaceholder}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
              No items found.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 8,
  },
  headerTitleWrap: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
  },
  headerRight: {
    padding: 8,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  tabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 13,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  columnWrapper: {
    gap: 16,
  },
  productCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  productImagePlaceholder: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: {
    padding: 12,
    gap: 6,
  },
  productName: {
    fontSize: 13,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 14,
  },
  addBtn: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
    paddingVertical: 6,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 15,
  },
});
