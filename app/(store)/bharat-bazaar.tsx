// ============================================================
// BHARAT BAZAAR SCREEN — Apana Store (National Explorer Feed)
//
// Amazon/Flipkart-style national e-commerce feed.
// Users can explore traditional handlooms, GI crafts, native spices,
// homegrown brands, and tech products sourced from all Indian states.
//
// Features:
//   - Header with search & filters
//   - National Hero Promo Banners
//   - Horizontal Region / State quick selector (tabs)
//   - Hot Categories (e.g. Sarees, Tea, Woodcraft, Spices, Toys)
//   - Grid display of catalog items from all over India with State badges
// ============================================================

import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, StatusBar, Alert, Dimensions, FlatList, TextInput
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

// Sourced mock items representing different states across India
interface BazaarProduct {
  id: string;
  name: string;
  originState: string;
  stateKey: string;
  price: number;
  rating: number;
  reviews: number;
  deliveryDays: number;
  category: string;
  imageIcon: string;
  bgColor: string;
  badge?: string;
}

const BAZAAR_PRODUCTS: BazaarProduct[] = [
  {
    id: "bp1",
    name: "Sambalpuri Ikat Handwoven Saree",
    originState: "Odisha",
    stateKey: "odisha",
    price: 4999,
    rating: 4.9,
    reviews: 128,
    deliveryDays: 4,
    category: "Fashion & Handlooms",
    imageIcon: "shirt-outline",
    bgColor: "#FCE7F3",
    badge: "GI Tagged",
  },
  {
    id: "bp2",
    name: "Temi First Flush Organic Green Tea",
    originState: "Sikkim",
    stateKey: "sikkim",
    price: 550,
    rating: 4.8,
    reviews: 243,
    deliveryDays: 3,
    category: "Groceries & Tea",
    imageIcon: "cafe-outline",
    bgColor: "#DCFCE7",
    badge: "100% Organic",
  },
  {
    id: "bp3",
    name: "Authentic Kolhapuri Leather Chappals",
    originState: "Maharashtra",
    stateKey: "maharashtra",
    price: 899,
    rating: 4.6,
    reviews: 580,
    deliveryDays: 2,
    category: "Footwear",
    imageIcon: "walk-outline",
    bgColor: "#FEF3C7",
    badge: "Handcrafted",
  },
  {
    id: "bp4",
    name: "Amritsari Phulkari Dupatta",
    originState: "Punjab",
    stateKey: "punjab",
    price: 1250,
    rating: 4.7,
    reviews: 94,
    deliveryDays: 3,
    category: "Fashion & Handlooms",
    imageIcon: "shirt-outline",
    bgColor: "#EDE9FE",
    badge: "Famous",
  },
  {
    id: "bp5",
    name: "Kanchipuram Silk Bridal Saree",
    originState: "Tamil Nadu",
    stateKey: "tamilnadu",
    price: 12000,
    rating: 5.0,
    reviews: 84,
    deliveryDays: 5,
    category: "Fashion & Handlooms",
    imageIcon: "gift-outline",
    bgColor: "#FFEDD5",
    badge: "Royal Loom",
  },
  {
    id: "bp6",
    name: "Wayanad Cardamom & Spices Jar",
    originState: "Kerala",
    stateKey: "kerala",
    price: 450,
    rating: 4.7,
    reviews: 198,
    deliveryDays: 3,
    category: "Groceries & Tea",
    imageIcon: "flame-outline",
    bgColor: "#FEE2E2",
  },
  {
    id: "bp7",
    name: "Monpa Handmade Bamboo Paper Notebook",
    originState: "Arunachal Pradesh",
    stateKey: "arunachal",
    price: 399,
    rating: 4.8,
    reviews: 42,
    deliveryDays: 4,
    category: "Stationery & Crafts",
    imageIcon: "document-text-outline",
    bgColor: "#DBEAFE",
    badge: "Eco-Friendly",
  },
  {
    id: "bp8",
    name: "Kashmiri Hand-Knotted Silk Rug",
    originState: "Jammu & Kashmir",
    stateKey: "jk",
    price: 28500,
    rating: 4.9,
    reviews: 19,
    deliveryDays: 7,
    category: "Home & Decor",
    imageIcon: "layers-outline",
    badge: "Heritage",
    bgColor: "#F3E8FF",
  }
];

