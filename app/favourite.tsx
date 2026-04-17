// ============================================================
// FAVOURITE — Apana Store (Customer App)
//
// Saved favourites across 4 tabs:
//   Products · Stores · Riders · Delivery
//
// Empty state per tab until backend provides saved items.
// Backend: GET /api/customer/favourites?type={products|stores|riders|delivery}
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, Dimensions, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import { useRouter }    from "expo-router";
import { typography }   from "../theme/typography";

const BRAND_BLUE = "#0F4C81";
const { width: SW } = Dimensions.get("window");

// ── Tab config ────────────────────────────────────────────────
type FavTab = "products" | "stores" | "riders" | "delivery";

interface TabConfig {
  key:   FavTab;
  label: string;
  icon:  string;
  emptyIcon:  string;
  emptyTitle: string;
  emptySub:   string;
}

const TABS: TabConfig[] = [
  {
    key:        "products",
    label:      "Products",
    icon:       "bag-outline",
    emptyIcon:  "heart-outline",
    emptyTitle: "No favourite products yet",
    emptySub:   "Tap the heart on any product to save it here for quick access.",
  },
  {
    key:        "stores",
    label:      "Stores",
    icon:       "storefront-outline",
    emptyIcon:  "storefront-outline",
    emptyTitle: "No favourite stores yet",
    emptySub:   "Save your go-to local stores and find them instantly anytime.",
  },
  {
    key:        "riders",
    label:      "Riders",
    icon:       "bicycle-outline",
    emptyIcon:  "bicycle-outline",
    emptyTitle: "No favourite riders yet",
    emptySub:   "Save trusted riders you've worked with for faster bookings.",
  },
  {
    key:        "delivery",
    label:      "Delivery",
    icon:       "cube-outline",
    emptyIcon:  "cube-outline",
    emptyTitle: "No favourite deliveries yet",
    emptySub:   "Reorder from your saved delivery services in one tap.",
  },
];

// ── Tab pill width ─────────────────────────────────────────────
const TAB_GAP  = 8;
const TAB_H_PAD = 16;
const TAB_W    = Math.floor((SW - TAB_H_PAD * 2 - TAB_GAP * (TABS.length - 1)) / TABS.length);

export default function FavouriteScreen() {
  const router                    = useRouter();
  const [activeTab, setActiveTab] = useState<FavTab>("products");

  const tab = TABS.find(t => t.key === activeTab)!;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />

      {/* ── Header ── */}
      <SafeAreaView style={styles.header} edges={["top"]}>
        {/* Title row */}
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} activeOpacity={0.75}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.semiBold }]}>
            Favourite
          </Text>

          <TouchableOpacity
            style={styles.headerBtn}
            activeOpacity={0.75}
            onPress={() => Alert.alert("Help", "Favourites help coming soon.")}
          >
            <Ionicons name="help-circle-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ── Tab pills ── */}
        <View style={styles.tabRow}>
          {TABS.map(t => {
            const isActive = t.key === activeTab;
            return (
              <TouchableOpacity
                key={t.key}
                style={[styles.tab, { width: TAB_W }, isActive && styles.tabActive]}
                activeOpacity={0.8}
                onPress={() => setActiveTab(t.key)}
              >
                <Ionicons
                  name={t.icon as any}
                  size={15}
                  color={isActive ? BRAND_BLUE : "rgba(255,255,255,0.70)"}
                />
                <Text style={[
                  styles.tabLabel,
                  { fontFamily: isActive ? typography.fontFamily.bold : typography.fontFamily.medium },
                  isActive && styles.tabLabelActive,
                ]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>

      {/* ── Content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Empty state — replace with list when backend provides data */}
        <View style={styles.emptyWrap}>
          <View style={styles.emptyCircle}>
            <Ionicons name={tab.emptyIcon as any} size={52} color="#fff" />
          </View>

          <Text style={[styles.emptyTitle, { fontFamily: typography.fontFamily.semiBold }]}>
            {tab.emptyTitle}
          </Text>

          <Text style={[styles.emptySub, { fontFamily: typography.fontFamily.regular }]}>
            {tab.emptySub}
          </Text>

          <TouchableOpacity
            style={styles.browseBtn}
            activeOpacity={0.85}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back-outline" size={16} color="#fff" />
            <Text style={[styles.browseBtnText, { fontFamily: typography.fontFamily.semiBold }]}>
              Browse {tab.label}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: "#F8FAFC",
  },

  // ── Header ──────────────────────────────────────────────────
  header: {
    backgroundColor: BRAND_BLUE,
    paddingBottom:   16,
  },
  titleRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 8,
  },
  headerBtn: {
    width:          44,
    height:         44,
    alignItems:     "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex:      1,
    fontSize:  17,
    color:     "#fff",
    textAlign: "center",
  },

  // Tab row
  tabRow: {
    flexDirection:     "row",
    gap:               TAB_GAP,
    paddingHorizontal: TAB_H_PAD,
    marginTop:         12,
  },
  tab: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             5,
    paddingVertical: 9,
    borderRadius:    24,
    borderWidth:     1.5,
    borderColor:     "rgba(255,255,255,0.30)",
  },
  tabActive: {
    backgroundColor: "#fff",
    borderColor:     "#fff",
  },
  tabLabel: {
    fontSize: 11.5,
    color:    "rgba(255,255,255,0.70)",
  },
  tabLabelActive: {
    color: BRAND_BLUE,
  },

  // ── Scroll / empty state ─────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow:          1,
    alignItems:        "center",
    justifyContent:    "center",
    paddingHorizontal: 32,
    paddingVertical:   48,
    gap:               18,
  },

  emptyWrap: {
    alignItems: "center",
    gap:        16,
  },
  emptyCircle: {
    width:          120,
    height:         120,
    borderRadius:   60,
    backgroundColor: BRAND_BLUE,
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   4,
  },
  emptyTitle: {
    fontSize:  16,
    color:     "#111827",
    textAlign: "center",
  },
  emptySub: {
    fontSize:   13,
    color:      "#6B7280",
    textAlign:  "center",
    lineHeight: 20,
  },
  browseBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    backgroundColor:   BRAND_BLUE,
    borderRadius:      24,
    paddingHorizontal: 22,
    paddingVertical:   12,
    marginTop:         8,
  },
  browseBtnText: {
    color:    "#fff",
    fontSize: 13.5,
  },
});
