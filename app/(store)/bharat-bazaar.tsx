// ============================================================
// BHARAT BAZAAR SCREEN — Apana Store (National Explorer Feed)
//
// An exquisite, premium Amazon/Flipkart national marketplace feed.
// Sourced items representing the heritage of India's states.
//
// Structured exactly like premium state detail screens:
//   - Back + title header + cart badge
//   - Hero state detail banner carousel
//   - Premium horizontal category/sub-category chips
//   - 4-column quick category grid (Loom, Flavours, Crafts, Spices...)
//   - Premium Product Horizontal Scroll Collections
//   - Premium Local Sourced Stores Horizontal Scroll Collection
// ============================================================

import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Alert, Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import BannerCarousel from "../../components/tabs/home/BannerCarousel";
import HomeSearchBar from "../../components/tabs/home/HomeSearchBar";
import { HEADER_BG } from "../../data/homeData";

const { width: SW } = Dimensions.get("window");
const CELL_W = Math.floor((SW - 32 - 8 * 3) / 4); // 4-col grid layout

// Banners matching state-detail style
const NATIONAL_BANNERS = [
  { id: "b1", title: "Pride of the Nation", subtitle: "Sourced direct from handloom weavers and regional startups.", tag: "National Feed", bg: "#065F46", accent: "#D1FAE5", icon: "flag-outline" },
  { id: "b2", title: "Regional Gastronomy", subtitle: "Authentic Temi tea, Wayanad spices, and organic produce.", tag: "Organics", bg: "#7C2D12", accent: "#FFEDD5", icon: "leaf-outline" },
  { id: "b3", title: "Heritage Crafts & GI Tags", subtitle: "Collect Bomkai Silk, Cuttack filigree, and Warli painted pottery.", tag: "GI Tags", bg: "#1E3A8A", accent: "#DBEAFE", icon: "diamond-outline" },
];

// Sourced products
interface BazaarProduct {
  id: string;
  name: string;
  unit: string;
  price: number;
  bg: string;
  icon: string;
  badge?: string;
  state: string;
  stateKey: string;
}

const BAZAAR_PRODUCTS: BazaarProduct[] = [
  { id: "p1", name: "Bomkai Handloom Saree", unit: "Pure Silk · Odisha", price: 6500, bg: "#EDE9FE", icon: "shirt-outline", badge: "GI Tag", state: "Odisha", stateKey: "odisha" },
  { id: "p2", name: "Temi Orthodox Tea", unit: "250g · Sikkim", price: 599, bg: "#DCFCE7", icon: "cafe-outline", badge: "Organic", state: "Sikkim", stateKey: "sikkim" },
  { id: "p3", name: "Patiala Shahi Jutti", unit: "Leather · Punjab", price: 999, bg: "#FFEDD5", icon: "walk-outline", badge: "Famous", state: "Punjab", stateKey: "punjab" },
  { id: "p4", name: "Amritsari Dupatta", unit: "Phulkari · Punjab", price: 1499, bg: "#FCE7F3", icon: "shirt-outline", badge: "Handmade", state: "Punjab", stateKey: "punjab" },
  { id: "p5", name: "Pure Paithani Saree", unit: "Yeola Silk · Maharashtra", price: 8500, bg: "#FCE7F3", icon: "shirt-outline", badge: "GI Tag", state: "Maharashtra", stateKey: "maharashtra" },
  { id: "p6", name: "Kolhapuri Chappals", unit: "Handmade · Maharashtra", price: 899, bg: "#FFEDD5", icon: "walk-outline", badge: "Leather", state: "Maharashtra", stateKey: "maharashtra" },
  { id: "p7", name: "Wayanad Cardamom Jar", unit: "Spice · Kerala", price: 450, bg: "#FEE2E2", icon: "flame-outline", badge: "Aromatic", state: "Kerala", stateKey: "kerala" },
  { id: "p8", name: "Monpa Handmade Notebook", unit: "A5 · Arunachal", price: 599, bg: "#EDE9FE", icon: "document-text-outline", badge: "Eco Craft", state: "Arunachal", stateKey: "arunachal" }
];

// National sourced stores
interface BazaarStore {
  id: string;
  name: string;
  category: string;
  area: string;
  icon: string;
  bg: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  rating: number;
}

