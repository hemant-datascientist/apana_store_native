// ============================================================
// BHARAT BAZAAR SCREEN — Apana Store (National Explorer Feed)
//
// A state-of-the-art Amazon/Flipkart inspired e-commerce marketplace.
// Fully customized with premium visual aesthetics:
//   1. **Premium Navigation Bar**: Sticky, sleek, centered search bar with micro-interactions,
//      profile, wishlist, and shopping cart badge notification.
//   2. **Hero Banner Section**: Bold typography, value proposition, micro-anim CTAs, and grid lifestyle placeholders.
//   3. **Product Filter Drawer**: Mobile-friendly sliding tray filter layout (Categories, Price Slider, Colors, Sizes).
//   4. **Interactive Product Grid**: 2-column e-commerce cards, rating stars, "Quick View" hover trigger overlay,
//      and dynamic add to bag action states.
//   5. **Micro-Interactions**: Native fluid visual feedback.
// ============================================================

import React, { useState, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Alert, Dimensions,
  TextInput, Modal, Animated
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

const { width: SW, height: SH } = Dimensions.get("window");
const CARD_W = Math.floor((SW - 38) / 2); // 2-column grid layout with margins

// Banners matching state-detail style
const NATIONAL_BANNERS = [
  { id: "b1", title: "Vocal for Local", subtitle: "Sourced directly from certified handloom weavers & local SMEs across states.", tag: "Artisanal Feed", bg: "#7C2D12", accent: "#FFEDD5", icon: "flag-outline" },
  { id: "b2", title: "Premium Organic Harvest", subtitle: "Authentic Temi tea, Wayanad Spices, and regional specialties.", tag: "GI Sourced", bg: "#065F46", accent: "#D1FAE5", icon: "leaf-outline" },
];

interface BazaarProduct {
  id: string;
  name: string;
  brand: string;
  unit: string;
  price: number;
  bg: string;
  icon: string;
  badge?: string;
  state: string;
  stateKey: string;
  rating: number;
  reviews: number;
}

const BAZAAR_PRODUCTS: BazaarProduct[] = [
  { id: "p1", name: "Bomkai Handloom Saree", brand: "Odisha Handlooms", unit: "Pure Silk · Odisha", price: 6500, bg: "#EDE9FE", icon: "shirt-outline", badge: "GI Tag", state: "Odisha", stateKey: "odisha", rating: 4.9, reviews: 148 },
  { id: "p2", name: "Temi Orthodox Tea", brand: "Temi Gardens", unit: "250g · Sikkim", price: 599, bg: "#DCFCE7", icon: "cafe-outline", badge: "Organic", state: "Sikkim", stateKey: "sikkim", rating: 4.8, reviews: 298 },
  { id: "p3", name: "Patiala Shahi Jutti", brand: "Royal Juttis", unit: "Leather · Punjab", price: 999, bg: "#FFEDD5", icon: "walk-outline", badge: "Famous", state: "Punjab", stateKey: "punjab", rating: 4.7, reviews: 412 },
  { id: "p4", name: "Amritsari Dupatta", brand: "Phulkari Virsa", unit: "Phulkari · Punjab", price: 1499, bg: "#FCE7F3", icon: "shirt-outline", badge: "Handmade", state: "Punjab", stateKey: "punjab", rating: 4.8, reviews: 88 },
  { id: "p5", name: "Pure Paithani Saree", brand: "Yeola Weavers", unit: "Yeola Silk · Maharashtra", price: 8500, bg: "#FCE7F3", icon: "shirt-outline", badge: "GI Tag", state: "Maharashtra", stateKey: "maharashtra", rating: 5.0, reviews: 62 },
  { id: "p6", name: "Kolhapuri Chappals", brand: "Kolhapur Craft", unit: "Handmade · Maharashtra", price: 899, bg: "#FFEDD5", icon: "walk-outline", badge: "Leather", state: "Maharashtra", stateKey: "maharashtra", rating: 4.6, reviews: 750 },
  { id: "p7", name: "Wayanad Cardamom Jar", brand: "Kerala Spices", unit: "Spice · Kerala", price: 450, bg: "#FEE2E2", icon: "flame-outline", badge: "Aromatic", state: "Kerala", stateKey: "kerala", rating: 4.7, reviews: 198 },
  { id: "p8", name: "Monpa Handmade Notebook", brand: "Monpa Crafts", unit: "A5 · Arunachal", price: 599, bg: "#EDE9FE", icon: "document-text-outline", badge: "Eco Craft", state: "Arunachal", stateKey: "arunachal", rating: 4.9, reviews: 54 }
];

const FILTER_CATEGORIES = ["All Categories", "Handlooms & Saree", "Organic Foods & Spices", "Traditional Crafts"];
const FILTER_COLORS = ["#BE185D", "#7C3AED", "#1E3A8A", "#15803D", "#F59E0B", "#EF4444"];
const FILTER_SIZES = ["S", "M", "L", "XL", "Free Size"];

export default function BharatBazaarScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  // Search & Navigation States
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(2);
  const [wishlistCount, setWishlistCount] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState<BazaarProduct | null>(null);

  // Filter Sidebar / Drawer State
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState(15000);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // Slide Animation for Drawer
  const slideAnim = useRef(new Animated.Value(-SW * 0.8)).current;

  function openFilters() {
    setFilterVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  function closeFilters() {
    Animated.timing(slideAnim, {
      toValue: -SW * 0.8,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setFilterVisible(false));
  }

  // Filter application
  const filteredProducts = BAZAAR_PRODUCTS.filter(p => {
    // Search
    if (search.trim() && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    // Category
    if (activeCategory !== "All Categories") {
      if (activeCategory === "Handlooms & Saree" && p.icon !== "shirt-outline") return false;
      if (activeCategory === "Organic Foods & Spices" && p.icon !== "cafe-outline" && p.icon !== "flame-outline") return false;
      if (activeCategory === "Traditional Crafts" && p.icon !== "document-text-outline" && p.icon !== "walk-outline") return false;
    }
    // Price
    if (p.price > priceRange) return false;
    return true;
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />

      {/* ── 1. PREMIUM STICKY NAVIGATION BAR ── */}
      <SafeAreaView style={[styles.navbar, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <View style={styles.navContent}>
          {/* Back button */}
          <TouchableOpacity style={styles.navBackBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Logo / Title */}
          <View style={styles.logoArea}>
            <Text style={[styles.logoTxt, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>
              BHARAT
            </Text>
            <Text style={[styles.logoSubTxt, { color: colors.text, fontFamily: typography.fontFamily.medium }]}>
              Bazaar
            </Text>
          </View>

          {/* Actions: Wishlist & Cart */}
          <View style={styles.navActions}>
            {/* Wishlist */}
            <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert("Wishlist", "Browse saved products.")}>
              <Ionicons name="heart-outline" size={22} color={colors.text} />
              {wishlistCount > 0 && (
                <View style={[styles.badge, { backgroundColor: "#EF4444" }]}>
                  <Text style={styles.badgeTxt}>{wishlistCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Shopping Cart */}
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/(tabs)/cart" as any)}>
              <Ionicons name="bag-handle-outline" size={22} color={colors.text} />
              {cartCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.badgeTxt}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Centered Search Bar with Micro-interactions */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBox, { backgroundColor: isDark ? "#2A2A2A" : "#F8FAFC", borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={18} color={colors.subText} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text, fontFamily: typography.fontFamily.regular }]}
              placeholder="Search premium silk, GI crafts, organic tea..."
              placeholderTextColor={colors.subText}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={16} color={colors.subText} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.filterTrigger} onPress={openFilters}>
              <Ionicons name="options-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* ── 2. HERO VALUE PROPOSITION BANNER ── */}
        <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
          <View style={styles.heroTextContent}>
            <View style={styles.premiumTag}>
              <Text style={[styles.premiumTagTxt, { fontFamily: typography.fontFamily.bold }]}>
                ★ NATIONAL DIRECT MARKETPLACE
              </Text>
            </View>
            <Text style={[styles.heroHeading, { fontFamily: typography.fontFamily.bold }]}>
              Heritage Sourced{"\n"}Just for You
            </Text>
            <Text style={[styles.heroSubHeading, { fontFamily: typography.fontFamily.regular }]}>
              Experience luxury, GI-tagged masterpieces direct from authentic state looms, certified craft clusters and startup hubs.
            </Text>

            {/* CTAs with Micro-interactions */}
            <View style={styles.heroCtas}>
              <TouchableOpacity 
                style={styles.heroPrimaryBtn}
                onPress={() => Alert.alert("National Catalog", "Opening curated heritage list...")}
              >
                <Text style={[styles.heroPrimaryBtnTxt, { fontFamily: typography.fontFamily.semiBold }]}>
                  Shop Heritage
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.heroSecondaryBtn}
                onPress={openFilters}
              >
                <Text style={[styles.heroSecondaryBtnTxt, { fontFamily: typography.fontFamily.semiBold }]}>
                  Filter Feed
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.heroImagePlaceholder}>
            <Ionicons name="image-outline" size={32} color="rgba(255,255,255,0.4)" />
            <Text style={styles.heroImageText}>Lifestyle Image Grid</Text>
          </View>
        </View>

        {/* ── 3. INTERACTIVE PRODUCT GRID ── */}
        <View style={styles.gridSection}>
          <View style={styles.gridHeader}>
            <Text style={[styles.gridTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
              Curated Masterpieces
            </Text>
            <Text style={[styles.gridSubtitle, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
              Showing {filteredProducts.length} unique treasures
            </Text>
          </View>

          <View style={styles.grid}>
            {filteredProducts.map(item => (
              <View key={item.id} style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                
                {/* 1. Image container with Quick View triggers */}
                <View style={[styles.imageContainer, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon as any} size={48} color="rgba(0,0,0,0.18)" />
                  
                  {/* Origin state tag */}
                  <View style={styles.stateTag}>
                    <Ionicons name="location" size={10} color="#fff" />
                    <Text style={styles.stateTagTxt}>{item.state}</Text>
                  </View>

                  {item.badge && (
                    <View style={[styles.badgeTag, { backgroundColor: colors.primary }]}>
                      <Text style={styles.badgeTagTxt}>{item.badge}</Text>
                    </View>
                  )}

                  {/* Quick View Hover Overlay Overlay */}
                  <TouchableOpacity 
                    style={styles.quickViewOverlay}
                    activeOpacity={0.9}
                    onPress={() => setSelectedProduct(item)}
                  >
                    <View style={styles.quickViewBtn}>
                      <Ionicons name="eye-outline" size={14} color="#0F4C81" />
                      <Text style={[styles.quickViewTxt, { fontFamily: typography.fontFamily.bold }]}>Quick View</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* 2. Elegant Typography Sourced Details */}
                <View style={styles.infoContainer}>
                  <Text style={[styles.brandTxt, { color: colors.primary, fontFamily: typography.fontFamily.medium }]}>
                    {item.brand}
                  </Text>
                  <Text numberOfLines={1} style={[styles.titleTxt, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                    {item.name}
                  </Text>

                  {/* Visual Star Ratings */}
                  <View style={styles.ratingsArea}>
                    <View style={styles.starRow}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Ionicons 
                          key={star} 
                          name={star <= Math.floor(item.rating) ? "star" : "star-outline"} 
                          size={11} 
                          color="#F59E0B" 
                        />
                      ))}
                    </View>
                    <Text style={[styles.reviewsTxt, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
                      ({item.reviews})
                    </Text>
                  </View>

                  {/* Price & Add to Bag */}
                  <View style={styles.priceRow}>
                    <View>
                      <Text style={[styles.priceTxt, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                        ₹{item.price.toLocaleString("en-IN")}
                      </Text>
                      <Text style={styles.deliveryEst}>3-Day Delivery</Text>
                    </View>

                    <TouchableOpacity 
                      style={[styles.addBagBtn, { backgroundColor: colors.primary }]}
                      onPress={() => {
                        setCartCount(prev => prev + 1);
                        Alert.alert("Added to Bag", `${item.name} has been added to your shopping bag.`);
                      }}
                    >
                      <Ionicons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── 4. PRODUCT FILTER SIDEBAR/DRAWER (MODAL OVERLAY) ── */}
      <Modal
        visible={filterVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeFilters}
      >
        <View style={styles.drawerOverlay}>
          {/* Close tap area */}
          <TouchableOpacity style={styles.drawerCloseTap} onPress={closeFilters} />
          
          {/* Dynamic Sliding Content Drawer */}
          <Animated.View 
            style={[
              styles.drawerContent, 
              { 
                backgroundColor: colors.card, 
                transform: [{ translateX: slideAnim }] 
              }
            ]}
          >
            <View style={[styles.drawerHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.drawerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                Filter Sourced Feed
              </Text>
              <TouchableOpacity onPress={closeFilters}>
                <Ionicons name="close-circle-outline" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.drawerScroll}>
              
              {/* Category Filter */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterHeading, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                  Categories
                </Text>
                <View style={styles.categoriesList}>
                  {FILTER_CATEGORIES.map(cat => {
                    const active = activeCategory === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.catSelectCell,
                          active ? { backgroundColor: colors.primary + "12", borderColor: colors.primary } : { borderColor: colors.border }
                        ]}
                        onPress={() => setActiveCategory(cat)}
                      >
                        <Text style={[styles.catSelectTxt, { color: active ? colors.primary : colors.text, fontFamily: typography.fontFamily.medium }]}>
                          {cat}
                        </Text>
                        {active && <Ionicons name="checkmark-circle" size={16} color={colors.primary} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Price Slider mockup */}
              <View style={styles.filterSection}>
                <View style={styles.filterHeaderRow}>
                  <Text style={[styles.filterHeading, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                    Max Price Limit
                  </Text>
                  <Text style={[styles.filterValueTxt, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>
                    ₹{priceRange.toLocaleString("en-IN")}
                  </Text>
                </View>
                {/* Horizontal slider simulator */}
                <View style={styles.sliderSimulator}>
                  <TouchableOpacity style={styles.sliderTrack} onPress={() => setPriceRange(5000)}>
                    <View style={[styles.sliderFilled, { backgroundColor: colors.primary, width: "30%" }]} />
                    <View style={[styles.sliderKnob, { left: "30%", borderColor: colors.primary }]} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sliderTrack} onPress={() => setPriceRange(15000)}>
                    <View style={[styles.sliderFilled, { backgroundColor: colors.primary, width: "80%" }]} />
                    <View style={[styles.sliderKnob, { left: "80%", borderColor: colors.primary }]} />
                  </TouchableOpacity>
                </View>
                <View style={styles.priceTicks}>
                  <Text style={styles.tickTxt}>₹0</Text>
                  <Text style={styles.tickTxt}>₹5,000</Text>
                  <Text style={styles.tickTxt}>₹15,000+</Text>
                </View>
              </View>

              {/* Color swatches */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterHeading, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                  Heritage Weave Colors
                </Text>
                <View style={styles.colorsGrid}>
                  {FILTER_COLORS.map(color => {
                    const active = selectedColor === color;
                    return (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorCircle,
                          { backgroundColor: color },
                          active ? { borderWidth: 3, borderColor: colors.text } : null
                        ]}
                        onPress={() => setSelectedColor(color)}
                      />
                    );
                  })}
                </View>
              </View>

              {/* Sizes Swatches */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterHeading, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                  Sizes / Dimensions
                </Text>
                <View style={styles.sizesGrid}>
                  {FILTER_SIZES.map(sz => {
                    const active = selectedSize === sz;
                    return (
                      <TouchableOpacity
                        key={sz}
                        style={[
                          styles.sizeChip,
                          active ? { backgroundColor: colors.primary, borderColor: colors.primary } : { borderColor: colors.border }
                        ]}
                        onPress={() => setSelectedSize(sz)}
                      >
                        <Text style={[styles.sizeTxt, { color: active ? "#fff" : colors.text, fontFamily: typography.fontFamily.medium }]}>
                          {sz}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

            </ScrollView>

            {/* Apply & Reset Buttons */}
            <View style={styles.drawerFooter}>
              <TouchableOpacity 
                style={[styles.resetBtn, { borderColor: colors.border }]}
                onPress={() => {
                  setActiveCategory("All Categories");
                  setPriceRange(15000);
                  setSelectedColor("");
                  setSelectedSize("");
                  closeFilters();
                }}
              >
                <Text style={[styles.resetBtnTxt, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                  Reset
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.applyBtn, { backgroundColor: colors.primary }]}
                onPress={closeFilters}
              >
                <Text style={[styles.applyBtnTxt, { fontFamily: typography.fontFamily.bold }]}>
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* ── 5. QUICK VIEW DETAILED POPUP MODAL ── */}
      <Modal
        visible={!!selectedProduct}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                {selectedProduct?.brand}
              </Text>
              <TouchableOpacity onPress={() => setSelectedProduct(null)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            {selectedProduct && (
              <View style={styles.modalBody}>
                <View style={[styles.modalImgArea, { backgroundColor: selectedProduct.bg }]}>
                  <Ionicons name={selectedProduct.icon as any} size={72} color="rgba(0,0,0,0.18)" />
                  <View style={styles.modalLocationBadge}>
                    <Ionicons name="location" size={12} color="#fff" />
                    <Text style={styles.modalLocationTxt}>{selectedProduct.state}</Text>
                  </View>
                </View>
                
                <Text style={[styles.modalProdName, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
                  {selectedProduct.name}
                </Text>
                
                <Text style={[styles.modalSpecs, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                  This exclusive GI-tagged handicraft highlights centuries-old craftsmanship from our national catalog.
                </Text>

                <View style={styles.modalPriceRow}>
                  <View>
                    <Text style={styles.modalPriceLbl}>Premium Sourced Price</Text>
                    <Text style={[styles.modalPriceVal, { color: colors.primary, fontFamily: typography.fontFamily.bold }]}>
                      ₹{selectedProduct.price.toLocaleString("en-IN")}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.modalAddBtn, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      setCartCount(prev => prev + 1);
                      setSelectedProduct(null);
                      Alert.alert("Added to Cart", "Product successfully added to your shopping bag.");
                    }}
                  >
                    <Ionicons name="bag-add" size={16} color="#fff" />
                    <Text style={[styles.modalAddBtnTxt, { fontFamily: typography.fontFamily.bold }]}>Add to Bag</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  
  // Premium Sticky Navigation bar
  navbar: {
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  navContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  navBackBtn: {
    padding: 4,
  },
  logoArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  logoTxt: {
    fontSize: 20,
    letterSpacing: 2,
  },
  logoSubTxt: {
    fontSize: 18,
    fontWeight: "300",
  },
  navActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionBtn: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeTxt: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },

  // Search Section
  searchSection: {
    paddingHorizontal: 16,
    marginTop: 2,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    paddingVertical: 0,
  },
  filterTrigger: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(0,0,0,0.1)",
    height: "100%",
    justifyContent: "center",
  },

  scroll: {
    paddingBottom: 32,
  },

  // Hero Value Proposition Banner
  heroSection: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    overflow: "hidden",
  },
  heroTextContent: {
    gap: 8,
  },
  premiumTag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  premiumTagTxt: {
    color: "#fff",
    fontSize: 9,
    letterSpacing: 0.5,
  },
  heroHeading: {
    color: "#fff",
    fontSize: 24,
    lineHeight: 28,
  },
  heroSubHeading: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 12.5,
    lineHeight: 18,
  },
  heroCtas: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
  },
  heroPrimaryBtn: {
    backgroundColor: "#fff",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  heroPrimaryBtnTxt: {
    color: "#0F4C81",
    fontSize: 13,
  },
  heroSecondaryBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  heroSecondaryBtnTxt: {
    color: "#fff",
    fontSize: 13,
  },
  heroImagePlaceholder: {
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    borderStyle: "dashed",
    borderRadius: 12,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    gap: 4,
  },
  heroImageText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
  },

  tabStrip: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 4, gap: 8 },
  tabChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  tabLabel: { fontSize: 11.5 },

  // Grid Section
  gridSection: {
    marginTop: 24,
  },
  gridHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  gridTitle: {
    fontSize: 16,
  },
  gridSubtitle: {
    fontSize: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 8,
  },

  // Premium Product Card Design
  gridCard: {
    width: CARD_W,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: 148,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  stateTag: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 2,
  },
  stateTagTxt: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  badgeTag: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeTagTxt: {
    color: "#fff",
    fontSize: 8.5,
    fontWeight: "bold",
  },
  quickViewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.75)",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0, // In React Native, we display it on card press or separate modal trigger
  },
  quickViewBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickViewTxt: {
    fontSize: 11,
    color: "#0F4C81",
  },

  infoContainer: {
    padding: 12,
    gap: 4,
  },
  brandTxt: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  titleTxt: {
    fontSize: 13,
  },
  ratingsArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 15,
  },
  deliveryEst: {
    fontSize: 8.5,
    color: "#16A34A",
  },
  addBagBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── FILTER DRAWER STYLES ──
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.50)",
    flexDirection: "row",
  },
  drawerCloseTap: {
    flex: 1,
  },
  drawerContent: {
    width: SW * 0.8,
    height: SH,
    paddingTop: 48,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  drawerTitle: {
    fontSize: 16,
  },
  drawerScroll: {
    padding: 16,
    gap: 20,
  },
  filterSection: {
    gap: 10,
  },
  filterHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterHeading: {
    fontSize: 13.5,
  },
  filterValueTxt: {
    fontSize: 13.5,
  },
  categoriesList: {
    gap: 8,
  },
  catSelectCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  catSelectTxt: {
    fontSize: 12.5,
  },

  // Slider Mock
  sliderTrack: {
    width: "100%",
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    position: "relative",
    justifyContent: "center",
    marginVertical: 10,
  },
  sliderFilled: {
    height: "100%",
    borderRadius: 3,
  },
  sliderKnob: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    borderWidth: 2,
  },
  priceTicks: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tickTxt: {
    fontSize: 9.5,
    color: "#94A3B8",
  },

  colorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  sizesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sizeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  sizeTxt: {
    fontSize: 12,
  },

  drawerFooter: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  resetBtn: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  resetBtnTxt: {
    fontSize: 13.5,
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtnTxt: {
    color: "#fff",
    fontSize: 13.5,
  },

  // ── QUICK VIEW MODAL OVERLAY ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalBody: {
    gap: 10,
  },
  modalImgArea: {
    height: 180,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  modalLocationBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 2,
  },
  modalLocationTxt: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  modalProdName: {
    fontSize: 16,
  },
  modalSpecs: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  modalPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 12,
  },
  modalPriceLbl: {
    fontSize: 10,
    color: "#94A3B8",
  },
  modalPriceVal: {
    fontSize: 18,
  },
  modalAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  modalAddBtnTxt: {
    color: "#fff",
    fontSize: 13.5,
  },
});
