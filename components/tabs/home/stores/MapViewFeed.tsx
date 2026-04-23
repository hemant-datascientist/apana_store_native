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

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../../../theme/useTheme";
import { typography } from "../../../../theme/typography";
import { fetchNearbyMapPins, StoreMapPin } from "../../../../services/nearbyMapService";
import { MAP_CATEGORY_FILTERS } from "../../../../data/nearbyMapData";
import { DEFAULT_LAT, DEFAULT_LNG, DEFAULT_ZOOM } from "../../../../config/mapplsConfig";
import MapplsWebView, { MapMarker, MapplsWebViewHandle } from "../../../map/MapplsWebView";

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

  // ── Data fetch ────────────────────────────────────────────
  const [pins,     setPins]     = useState<StoreMapPin[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [fetchErr, setFetchErr] = useState<string | null>(null);

  const loadPins = useCallback(() => {
    setLoading(true);
    setFetchErr(null);

    // TODO: pass real lat/lng from LocationContext / expo-location
    fetchNearbyMapPins()
      .then(data => setPins(data))
      .catch(err  => setFetchErr(err?.message ?? "Could not load nearby stores."))
      .finally(()  => setLoading(false));
  }, []);

  useEffect(() => { loadPins(); }, [loadPins]);

  // ── Filter + selection state ──────────────────────────────
  const [activeCat,   setActiveCat]   = useState("all");
  const [selectedPin, setSelectedPin] = useState<StoreMapPin | null>(null);

  // ── Filtered pins (memoised so markers array ref is stable) ──
  const visiblePins = useMemo(
    () => (activeCat === "all" ? pins : pins.filter(p => p.category === activeCat)),
    [pins, activeCat],
  );

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

      {/* ── Real Mappls map ── */}
      <MapplsWebView
        ref={mapRef}
        height={MAP_H}
        center={{ lat: DEFAULT_LAT, lng: DEFAULT_LNG }}
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
          setFetchErr(msg);
        }}
        isDark={isDark}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

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