const CATEGORIES = [
  { id: "all", label: "All Items", icon: "grid-outline" },
  { id: "looms", label: "Handlooms & Wear", icon: "shirt-outline" },
  { id: "foods", label: "Regional Flavours", icon: "fast-food-outline" },
  { id: "crafts", label: "Heritage Crafts", icon: "hammer-outline" },
  { id: "wellness", label: "Herbal & Spices", icon: "leaf-outline" },
];

const REGIONS = [
  { id: "all", label: "All Regions" },
  { id: "north", label: "North India" },
  { id: "south", label: "South India" },
  { id: "east", label: "East India" },
  { id: "west", label: "West India" },
  { id: "northeast", label: "North East" },
];

const { width: SW } = Dimensions.get("window");
const CARD_W = (SW - 40) / 2; // 2 column layout with padding

export default function BharatBazaarScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState<BazaarProduct[]>(BAZAAR_PRODUCTS);

  useEffect(() => {
    let result = BAZAAR_PRODUCTS;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.originState.toLowerCase().includes(q)
      );
    }

    // Category filter logic helper
    if (selectedCat !== "all") {
      if (selectedCat === "looms") {
        result = result.filter(p => p.category === "Fashion & Handlooms" || p.category === "Footwear");
      } else if (selectedCat === "foods") {
        result = result.filter(p => p.category === "Groceries & Tea");
      } else if (selectedCat === "crafts") {
        result = result.filter(p => p.category === "Stationery & Crafts" || p.category === "Home & Decor");
      } else if (selectedCat === "wellness") {
        result = result.filter(p => p.category.includes("Spices") || p.imageIcon === "flame-outline");
      }
    }

    // Region filter mapping
    if (selectedRegion !== "all") {
      if (selectedRegion === "north") {
        result = result.filter(p => ["punjab", "jk", "delhi", "haryana"].includes(p.stateKey));
      } else if (selectedRegion === "south") {
        result = result.filter(p => ["kerala", "tamilnadu", "karnataka", "ap"].includes(p.stateKey));
      } else if (selectedRegion === "east") {
        result = result.filter(p => ["odisha", "bihar", "westbengal"].includes(p.stateKey));
      } else if (selectedRegion === "west") {
        result = result.filter(p => ["maharashtra", "gujarat", "rajasthan"].includes(p.stateKey));
      } else if (selectedRegion === "northeast") {
        result = result.filter(p => ["sikkim", "arunachal", "assam"].includes(p.stateKey));
      }
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCat, selectedRegion]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />

      {/* ── HEADER ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
              Bharat Bazaar
            </Text>
            <Text style={[styles.headerSub, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
              National Artisanal Feed
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.cartBtn, { backgroundColor: colors.primary + "12" }]}
            onPress={() => router.push("/(tabs)/cart" as any)}
          >
            <Ionicons name="cart-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBox, { backgroundColor: isDark ? "#2A2A2A" : "#F1F5F9", borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={18} color={colors.subText} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text, fontFamily: typography.fontFamily.regular }]}
              placeholder="Search products, crafts or states..."
              placeholderTextColor={colors.subText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={16} color={colors.subText} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── PROMO BANNER ── */}
        <View style={[styles.promoCard, { backgroundColor: colors.primary }]}>
          <View style={styles.promoTextCol}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeTxt}>DIRECT FROM ARTISANS</Text>
            </View>
            <Text style={[styles.promoTitle, { fontFamily: typography.fontFamily.bold }]}>
              Vocal for Local
            </Text>
            <Text style={[styles.promoSubtitle, { fontFamily: typography.fontFamily.regular }]}>
              Support local handloom weavers and regional agricultural startups.
            </Text>
          </View>
          <Ionicons name="globe" size={80} color="rgba(255,255,255,0.15)" style={styles.promoWatermark} />
        </View>

        {/* ── REGION FILTERS ── */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionScroll}>
            {REGIONS.map(r => {
              const active = selectedRegion === r.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.regionChip,
                    active 
                      ? { backgroundColor: colors.primary, borderColor: colors.primary } 
                      : { backgroundColor: colors.card, borderColor: colors.border }
                  ]}
                  onPress={() => setSelectedRegion(r.id)}
                >
                  <Text 
                    style={[
                      styles.regionLabel, 
                      { 
                        fontFamily: active ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                        color: active ? "#fff" : colors.text 
                      }
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── CATEGORY CAROUSEL ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
            Explore Categories
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
            {CATEGORIES.map(c => {
              const active = selectedCat === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.catCard,
                    active ? { backgroundColor: colors.primary + "18", borderColor: colors.primary } : { backgroundColor: colors.card, borderColor: colors.border }
                  ]}
                  onPress={() => setSelectedCat(c.id)}
                >
                  <View style={[styles.catIconContainer, { backgroundColor: active ? colors.primary : colors.border }]}>
                    <Ionicons name={c.icon as any} size={18} color={active ? "#fff" : colors.text} />
                  </View>
                  <Text style={[styles.catLabel, { color: colors.text, fontFamily: typography.fontFamily.medium }]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── PRODUCT GRID ── */}
        <View style={styles.gridSection}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, marginBottom: 12 }]}>
            Trending Sourced Products
          </Text>

          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={48} color={colors.subText} />
              <Text style={[styles.emptyTxt, { color: colors.text, fontFamily: typography.fontFamily.medium }]}>
                No products found matching filters
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {filteredProducts.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                  activeOpacity={0.8}
                  onPress={() => router.push({
                    pathname: "/(store)/state-detail",
                    params: { stateKey: item.stateKey, name: item.originState, storesLive: "3" }
                  } as any)}
                >
                  {/* Image Area */}
                  <View style={[styles.productImageArea, { backgroundColor: item.bgColor }]}>
                    <Ionicons name={item.imageIcon as any} size={42} color="rgba(0,0,0,0.18)" />
                    
                    {/* Origin Badge */}
                    <View style={styles.originBadge}>
                      <Ionicons name="location" size={10} color="#fff" />
                      <Text style={styles.originText}>{item.originState}</Text>
                    </View>

                    {item.badge && (
                      <View style={[styles.tagBadge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.tagText}>{item.badge}</Text>
                      </View>
                    )}
                  </View>

                  {/* Info Area */}
                  <View style={styles.productInfo}>
                    <Text numberOfLines={2} style={[styles.productName, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                      {item.name}
                    </Text>
                    
                    {/* Rating row */}
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={[styles.ratingTxt, { color: colors.text, fontFamily: typography.fontFamily.medium }]}>
                        {item.rating.toFixed(1)}
                      </Text>
                      <Text style={[styles.reviewsTxt, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                        ({item.reviews})
                      </Text>
                    </View>

                    <View style={styles.priceRow}>
                      <View>
                        <Text style={[styles.priceTxt, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>
                          ₹{item.price.toLocaleString("en-IN")}
                        </Text>
                        <Text style={[styles.deliveryTxt, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                          Delivery in {item.deliveryDays} days
                        </Text>
                      </View>
                      
                      <TouchableOpacity
                        style={[styles.addBtn, { backgroundColor: colors.primary }]}
                        onPress={() => Alert.alert("Added to Cart", `${item.name} from ${item.originState} has been added.`)}
                      >
                        <Ionicons name="add" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 22,
  },
  headerSub: {
    fontSize: 11,
    lineHeight: 14,
  },
  cartBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  scroll: {
    paddingBottom: 24,
  },

  // Promo card
  promoCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  promoTextCol: {
    flex: 1,
    zIndex: 2,
    gap: 6,
  },
  promoBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  promoBadgeTxt: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  promoTitle: {
    color: "#fff",
    fontSize: 20,
  },
  promoSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    lineHeight: 16,
  },
  promoWatermark: {
    position: "absolute",
    right: -15,
    bottom: -15,
    zIndex: 1,
  },

  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 15,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  // Region chips
  regionScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  regionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  regionLabel: {
    fontSize: 12.5,
  },

  // Category list
  catScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  catCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 8,
  },
  catIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  catLabel: {
    fontSize: 11.5,
  },

  // Grid
  gridSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  productCard: {
    width: CARD_W,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 8,
  },
  productImageArea: {
    width: "100%",
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  originBadge: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  originText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  tagBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    color: "#fff",
    fontSize: 8.5,
    fontWeight: "bold",
  },
  productInfo: {
    padding: 10,
    gap: 4,
  },
  productName: {
    fontSize: 12,
    lineHeight: 16,
    height: 32,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingTxt: {
    fontSize: 10.5,
  },
  reviewsTxt: {
    fontSize: 9.5,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  priceTxt: {
    fontSize: 14,
  },
  deliveryTxt: {
    fontSize: 8.5,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 8,
    width: "100%",
  },
  emptyTxt: {
    fontSize: 13,
  },
});
