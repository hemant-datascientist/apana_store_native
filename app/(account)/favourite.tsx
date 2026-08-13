// ============================================================
// FAVOURITE — Apana Store (Customer App)
//
// 2-tab screen showing saved favourites:
//   Products  — saved products (honest-empty until a backend exists)
//   Stores    — stores you follow (§30 followStore — the single store
//               relationship; old separate favourite-stores list merged)
//
// RIDERS + DELIVERY TABS REMOVED. They listed invented people — names, vehicle
// numbers, "Available" badges and PHONE NUMBERS with a Call button — as the
// customer's "saved riders" and "saved delivery partners". Three things were
// wrong at once: /api/customer/favourites/{riders,delivery} has never existed
// (404), there is no ride system in the product at all, and nobody has a
// permanent delivery partner — an order gets whoever claims it. Same defect as
// the "My Delivery Boy" / "My Rider" cards already removed from Profile.
//
// Navigation:
//   router.push("/favourite?tab=stores")   → opens Stores tab
//
// Backend API:
//   GET  /customer/following                → StoreSummary[]   (stores tab)
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, Dimensions, Alert,
} from "react-native";
import { SafeAreaView }      from "react-native-safe-area-context";
import { Ionicons }          from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme             from "../../theme/useTheme";
import { typography }        from "../../theme/typography";
import { useFollowedStores } from "../../hooks/useFollow";
import { toggleFollow }      from "../../lib/followStore";
import { StoreDetail }       from "../../data/storeDetailData";

// Deliberate dark-navy chrome — header is a brand surface
const BRAND_BLUE  = "#0F4C81";
const { width: SW } = Dimensions.get("window");

// ── Tab config ────────────────────────────────────────────────
type FavTab = "products" | "stores";

interface TabConfig {
  key:   FavTab;
  label: string;
  icon:  string;
}

const TABS: TabConfig[] = [
  { key: "products", label: "Products", icon: "bag-outline"       },
  { key: "stores",   label: "Stores",   icon: "storefront-outline" },
];

const TAB_GAP   = 8;
const TAB_H_PAD = 16;
const TAB_W     = Math.floor((SW - TAB_H_PAD * 2 - TAB_GAP * (TABS.length - 1)) / TABS.length);

// ── Initials avatar helper ─────────────────────────────────────
function Initials({ name, bg }: { name: string; bg: string }) {
  const letters = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  return (
    <View style={[styles.avatar, { backgroundColor: bg }]}>
      {/* Avatar bg is a deliberate accent fill — keep white text for contrast */}
      <Text style={[styles.avatarText, { fontFamily: typography.fontFamily.bold, color: "#fff" }]}>
        {letters}
      </Text>
    </View>
  );
}