const BAZAAR_STORES: BazaarStore[] = [
  { id: "s1", name: "Kairali Handicrafts Emporium", category: "Handicrafts", area: "Kochi, Kerala", icon: "hammer-outline", bg: "#EDE9FE", badge: "State Govt", badgeBg: "#DBEAFE", badgeColor: "#1D4ED8", rating: 4.9 },
  { id: "s2", name: "Phulkari Emporium", category: "Handlooms", area: "Amritsar, PB", icon: "shirt-outline", bg: "#FCE7F3", badge: "Heritage", badgeBg: "#FCE7F3", badgeColor: "#BE185D", rating: 4.8 },
  { id: "s3", name: "Temi Tea Garden Shop", category: "Organic Tea", area: "Namchi, SK", icon: "cafe-outline", bg: "#DCFCE7", badge: "Famous", badgeBg: "#DCFCE7", badgeColor: "#15803D", rating: 4.9 },
  { id: "s4", name: "Warli Art Center", category: "Pottery & Decor", area: "Thane, MH", icon: "brush-outline", bg: "#F3E8FF", badge: "Artisanal", badgeBg: "#DBEAFE", badgeColor: "#1D4ED8", rating: 4.5 }
];

// Categories grid
const SUB_CATEGORIES = [
  { key: "a", label: "Handlooms & Wear", icon: "shirt-outline", bg: "#FCE7F3", color: "#BE185D" },
  { key: "b", label: "Regional Flavours", icon: "fast-food-outline", bg: "#EDE9FE", color: "#7C3AED" },
  { key: "c", label: "Heritage Crafts", icon: "hammer-outline", bg: "#FFEDD5", color: "#C2410C" },
  { key: "d", label: "Organic Grains & Tea", icon: "cafe-outline", bg: "#DCFCE7", color: "#15803D" },
  { key: "e", label: "Traditional Spices", icon: "flame-outline", bg: "#FEE2E2", color: "#DC2626" },
  { key: "f", label: "Pottery & Decor", icon: "color-palette-outline", bg: "#F3E8FF", color: "#7C3AED" },
  { key: "g", label: "Homegrown Brands", icon: "storefront-outline", bg: "#DBEAFE", color: "#0369A1" },
  { key: "h", label: "Local Startups", icon: "rocket-outline", bg: "#CCFBF1", color: "#0F766E" },
];

const TABS = [
  { key: "all", label: "All Sourced", icon: "grid-outline", color: "#0F4C81" },
  { key: "looms", label: "Weaving & Looms", icon: "shirt-outline", color: "#BE185D" },
  { key: "crafts", label: "Traditional Crafts", icon: "diamond-outline", color: "#7C3AED" },
  { key: "food", label: "Spices & Organic", icon: "leaf-outline", color: "#15803D" },
];

// Section header reuse
function SectionHeader({ icon, title, accent }: { icon: string; title: string; accent: string }) {
  const { colors } = useTheme();
  return (
    <View style={sh.row}>
      <View style={sh.left}>
        <Ionicons name={icon as any} size={17} color={accent} />
        <Text style={[sh.title, { fontFamily: typography.fontFamily.bold, color: colors.text }]}>{title}</Text>
      </View>
      <TouchableOpacity onPress={() => Alert.alert(title, "Full collection coming soon.")}>
        <Text style={[sh.seeAll, { color: accent, fontFamily: typography.fontFamily.semiBold }]}>See All</Text>
      </TouchableOpacity>
    </View>
  );
}
const sh = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12, paddingHorizontal: 16 },
  left: { flexDirection: "row", alignItems: "center", gap: 6 },
  title: { fontSize: 15 },
  seeAll: { fontSize: 12 },
});

