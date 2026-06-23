// ============================================================
// MAP VIEW FEED — Apana Store (Home Screen, Stores Mode)
//
// Real MapMyIndia (Mappls) store-discovery map.
// Renders via MapplsWebView (react-native-webview + Mappls JS SDK).
//
// Flow:
//   Mount → fetchNearbyMapPins() → StoreMapPin[]
//         → convert to MapMarker[] → pass to MapplsWebView
//   Tap pin → selectedPin info card
//   Tap "Visit" → /store-detail?id=
//
// API wiring:
//   Real GPS lat/lng: replace DEFAULT_LAT/DEFAULT_LNG with
//     expo-location getCurrentPositionAsync() once the user
//     has granted location permission (stored in LocationContext).
//   Real nearby stores: fetchNearbyMapPins() already calls
//     GET /stores/nearby when you swap the stub.
// ============================================================

import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../../../theme/useTheme";
import { typography } from "../../../../theme/typography";
import { MAP_CATEGORY_FILTERS, StoreMapPin } from "../../../../data/nearbyMapData";
import { DEFAULT_ZOOM } from "../../../../config/mapplsConfig";
import { useNearbyStores } from "../../../../hooks/useNearbyStores";
import { useDeviceLocation } from "../../../../hooks/useDeviceLocation";
import { useCoverage, COVERAGE_K } from "../../../../context/CoverageContext";
import CoverageToggle from "../../../store/CoverageToggle";
import MapplsWebView, { MapMarker, MapplsWebViewHandle } from "../../../map/MapplsWebView";
import MapSearchBar from "./MapSearchBar";
import MapFullscreenModal from "./MapFullscreenModal";

const { height: SH } = Dimensions.get("window");
const MAP_H = SH * 0.52;

// ── Convert StoreMapPin → MapMarker ──────────────────────────
function pinToMarker(pin: StoreMapPin): MapMarker {
  return {
    id:       pin.id,
    lat:      pin.lat,
    lng:      pin.lng,
    title:    pin.name,
    subtitle: `${pin.rating}⭐  ·  ${pin.distanceKm} km`,
    icon:     "store",
    isLive:   pin.isLive,
    isOpen:   pin.isOpen,
  };
}

