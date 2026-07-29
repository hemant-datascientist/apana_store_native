// ============================================================
// STATE DETAIL SCREEN — Apana Store (Bharat Tab)
//
// Hero:  Back + State Name + Stores Live + SearchBar + Tab strip
// Feed:  One tab active at a time → sections styled exactly like
//        the Home screen feed (ProductHScrollSection pattern +
//        PopularStoresSection pattern).
//
// Each tab has 2 sections:
//   • Products — horizontal scroll cards (image + name + price + add)
//   • Stores   — horizontal scroll store cards (icon + name + area + ★)
// ============================================================

import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Alert, Dimensions, RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons }     from "@expo/vector-icons";
import useTheme         from "../../theme/useTheme";
import { typography }   from "../../theme/typography";
import HomeSearchBar    from "../../components/tabs/home/HomeSearchBar";
import BannerCarousel  from "../../components/tabs/home/BannerCarousel";
import MenuDrawer      from "../../components/tabs/home/MenuDrawer";
import { handleMenuSelect } from "../../lib/menuNav";
import { useStoreLiveStats } from "../../hooks/useStoreLiveStats";
import { HEADER_BG }    from "../../data/homeData";
import { fetchStateData, StateDetailData } from "../../data/stateDetailData";
import { Animated } from "react-native";
import { formatCount } from "../../utils/formatUtils";

const { width: SW } = Dimensions.get("window");
const CELL_W = Math.floor((SW - 32 - 8 * 3) / 4);   // 4-col grid, 16px side padding



// ── Tab config ────────────────────────────────────────────────
const TABS = [
  { key:"made_in",     labelFn:(s:string)=>`Made in ${s}`,       icon:"flag-outline",          color:"#15803D" },
  { key:"culture",     labelFn:(_:string)=>"Culture & Art",       icon:"color-palette-outline", color:"#7C3AED" },
  { key:"brands",      labelFn:(_:string)=>"Homegrown Brands",    icon:"storefront-outline",    color:"#0369A1" },
  { key:"export",      labelFn:(_:string)=>"Premium & Export",    icon:"globe-outline",         color:"#B45309" },
  { key:"traditional", labelFn:(_:string)=>"Traditional",         icon:"diamond-outline",       color:"#BE185D" },
  { key:"startups",    labelFn:(_:string)=>"Startups & Concepts", icon:"rocket-outline",        color:"#0F766E" },
];

// ── Section Header (matches home screen style) ─────────────────
function SectionHeader({ icon, title, accent, onSeeAll }: { icon:string; title:string; accent:string; onSeeAll?:()=>void }) {
  const { colors } = useTheme();
  return (
    <View style={sh.row}>
      <View style={sh.left}>
        <Ionicons name={icon as any} size={17} color={accent} />
        <Text style={[sh.title, { fontFamily: typography.fontFamily.bold, color: colors.text }]}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onSeeAll ?? (() => Alert.alert(title, "Full list coming soon."))}>
        <Text style={[sh.seeAll, { color: accent, fontFamily: typography.fontFamily.semiBold }]}>See All</Text>
      </TouchableOpacity>
    </View>
  );
}
const sh = StyleSheet.create({
  row:   { flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:12, paddingHorizontal:16 },
  left:  { flexDirection:"row", alignItems:"center", gap:6 },
  title: { fontSize:15 }, // color set inline from theme
  seeAll:{ fontSize:12 },
});