// Product Collection H-Scroll
function ProductSection({ accent, products }: { accent: string; products: BazaarProduct[] }) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ps.scroll}>
      {products.map(p => (
        <TouchableOpacity
          key={p.id}
          style={[ps.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.8}
          onPress={() => router.push({
            pathname: "/(store)/state-detail",
            params: { stateKey: p.stateKey, name: p.state, storesLive: "5" }
          } as any)}
        >
          <View style={[ps.img, { backgroundColor: p.bg }]}>
            <Ionicons name={p.icon as any} size={36} color="rgba(0,0,0,0.18)" />
            {p.badge && (
              <View style={[ps.badge, { backgroundColor: accent }]}>
                <Text style={[ps.badgeTxt, { fontFamily: typography.fontFamily.bold }]}>{p.badge}</Text>
              </View>
            )}
          </View>
          <View style={ps.info}>
            <Text numberOfLines={2} style={[ps.name, { fontFamily: typography.fontFamily.semiBold, color: colors.text }]}>{p.name}</Text>
            <Text numberOfLines={1} style={[ps.unit, { fontFamily: typography.fontFamily.regular, color: colors.subText }]}>{p.unit}</Text>
            <View style={ps.priceRow}>
              <Text style={[ps.price, { color: accent, fontFamily: typography.fontFamily.bold }]}>
                ₹{p.price.toLocaleString("en-IN")}
              </Text>
              <TouchableOpacity style={[ps.addBtn, { backgroundColor: accent }]}
                onPress={() => Alert.alert("Added", `${p.name} from ${p.state} added to cart.`)}
              >
                <Ionicons name="add" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
const ps = StyleSheet.create({
  scroll: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  card: { width: 115, borderRadius: 10, overflow: "hidden", borderWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  img: { width: "100%", height: 100, alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: 5, left: 5, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  badgeTxt: { color: "#fff", fontSize: 8 },
  info: { padding: 7, paddingTop: 6, gap: 2 },
  name: { fontSize: 11, lineHeight: 14 },
  unit: { fontSize: 9.5 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  price: { fontSize: 12 },
  addBtn: { width: 24, height: 24, borderRadius: 6, alignItems: "center", justifyContent: "center" },
});

// Sourced Stores H-Scroll
function StoreSection({ accent, stores }: { accent: string; stores: BazaarStore[] }) {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ss.scroll}>
      {stores.map(s => (
        <TouchableOpacity key={s.id} style={[ss.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Alert.alert(s.name, "Opening Store details...")} activeOpacity={0.8}
        >
          <View style={[ss.img, { backgroundColor: s.bg }]}>
            <Ionicons name={s.icon as any} size={38} color="rgba(0,0,0,0.18)" />
            <View style={[ss.badge, { backgroundColor: s.badgeBg }]}>
              <Text style={[ss.badgeTxt, { color: s.badgeColor, fontFamily: typography.fontFamily.bold }]}>{s.badge}</Text>
            </View>
          </View>
          <View style={ss.info}>
            <Text numberOfLines={1} style={[ss.name, { fontFamily: typography.fontFamily.bold, color: colors.text }]}>{s.name}</Text>
            <Text numberOfLines={1} style={[ss.cat, { color: accent, fontFamily: typography.fontFamily.medium }]}>{s.category}</Text>
            <View style={ss.meta}>
              <View style={ss.locRow}>
                <Ionicons name="location-outline" size={10} color={colors.subText} />
                <Text numberOfLines={1} style={[ss.area, { fontFamily: typography.fontFamily.regular, color: colors.subText }]}>{s.area}</Text>
              </View>
              <View style={ss.ratingRow}>
                <Ionicons name="star" size={10} color="#F59E0B" />
                <Text style={[ss.rating, { fontFamily: typography.fontFamily.semiBold, color: colors.text }]}>{s.rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
const ss = StyleSheet.create({
  scroll: { paddingHorizontal: 16, gap: 10, paddingBottom: 4 },
  card: { width: 148, borderRadius: 12, overflow: "hidden", borderWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 },
  img: { width: "100%", height: 88, alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: 6, right: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  badgeTxt: { fontSize: 8.5 },
  info: { padding: 8, gap: 2 },
  name: { fontSize: 12 },
  cat: { fontSize: 10.5 },
  meta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 3 },
  locRow: { flexDirection: "row", alignItems: "center", gap: 2, flex: 1 },
  area: { fontSize: 9.5, flex: 1 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  rating: { fontSize: 10.5 },
});

export default function BharatBazaarScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const tab = TABS.find(t => t.key === activeTab) ?? TABS[0];

  // Filtering products according to active selection tabs
  const filteredProducts = BAZAAR_PRODUCTS.filter(p => {
    if (activeTab === "looms") return p.icon === "shirt-outline";
    if (activeTab === "crafts") return p.icon === "document-text-outline" || p.icon === "layers-outline" || p.icon === "walk-outline";
    if (activeTab === "food") return p.icon === "cafe-outline" || p.icon === "flame-outline";
    return true;
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_BG} />

      {/* ── HERO HEADER ── */}
      <SafeAreaView style={{ backgroundColor: HEADER_BG }} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleArea}>
            <Text style={[styles.headerTitleTxt, { fontFamily: typography.fontFamily.bold }]}>
              Bharat Bazaar
            </Text>
            <Text style={[styles.headerSubTxt, { fontFamily: typography.fontFamily.regular }]}>
              National Artisanal Feed
            </Text>
          </View>
          <TouchableOpacity
            style={styles.cartBadge}
            onPress={() => router.push("/(tabs)/cart" as any)}
          >
            <Ionicons name="cart-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <HomeSearchBar
          value={search}
          onChangeText={setSearch}
          onSubmit={(q) => Alert.alert("Search", `Sourced search: ${q}`)}
          mode="products"
          placeholder="Search sarees, crafts, spices..."
          onMenuPress={() => Alert.alert("Bazaar Menu", "Search configurations soon.")}
          onMicPress={() => Alert.alert("Voice Search", "Microphone listening...")}
          onBellPress={() => router.push("/notifications")}
          onScanPress={() => router.push("/scanner")}
          onLocatePress={() => Alert.alert("Global Discover", "Discovering local goods...")}
        />

        {/* Tab strip selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabStrip}>
          {TABS.map(t => {
            const active = t.key === activeTab;
            return (
              <TouchableOpacity key={t.key}
                style={[styles.tabChip, active ? { backgroundColor: t.color } : { backgroundColor: "rgba(255,255,255,0.12)" }]}
                onPress={() => setActiveTab(t.key)}
                activeOpacity={0.8}
              >
                <Ionicons name={t.icon as any} size={13} color={active ? "#fff" : "rgba(255,255,255,0.75)"} />
                <Text style={[styles.tabLabel, {
                  fontFamily: active ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                  color: active ? "#fff" : "rgba(255,255,255,0.80)",
                }]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      {/* ── FEED COLLECTION ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.feed}>

        {/* 1. National Sourced Banners */}
        <BannerCarousel
          banners={NATIONAL_BANNERS}
          onPress={() => { }}
        />

        {/* 2. Sub-categories 4-Column Grid */}
        <View style={styles.section}>
          <SectionHeader icon={tab.icon} title="Explore Categories" accent={tab.color} />
          <View style={styles.subGrid}>
            {SUB_CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.key}
                style={[styles.subCell, { width: CELL_W }]}
                activeOpacity={0.75}
                onPress={() => Alert.alert("Category", `Filter category: ${cat.label}`)}
              >
                <View style={[styles.subImg, { backgroundColor: cat.bg, height: CELL_W, borderColor: colors.border }]}>
                  <Ionicons name={cat.icon as any} size={28} color="rgba(0,0,0,0.22)" />
                </View>
                <Text numberOfLines={2} style={[styles.subLabel, { fontFamily: typography.fontFamily.semiBold, color: colors.text }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. Sourced Sells Collection */}
        <View style={styles.section}>
          <SectionHeader icon="cart-outline" title="National Trending Products" accent={tab.color} />
          <ProductSection accent={tab.color} products={filteredProducts} />
        </View>

        {/* 4. Sourced Shops Collection */}
        <View style={styles.section}>
          <SectionHeader
            icon="storefront-outline"
            title="Premium Heritage Stores"
            accent="#0F4C81"
          />
          <StoreSection accent="#0F4C81" stores={BAZAAR_STORES} />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  headerTitleArea: {
    flex: 1,
  },
  headerTitleTxt: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 20,
  },
  headerSubTxt: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11.5,
    lineHeight: 14,
  },
  cartBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  tabStrip: { paddingHorizontal: 12, paddingTop: 4, paddingBottom: 12, gap: 8 },
  tabChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  tabLabel: { fontSize: typography.size.xs },

  feed: { paddingTop: 4, paddingBottom: 24 },
  section: { marginTop: 20 },

  subGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 16 },
  subCell: { alignItems: "center", gap: 5 },
  subImg: { width: "100%", borderRadius: 10, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#F3F4F6" },
  subLabel: { fontSize: 10, textAlign: "center", lineHeight: 13 },
});