export default function MapViewFeed() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();
  const mapRef             = useRef<MapplsWebViewHandle>(null);

  // ── Nearby stores via the H3 cell cache (§19.3 / §19.6) ───
  // Map centre → k-ring of cells → cellCache (memory-first). The ring
  // radius follows the customer's coverage setting: Nearest tightens to
  // their sub-district, Long widens to the district — so switching it
  // visibly grows / shrinks what the map shows (Testing/README §Coverage).
  // Panning within a cell never refetches; revisits are instant.
  // TODO: swap DEFAULT for live GPS from LocationContext.
  const { coverage } = useCoverage();
  // Real device GPS for the map centre (falls back to DEFAULT until a fix).
  const { center, located } = useDeviceLocation();
  const { stores: pins, loading, error: storeErr, refetch } = useNearbyStores(center, {
    k: COVERAGE_K[coverage],
  });

  // The Mappls SDK can fail to load independently of the store fetch.
  const [mapErr, setMapErr] = useState<string | null>(null);
  const fetchErr = storeErr ?? mapErr;

  // Retry drops the cache + clears the map error; the hook refetches
  // on the next cell read.
  const loadPins = useCallback(() => { setMapErr(null); refetch(); }, [refetch]);

  // ── Filter + search + selection state ─────────────────────
  const [activeCat,   setActiveCat]   = useState("all");
  const [query,       setQuery]       = useState("");
  const [fullscreen,  setFullscreen]  = useState(false);
  const [selectedPin, setSelectedPin] = useState<StoreMapPin | null>(null);

  // Once a real GPS fix lands, glide the already-mounted map to it (no reload).
  useEffect(() => {
    if (located) mapRef.current?.panTo(center.lat, center.lng);
  }, [located, center.lat, center.lng]);

  // ── Filtered pins: category chip + free-text search (name / what they
  //    sell via tags / category). Memoised so the markers ref stays stable. ──
  const visiblePins = useMemo(() => {
    const byCat = activeCat === "all" ? pins : pins.filter(p => p.category === activeCat);
    const q = query.trim().toLowerCase();
    if (!q) return byCat;
    return byCat.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)),
    );
  }, [pins, activeCat, query]);

  // ── Markers for the map (memoised — MapplsWebView auto-syncs) ──
  const markers = useMemo(
    () => visiblePins.map(pinToMarker),
    [visiblePins],
  );

  // ── Map event handlers ────────────────────────────────────
  const handleMarkerPress = useCallback((id: string) => {
    const pin = pins.find(p => p.id === id) ?? null;
    setSelectedPin(pin);
    if (pin) {
      // Pan the map to the tapped store
      mapRef.current?.panTo(pin.lat, pin.lng);
    }
  }, [pins]);

  const handleMapPress = useCallback(() => {
    setSelectedPin(null);
  }, []);

  // ── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.centred, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
          Loading nearby stores…
        </Text>
      </View>
    );
  }

  // ── Error state ───────────────────────────────────────────
  if (fetchErr) {
    return (
      <View style={[styles.centred, { backgroundColor: colors.background }]}>
        <Ionicons name="warning-outline" size={36} color={colors.danger} />
        <Text style={[styles.errTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
          Map Unavailable
        </Text>
        <Text style={[styles.errSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
          {fetchErr}
        </Text>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          onPress={loadPins}
          activeOpacity={0.85}
        >
          <Ionicons name="refresh-outline" size={15} color="#fff" />
          <Text style={[styles.retryText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Main render ───────────────────────────────────────────
  return (
    <View style={styles.root}>

      {/* ── Real Mappls map (+ fullscreen toggle) ── */}
      <View style={styles.mapWrap}>
        <MapplsWebView
          ref={mapRef}
          height={MAP_H}
          center={center}
          zoom={DEFAULT_ZOOM}
          markers={markers}
          showUserDot
          onMarkerPress={handleMarkerPress}
          onMapPress={handleMapPress}
          onMapError={(reason) => {
            // Translate raw SDK error codes into user-friendly copy
            const msg =
              reason.startsWith("mappls_undefined")      ? "Map SDK could not load. Please check your internet connection." :
              reason.startsWith("cdn_load_failed")       ? "Map servers unreachable. Please check your internet connection." :
              reason.startsWith("init_timeout")          ? "Map took too long to start. Please retry." :
              reason.startsWith("map_construct_failed")  ? "Map failed to initialise. Please retry." :
              "Map is unavailable right now. Please retry.";
            setMapErr(msg);
          }}
          isDark={isDark}
        />
        <TouchableOpacity
          style={[styles.expandBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setFullscreen(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="expand-outline" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* ── In-map search (store or product) ── */}
      <View style={styles.searchRow}>
        <MapSearchBar value={query} onChangeText={setQuery} />
      </View>

      {/* ── Coverage scope — Nearest vs Long, mirrors Profile ── */}
      <CoverageToggle />

      {/* ── Category filter chips ─────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterScroll, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
        contentContainerStyle={styles.filterContent}
      >
        {MAP_CATEGORY_FILTERS.map(cf => {
          const isActive = cf.key === activeCat;
          return (
            <TouchableOpacity
              key={cf.key}
              style={[styles.filterChip, {
                backgroundColor: isActive ? colors.primary : colors.background,
                borderColor:     isActive ? colors.primary : colors.border,
              }]}
              onPress={() => { setActiveCat(cf.key); setSelectedPin(null); }}
              activeOpacity={0.8}
            >
              <Ionicons name={cf.icon as any} size={12} color={isActive ? "#fff" : colors.subText} />
              <Text style={[styles.filterLabel, {
                color:      isActive ? "#fff" : colors.subText,
                fontFamily: isActive ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                fontSize:   typography.size.xs,
              }]}>
                {cf.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Selected store info card ──────────────────────── */}
      {selectedPin && (
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.infoThumb, { backgroundColor: selectedPin.iconBg }]}>
            <Ionicons name={selectedPin.icon as any} size={26} color={selectedPin.accentColor} />
          </View>
          <View style={styles.infoBody}>
            <View style={styles.infoNameRow}>
              <Text numberOfLines={1} style={[styles.infoName, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                {selectedPin.name}
              </Text>
              <View style={[styles.statusPill, { backgroundColor: selectedPin.isOpen ? "#DCFCE7" : "#FEE2E2" }]}>
                {selectedPin.isLive && <View style={styles.liveDot} />}
                <Text style={[styles.statusText, {
                  color:      selectedPin.isOpen ? "#15803D" : "#DC2626",
                  fontFamily: typography.fontFamily.bold,
                  fontSize:   9,
                }]}>
                  {selectedPin.isLive ? "LIVE" : selectedPin.isOpen ? "OPEN" : "CLOSED"}
                </Text>
              </View>
            </View>
            <View style={styles.infoMeta}>
              <Ionicons name="star" size={11} color="#F59E0B" />
              <Text style={[styles.infoRating, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                {selectedPin.rating}
              </Text>
              <View style={[styles.metaDot, { backgroundColor: colors.border }]} />
              <Ionicons name="location-outline" size={11} color={colors.subText} />
              <Text style={[styles.infoDim, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {selectedPin.distanceKm} km away
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.infoBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push(`/store-detail?id=${selectedPin.id}` as any)}
            activeOpacity={0.8}
          >
            <Text style={[styles.infoBtnText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
              Visit
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Nearby store cards strip ──────────────────────── */}
      {!selectedPin && (
        <>
          <Text style={[styles.nearbyLabel, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            NEARBY STORES
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContent}
          >
            {visiblePins.map(pin => (
              <TouchableOpacity
                key={pin.id}
                style={[styles.storeCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => {
                  setSelectedPin(pin);
                  mapRef.current?.panTo(pin.lat, pin.lng);
                }}
                activeOpacity={0.88}
              >
                <View style={[styles.cardThumb, { backgroundColor: pin.iconBg }]}>
                  <Ionicons name={pin.icon as any} size={22} color={pin.accentColor} />
                </View>
                <Text numberOfLines={2} style={[styles.cardName, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                  {pin.name}
                </Text>
                <View style={styles.cardMeta}>
                  <Ionicons name="star" size={10} color="#F59E0B" />
                  <Text style={[styles.cardRating, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: 10 }]}>
                    {pin.rating}
                  </Text>
                  <Text style={[styles.cardDist, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 10 }]}>
                    · {pin.distanceKm} km
                  </Text>
                </View>
                <View style={[styles.cardStatus, { backgroundColor: pin.isOpen ? "#DCFCE7" : "#FEE2E2" }]}>
                  {pin.isLive && <View style={styles.cardLiveDot} />}
                  <Text style={[styles.cardStatusText, {
                    color:      pin.isOpen ? "#15803D" : "#DC2626",
                    fontFamily: typography.fontFamily.bold,
                    fontSize:   8.5,
                  }]}>
                    {pin.isLive ? "LIVE" : pin.isOpen ? "OPEN" : "CLOSED"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {/* ── Fullscreen map ── */}
      <MapFullscreenModal
        visible={fullscreen}
        onClose={() => setFullscreen(false)}
        center={center}
        zoom={DEFAULT_ZOOM}
        markers={markers}
        pins={visiblePins}
        filters={MAP_CATEGORY_FILTERS}
        activeCat={activeCat}
        onCatChange={setActiveCat}
        query={query}
        onQueryChange={setQuery}
        onVisit={(id) => { setFullscreen(false); router.push(`/store-detail?id=${id}` as any); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Map + fullscreen toggle
  mapWrap: { position: "relative" },
  expandBtn: {
    position: "absolute", top: 12, right: 12,
    width: 38, height: 38, borderRadius: 10, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 4,
  },
  searchRow: { paddingHorizontal: 16, paddingTop: 12 },

  // Loading / error
  centred: {
    minHeight:      300,
    alignItems:     "center",
    justifyContent: "center",
    gap:            12,
    padding:        32,
  },
  loadingText: { marginTop: 4 },
  errTitle: {},
  errSub:   { textAlign: "center", lineHeight: 20 },
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

  // Category filter bar
  filterScroll: { borderBottomWidth: 1 },
  filterContent: {
    flexDirection:     "row",
    gap:               8,
    paddingHorizontal: 16,
    paddingVertical:   10,
  },
  filterChip: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    paddingHorizontal: 12,
    paddingVertical:   7,
    borderRadius:      20,
    borderWidth:       1,
  },
  filterLabel: {},

  // Selected store info card
  infoCard: {
    flexDirection:     "row",
    alignItems:        "center",
    marginHorizontal:  16,
    marginTop:         12,
    padding:           12,
    borderRadius:      14,
    borderWidth:       1,
    gap:               12,
  },
  infoThumb: {
    width:          52,
    height:         52,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  infoBody:    { flex: 1, gap: 4 },
  infoNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoName:    { flex: 1 },
  statusPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 7,
    paddingVertical:   2,
    borderRadius:      20,
    flexShrink:        0,
  },
  liveDot: {
    width:           5,
    height:          5,
    borderRadius:    3,
    backgroundColor: "#16A34A",
  },
  statusText: {},
  infoMeta: { flexDirection: "row", alignItems: "center", gap: 3 },
  infoRating: {},
  metaDot: { width: 3, height: 3, borderRadius: 2, marginHorizontal: 2 },
  infoDim:  {},
  infoBtn: {
    paddingHorizontal: 14,
    paddingVertical:   9,
    borderRadius:      10,
    flexShrink:        0,
  },
  infoBtnText: { color: "#fff" },

  // Nearby label + cards strip
  nearbyLabel: {
    paddingHorizontal: 16,
    paddingTop:        14,
    paddingBottom:     6,
    letterSpacing:     0.8,
  },
  cardsContent: {
    flexDirection:     "row",
    gap:               10,
    paddingHorizontal: 16,
    paddingBottom:     20,
  },
  storeCard: {
    width:        130,
    borderRadius: 14,
    borderWidth:  1,
    padding:      10,
    gap:          6,
  },
  cardThumb: {
    width:          48,
    height:         48,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },
  cardName:   { lineHeight: 15 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 2 },
  cardRating: {},
  cardDist:   {},
  cardStatus: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 7,
    paddingVertical:   2,
    borderRadius:      20,
    alignSelf:         "flex-start",
  },
  cardLiveDot: {
    width:           5,
    height:          5,
    borderRadius:    3,
    backgroundColor: "#16A34A",
  },
  cardStatusText: {},
});