// ── Store card (followed store) ───────────────────────────────
function StoreCard({ store, onOpen }: { store: StoreDetail; onOpen: () => void }) {
  const { colors } = useTheme();

  // Heart = unfollow (real action on the §30 follow store, not a stub).
  function confirmUnfollow() {
    Alert.alert("Unfollow", `Stop following ${store.name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Unfollow", style: "destructive", onPress: () => toggleFollow(store.id) },
    ]);
  }

  return (
    <TouchableOpacity
      style={[styles.listCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.8}
      onPress={onOpen}
    >
      <View style={[styles.storeIconWrap, { backgroundColor: BRAND_BLUE + "15" }]}>
        <Ionicons name={store.icon as any} size={24} color={BRAND_BLUE} />
      </View>

      <View style={styles.cardBody}>
        <Text style={[styles.cardName, { fontFamily: typography.fontFamily.semiBold, color: colors.text }]}>
          {store.name}
        </Text>
        <Text style={[styles.cardSub, { fontFamily: typography.fontFamily.regular, color: colors.subText }]}>
          {store.category} · {store.city}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="star" size={11} color={colors.warning} />
          <Text style={[styles.metaText, { fontFamily: typography.fontFamily.medium, color: colors.subText }]}>
            {store.rating.toFixed(1)}
          </Text>
          {/* Status pill uses success/border tokens so both light & dark modes read cleanly */}
          <View style={[styles.openBadge, { backgroundColor: store.isOpen ? colors.successLight : colors.border }]}>
            <Text style={[styles.openText, {
              fontFamily: typography.fontFamily.semiBold,
              color: store.isOpen ? colors.success : colors.subText,
            }]}>
              {store.isOpen ? "Open" : "Closed"}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeFavBtn}
        onPress={confirmUnfollow}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="heart" size={20} color={colors.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ icon, title, sub, cta, onCta }: {
  icon: string; title: string; sub: string; cta: string; onCta: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.emptyWrap}>
      {/* Empty hero is a deliberate brand surface — white icon on brand fill is the intended look */}
      <View style={styles.emptyCircle}>
        <Ionicons name={icon as any} size={52} color="#fff" />
      </View>
      <Text style={[styles.emptyTitle, { fontFamily: typography.fontFamily.semiBold, color: colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.emptySub, { fontFamily: typography.fontFamily.regular, color: colors.subText }]}>
        {sub}
      </Text>
      <TouchableOpacity style={styles.browseBtn} activeOpacity={0.85} onPress={onCta}>
        <Text style={[styles.browseBtnText, { fontFamily: typography.fontFamily.semiBold }]}>
          {cta}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────
export default function FavouriteScreen() {
  const router           = useRouter();
  const { colors }       = useTheme();
  const params           = useLocalSearchParams<{ tab?: string }>();
  const initialTab       = (params.tab as FavTab) ?? "products";
  const [activeTab, setActiveTab] = useState<FavTab>(initialTab);
  const followedStores   = useFollowedStores();

  function renderContent() {
    switch (activeTab) {

      case "stores":
        if (followedStores.length === 0) {
          return (
            <EmptyState
              icon="heart-outline"
              title="Not following any stores yet"
              sub="Tap the heart on any storefront to follow it and see it here."
              cta="Explore Stores"
              onCta={() => router.back()}
            />
          );
        }
        return (
          <View style={styles.list}>
            <Text style={[styles.countLabel, { fontFamily: typography.fontFamily.regular, color: colors.subText }]}>
              {followedStores.length} {followedStores.length === 1 ? "store" : "stores"} you follow
            </Text>
            {followedStores.map(s => (
              <StoreCard
                key={s.id}
                store={s}
                onOpen={() => router.push(`/store-detail?id=${s.id}`)}
              />
            ))}
          </View>
        );

      case "products":
      default:
        return (
          <EmptyState
            icon="heart-outline"
            title="No favourite products yet"
            sub="Tap the heart on any product to save it here for quick access."
            cta="Browse Products"
            onCta={() => router.back()}
          />
        );
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />

      {/* ── Header ── */}
      <SafeAreaView style={styles.header} edges={["top"]}>
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
                  size={14}
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
        contentContainerStyle={[
          styles.scrollContent,
          activeTab === "products" && styles.scrollCentered,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 }, // backgroundColor set inline from theme

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
    width: 44, height: 44,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: {
    flex: 1, fontSize: 17, color: "#fff", textAlign: "center",
  },

  // ── Tabs ────────────────────────────────────────────────────
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
  tabLabel:       { fontSize: 11, color: "rgba(255,255,255,0.70)" },
  tabLabelActive: { color: BRAND_BLUE },

  // ── Scroll ──────────────────────────────────────────────────
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  scrollCentered:{
    flexGrow: 1, alignItems: "center", justifyContent: "center",
    paddingHorizontal: 32,
  },

  // ── List ────────────────────────────────────────────────────
  list: { gap: 10 },
  countLabel: {
    fontSize: 12, marginBottom: 4, // color inline from theme
  },

  // ── List card (shared) ───────────────────────────────────────
  listCard: {
    flexDirection:   "row",
    alignItems:      "center",
    // backgroundColor + borderColor set inline from theme
    borderRadius:    14,
    padding:         14,
    gap:             12,
    borderWidth:     1,
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.06,
    shadowRadius:    4,
    elevation:       2,
  },

  // Store icon
  storeIconWrap: {
    width: 48, height: 48,
    borderRadius: 12,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },

  // Initials avatar
  avatar: {
    width: 48, height: 48,
    borderRadius: 24,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { fontSize: 16 }, // color inline (white on accent fill)

  // Card body
  cardBody: { flex: 1, gap: 3 },
  nameRow: {
    flexDirection: "row", alignItems: "center", gap: 7, flexWrap: "wrap",
  },
  cardName: { fontSize: 14 }, // color inline from theme
  cardSub:  { fontSize: 12 }, // color inline from theme
  metaRow:  { flexDirection: "row", alignItems: "center", gap: 5, flexWrap: "wrap", marginTop: 2 },
  metaText: { fontSize: 11.5 }, // color inline from theme
  metaDot:  { fontSize: 11 },   // color inline from theme

  // Badges
  badge: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: { fontSize: 10 },
  openBadge: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 6, marginLeft: 4,
  },
  openText: { fontSize: 10 },
  availBadge: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 6, marginLeft: 2,
  },
  availText: { fontSize: 10 },

  // Card right-side actions
  cardActions: { gap: 10, alignItems: "center" },
  callBtn: {
    width: 34, height: 34,
    borderRadius: 17,
    backgroundColor: BRAND_BLUE + "15",
    alignItems: "center", justifyContent: "center",
  },
  removeFavBtn: { padding: 4 },

  // ── Empty state ─────────────────────────────────────────────
  emptyWrap:   { alignItems: "center", gap: 16 },
  emptyCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: BRAND_BLUE,
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 16, textAlign: "center" }, // color inline from theme
  emptySub: {
    fontSize: 13, textAlign: "center", lineHeight: 20, // color inline from theme
  },
  browseBtn: {
    backgroundColor: BRAND_BLUE, borderRadius: 24,
    paddingHorizontal: 22, paddingVertical: 12, marginTop: 8,
  },
  browseBtnText: { color: "#fff", fontSize: 13.5 },
});