// ── Skeleton Loader ──────────────────────────────────────────
function StateDetailSkeleton() {
  const { colors } = useTheme();
  const pulseAnim = React.useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const SkeletonBlock = ({ style }: { style: any }) => (
    <Animated.View style={[style, { backgroundColor: colors.border, opacity: pulseAnim, borderRadius: 8 }]} />
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Hero Skeleton */}
      <View style={{ backgroundColor: HEADER_BG, height: 160, padding: 16, justifyContent: "flex-end" }}>
        <SkeletonBlock style={{ width: "60%", height: 24, marginBottom: 12 }} />
        <SkeletonBlock style={{ width: "100%", height: 44, borderRadius: 22 }} />
      </View>

      <ScrollView scrollEnabled={false} contentContainerStyle={{ padding: 16 }}>
        {/* Banner Skeleton */}
        <SkeletonBlock style={{ width: "100%", height: 120, marginBottom: 24, borderRadius: 12 }} />

        {/* Section Title */}
        <SkeletonBlock style={{ width: "40%", height: 20, marginBottom: 16 }} />

        {/* Grid Skeleton */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={{ width: CELL_W, alignItems: "center", gap: 6 }}>
              <SkeletonBlock style={{ width: CELL_W, height: CELL_W, borderRadius: 10 }} />
              <SkeletonBlock style={{ width: "80%", height: 10 }} />
            </View>
          ))}
        </View>

        {/* List Section Title */}
        <SkeletonBlock style={{ width: "50%", height: 20, marginBottom: 16 }} />

        {/* Horizontal Scroll Skeleton */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          {[1, 2].map(i => (
            <View key={i} style={{ width: 140, gap: 8 }}>
              <SkeletonBlock style={{ width: 140, height: 100, borderRadius: 12 }} />
              <SkeletonBlock style={{ width: "90%", height: 12 }} />
              <SkeletonBlock style={{ width: "60%", height: 10 }} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────
export default function StateDetailScreen() {
  const { stateKey, name, storesLive } = useLocalSearchParams<{ 
    stateKey:string; 
    name:string; 
    storesLive:string;
  }>();
  const { colors }         = useTheme();
  const router             = useRouter();

  const stateName  = (name as string) ?? "State";
  const storesLiveNum = parseInt(storesLive || "0", 10);

  // Live state-scoped store count for the hero badge — real numbers in live
  // mode, bundled bharat count in mock. null while loading → grey dot + "…".
  const liveStats = useStoreLiveStats({
    stateKey,
    stateName,
    mockStateTotal: storesLiveNum,
  });
  const liveCount = liveStats.stats?.totalLive ?? null;
  const liveDotColor =
    liveCount == null ? "#9CA3AF" : liveCount > 0 ? "#22C55E" : "#EF4444";
  
  const [search,     setSearch]     = useState("");
  const [activeTab,  setActiveTab]  = useState("made_in");
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Async Data State
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [stateData,   setStateData]   = useState<StateDetailData | null>(null);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const loadData = async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    else {
      setLoading(true);
      fadeAnim.setValue(0); // Reset for new state load
    }

    try {
      const data = await fetchStateData(stateKey || "default");
      setStateData(data);
      
      // Trigger fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.error("Failed to fetch state data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [stateKey]);

  const onRefresh = () => {
    loadData(true);
  };

  if (loading || !stateData) {
    return <StateDetailSkeleton />;
  }

  const tab        = TABS.find(t => t.key === activeTab) ?? TABS[0];
  const tabData    = stateData.tabs[activeTab] ?? stateData.tabs["made_in"];
  // §19.8 — there is no real "Made in {state}" catalog yet (products aren't
  // origin-tagged), so the Featured Products + Stores sections are honest-empty
  // rather than showing invented items. Wire to real state-scoped inventory when
  // the area→catalog scope exists; until then, no phantom products/stores.

  return (
    <Animated.View 
      style={[styles.root, { backgroundColor: colors.background, opacity: fadeAnim }]}
    >
      <StatusBar barStyle="light-content" backgroundColor={HEADER_BG} />

      {/* ── Menu drawer (Modal — doesn't affect layout) ── */}
      <MenuDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelect={key => handleMenuSelect(router, key)}
      />

      {/* ── HERO ── */}
      <SafeAreaView style={{ backgroundColor: HEADER_BG }} edges={["top"]}>

        {/* Row 1: Back + State name + Stores live */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.locationBtn} activeOpacity={0.75}>
            <Ionicons name="map-outline" size={15} color="#fff" />
            <Text numberOfLines={1} style={[styles.locationTxt, {
              fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm,
            }]}>{stateName}</Text>
            <Ionicons name="chevron-down" size={14} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.liveBadge} onPress={() => router.push({ pathname: "/store-live", params: { stateKey, stateName, storesLive: storesLiveNum.toString() } })}>
            <View style={[styles.liveDot, { backgroundColor: liveDotColor }]} />
            <Text style={[styles.liveTxt, { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
              Stores Live – {liveCount == null ? "…" : formatCount(liveCount)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Row 2: Search bar */}
        <HomeSearchBar
          value={search}
          onChangeText={setSearch}
          onSubmit={(q) => q.trim() && router.push(`/search-results?q=${encodeURIComponent(q.trim())}&state=${stateKey}` as any)}
          mode="products"
          onMenuPress={() => setDrawerOpen(true)}
          onMicPress={() => Alert.alert("Voice", "Voice search coming soon.")}
          onBellPress={() => router.push("/notifications")}
          onScanPress={() => router.push("/scanner")}
          onLocatePress={() => Alert.alert("GPS", `Locating stores in ${stateName}…`)}
        />

        {/* Row 3: Tab strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabStrip}>
          {TABS.map(t => {
            const active = t.key === activeTab;
            return (
              <TouchableOpacity key={t.key}
                style={[styles.tabChip, active ? { backgroundColor: t.color } : { backgroundColor:"rgba(255,255,255,0.12)" }]}
                onPress={() => setActiveTab(t.key)}
                activeOpacity={0.8}
              >
                <Ionicons name={t.icon as any} size={13} color={active ? "#fff" : "rgba(255,255,255,0.75)"} />
                <Text style={[styles.tabLabel, {
                  fontFamily: active ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                  color:      active ? "#fff" : "rgba(255,255,255,0.80)",
                }]}>{t.labelFn(stateName)}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

      </SafeAreaView>

      {/* ── FEED (scrollable, same style as home screen) ── */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.feed}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={tab.color} 
            colors={[tab.color]}
          />
        }
      >

        {/* ── 1. State Banners ── */}
        <BannerCarousel
          banners={stateData.banners}
          onPress={() => {}}
        />

        {/* ── 2. Sub-categories grid (like Grocery → Veg, Fruits…) ── */}
        <View style={styles.section}>
          <SectionHeader icon={tab.icon} title={tab.labelFn(stateName)} accent={tab.color} />
          <View style={styles.subGrid}>
            {(tabData?.subCats ?? []).map(cat => (
              <TouchableOpacity
                key={cat.key}
                style={[styles.subCell, { width: CELL_W }]}
                activeOpacity={0.75}
                onPress={() => router.push({
                  pathname: "/(category)/category-detail",
                  params: { key: cat.key, title: cat.label }
                } as any)}
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
        {/* ── 3. Local makers — honest-empty until a real state catalog exists (§19.8) ── */}
        <View style={styles.section}>
          <SectionHeader icon="cart-outline" title={`Made in ${stateName}`} accent={tab.color} />
          <View style={styles.emptyNote}>
            <Ionicons name="storefront-outline" size={26} color={colors.subText} />
            <Text style={[styles.emptyText, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
              Local makers and shops from {stateName} will appear here as they join Apana.
            </Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </Animated.View>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  headerRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6, gap: 8,
  },
  backBtn: {
    width:36, height:36, borderRadius:18,
    alignItems:"center", justifyContent:"center",
    backgroundColor:"rgba(255,255,255,0.12)", flexShrink:0,
  },
  locationBtn: { flexDirection:"row", alignItems:"center", flex:1, gap:5, marginRight:4 },
  locationTxt: { color:"#fff", flex:1, flexShrink:1 },
  liveBadge:   { flexDirection:"row", alignItems:"center", gap:5, flexShrink:0 },
  liveDot:     { width:8, height:8, borderRadius:4 },
  liveTxt:     { color:"#fff" },

  // Tab strip
  tabStrip: { paddingHorizontal:12, paddingTop:4, paddingBottom:12, gap:8 },
  tabChip:  { flexDirection:"row", alignItems:"center", gap:6, paddingHorizontal:14, paddingVertical:8, borderRadius:20 },
  tabLabel: { fontSize: typography.size.xs },

  // Feed
  feed:    { paddingTop: 4, paddingBottom: 24 },
  section: { marginTop: 20 },

  // Honest-empty note (§19.8 — no fabricated state products/stores)
  emptyNote:  { alignItems: "center", gap: 8, paddingHorizontal: 32, paddingVertical: 20 },
  emptyText:  { fontSize: typography.size.sm, textAlign: "center", lineHeight: 19 },

  // Sub-category grid (4-col, like SeasonalCategorySection)
  subGrid:  { flexDirection:"row", flexWrap:"wrap", gap:8, paddingHorizontal:16 },
  subCell:  { alignItems:"center", gap:5 },
  subImg:   { width:"100%", borderRadius:10, alignItems:"center", justifyContent:"center", borderWidth:1, borderColor:"#F3F4F6" },
  subLabel: { fontSize:10, textAlign:"center", lineHeight:13 },
});
