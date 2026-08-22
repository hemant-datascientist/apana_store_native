// ============================================================
// STORE DETAIL SCREEN — Apana Store (Customer App)
//
// Sections (top → bottom):
//   StoreHeroBanner      — colored hero with icon, LIVE badge, rating
//   StoreInfoHeader      — name, tagline, address, open/closed status
//   StoreActionButtons   — Directions | Call | Website
//   StoreProductSearch   — search bar scoped to this store's products
//   StoreHoursCard       — weekly opening hours, today highlighted
//   StoreContactCard     — address + phone + report issue link
//   StoreProductCategories — filterable category rows with product count
//
// Navigation:
//   router.push("/store-detail?id=s1")
//
// State:
//   productSearch — filters category list by label
//
// Backend: GET /stores/:id
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import {
  View, ScrollView, StyleSheet, Alert, Linking,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons }            from "@expo/vector-icons";
import { TouchableOpacity }    from "react-native";
import * as Haptics            from "expo-haptics";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme                from "../../theme/useTheme";
import { typography }          from "../../theme/typography";
import { Text }                from "react-native";
import {
  getStoreById,
  DEFAULT_STORE_ID,
  StoreProductCategory,
} from "../../data/storeDetailData";
import StateView from "../../components/ui/StateView";
import { openDirections } from "../../lib/openDirections";
import { useStoreCatalog }     from "../../hooks/useStoreCatalog";
import { useFollow }           from "../../hooks/useFollow";
import { useStoreMute }        from "../../hooks/useNotificationPrefs";
import StoreShareSheet         from "../../components/store/StoreShareSheet";

import StoreHeroBanner        from "../../components/store/StoreHeroBanner";
import StoreInfoHeader        from "../../components/store/StoreInfoHeader";
import StoreActionButtons     from "../../components/store/StoreActionButtons";
import StoreProductSearch     from "../../components/store/StoreProductSearch";
import StoreHoursCard         from "../../components/store/StoreHoursCard";
import StoreContactCard       from "../../components/store/StoreContactCard";
import StoreProductCategories from "../../components/store/StoreProductCategories";

export default function StoreDetailScreen() {
  const { colors }         = useTheme();
  const router             = useRouter();
  const { id, follow }     = useLocalSearchParams<{ id?: string; follow?: string }>();
  const insets             = useSafeAreaInsets();

  // Real catalog for this store id (§16.9 APC-arranged). Falls back to bundled
  // sample data when the id isn't a real approved store (dev / offline / mock).
  const live = useStoreCatalog(id);

  // Real meta + real APC categories overlay the mock CHROME (hero colour and
  // hours still await BE fields — clearly generic, never presented as this
  // shop's real opening times). Substance — name, city, rating, PHONE and the
  // product categories — is real when the store resolves.
  //
  // The phone matters more than the rest: StoreContactCard DIALS it. Left on
  // the bundled sample it would ring a number this shop never gave out, and on
  // a real handset that is somebody else's phone.
  // 🔴 A REAL STORE ID USED TO RENDER THE DEMO SHOP WHEN THE FETCH FAILED.
  //
  // getStoreById() answers `MOCK_STORES[id] ?? MOCK_STORES[DEFAULT_STORE_ID]`,
  // so any id it does not recognise — i.e. EVERY real store — silently returns
  // the bundled sample. With the live meta unavailable (dead tunnel, offline,
  // a 404) the screen then showed a genuine shop's page filled with the demo
  // store's city, address and hours. A shop in Jalgaon appeared to be in Pune.
  //
  // `isRealStore` distinguishes "browsing the bundled demo" from "a real id we
  // could not load". The sample is only ever shown when it IS the sample.
  const sample = id ? getStoreById(id) : undefined;
  // No live meta AND no bundled entry ⇒ there is nothing honest to render.
  const metaUnavailable = !live.loading && !live.meta && !sample;
  // Chrome only (hero colour, generic hours) and only when this genuinely IS
  // the demo store. A real store never borrows it — see getStoreById.
  const base = sample ?? getStoreById(DEFAULT_STORE_ID)!;
  const store = live.meta
    ? {
        ...base,
        id: live.meta.id,
        name: live.meta.name,
        phone: live.meta.phone,
        tagline: live.meta.categoryLabel,
        category: live.meta.categoryLabel,
        city: live.meta.city,
        // The shop's OWN address, overlaid like the name and phone were. Left
        // on `base` these came from the bundled demo store, so StoreContactCard
        // printed a stranger's street under a real shop's name — and a customer
        // collecting a self-pickup order would walk to it.
        //
        // Empty string, never the sample's value, when the shop has not set one:
        // formatStoreAddress drops blanks, so the row shows what exists (§19.8).
        door: live.meta.door,
        address: live.meta.address ?? "",
        landmark: live.meta.landmark ?? "",
        state: live.meta.state ?? "",
        pincode: live.meta.pincode ?? "",
        rating: live.meta.rating,
        reviewCount: live.meta.reviewCount,
        isLive: live.meta.isLive,
        lat: live.meta.lat ?? base.lat,
        lng: live.meta.lng ?? base.lng,
        categories: live.categories,
      }
    : base;

  const [productSearch, setProductSearch] = useState("");
  const [showShare, setShowShare] = useState(false);

  const { following, toggle: toggleFollow } = useFollow(store.id);
  const { muted, toggleMute } = useStoreMute(store.id);

  // Scan-to-follow: a QR / link with ?follow=1 follows once on landing (§30).
  const didAutoFollow = useRef(false);
  useEffect(() => {
    if (follow === "1" && !didAutoFollow.current && !following) {
      didAutoFollow.current = true;
      toggleFollow();
    }
  }, [follow, following, toggleFollow]);

  function handleFollow() {
    Haptics.selectionAsync();
    toggleFollow();
  }

  function handleMute() {
    Haptics.selectionAsync();
    toggleMute();
  }

  // ── Actions ───────────────────────────────────────────────────
  async function handleDirections() {
    await openDirections(store.lat, store.lng, store.name);
  }

  // Ride booking removed along with its button (see StoreActionButtons): there
  // is no ride system — no booking endpoint, no customer flow, and taskBridge
  // hardcodes every task as a delivery. Kept as a no-op so the prop contract
  // is unchanged for the day it becomes real.
  function handleBookRide() {}

  // Both of these were Alert popups saying "coming soon" — on the two controls
  // a shopper actually uses to buy something. The catalogue was already loaded
  // by useStoreCatalog on this very screen; nothing was missing but the route.
  function handleCategorySelect(cat: StoreProductCategory) {
    router.push(`/store-categories?id=${encodeURIComponent(store.id)}&cat=${encodeURIComponent(cat.key)}`);
  }

  function handleSearchSubmit() {
    const q = productSearch.trim();
    if (!q) return;
    router.push(`/store-categories?id=${encodeURIComponent(store.id)}&q=${encodeURIComponent(q)}`);
  }

  // A real shop we could not load is an ERROR, not a different shop. Showing
  // the demo store here is what made a Jalgaon kirana read as a Pune one.
  if (metaUnavailable) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["bottom"]}>
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

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["bottom"]}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Back button floating over hero ── */}
        <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 16), backgroundColor: store.heroBg }]}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: "rgba(0,0,0,0.35)" }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, {
            color:      "#fff",
            fontFamily: typography.fontFamily.semiBold,
            fontSize:   typography.size.md,
          }]}
            numberOfLines={1}
          >
            {store.name}
          </Text>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.backBtn, { backgroundColor: "rgba(0,0,0,0.35)" }]}
              activeOpacity={0.8}
              onPress={handleFollow}
            >
              <Ionicons
                name={following ? "heart" : "heart-outline"}
                size={20}
                color={following ? "#EF4444" : "#fff"}
              />
            </TouchableOpacity>

            {/* Mute this store's updates — only relevant once following (§30 P4b) */}
            {following && (
              <TouchableOpacity
                style={[styles.backBtn, { backgroundColor: "rgba(0,0,0,0.35)" }]}
                activeOpacity={0.8}
                onPress={handleMute}
              >
                <Ionicons
                  name={muted ? "notifications-off" : "notifications-outline"}
                  size={20}
                  color={muted ? "#FCD34D" : "#fff"}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.backBtn, { backgroundColor: "rgba(0,0,0,0.35)" }]}
              activeOpacity={0.8}
              onPress={() => setShowShare(true)}
            >
              <Ionicons name="share-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Hero banner ── */}
        <StoreHeroBanner store={store} />

        {/* ── Store name, address, status ── */}
        <StoreInfoHeader store={store} />

        {/* ── Action tiles ── */}
        <StoreActionButtons
          store={store}
          onDirections={handleDirections}
          onBookRide={handleBookRide}
        />

        {/* ── Product search bar ── */}
        <StoreProductSearch
          value={productSearch}
          onChange={setProductSearch}
          onClear={() => setProductSearch("")}
          onSubmit={handleSearchSubmit}
        />

        {/* ── Product categories ── */}
        <StoreProductCategories
          categories={store.categories}
          storeColor={store.heroBg}
          query={productSearch}
          onSelect={handleCategorySelect}
          onViewAll={() => router.push(`/store-categories?id=${store.id}`)}
        />

        {/* ── Opening hours ── */}
        <StoreHoursCard hours={store.hours} />

        {/* ── Contact info ── */}
        <StoreContactCard store={store} />

      </ScrollView>

      <StoreShareSheet
        visible={showShare}
        storeId={store.id}
        storeName={store.name}
        onClose={() => setShowShare(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // ── Header bar overlaid on hero ──
  headerBar: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 14,
    paddingTop:        12,
    paddingBottom:     8,
  },
  backBtn: {
    width:          36,
    height:         36,
    borderRadius:   18,
    alignItems:     "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex:      1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  headerActions: {
    flexDirection: "row",
    gap:           8,
  },

  // ── Scroll content ──
  content: {
    paddingBottom: 40,
    gap:           16,
  },
});
