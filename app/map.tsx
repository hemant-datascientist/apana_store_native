// ============================================================
// MAP SCREEN — Apana Store (full-screen store discovery)  ·  /map
//
// Slim orchestrator. Navy header (back · Map · help, location + Stores-Live,
// Find Products | Find Stores, search) over a full Mappls map with a control
// rail and a floating store card.
//
//   Find Stores   → search filters pins by store name.
//   Find Products → search a product, pick it, map narrows to the stores
//                   that stock it (data/mapProductData availability index).
//
// Data is FE-first: store pins via the §19.6 cell cache (stub), product→store
// via mapProductData. BE swap points are documented in those modules.
// ============================================================

import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View, StyleSheet, StatusBar, Alert, FlatList, Dimensions,
  NativeScrollEvent, NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useTheme from "../theme/useTheme";
import { useLocation } from "../context/LocationContext";
import { useCoverage, COVERAGE_K } from "../context/CoverageContext";
import { useDeviceLocation } from "../hooks/useDeviceLocation";
import { useNearbyStores } from "../hooks/useNearbyStores";
import { useStoreLiveStats } from "../hooks/useStoreLiveStats";
import { DEFAULT_ZOOM } from "../config/mapplsConfig";
import { STORES_LIVE_COUNT } from "../data/homeData";
import { StoreMapPin } from "../data/nearbyMapData";
import { MapProduct, searchProducts } from "../data/mapProductData";
import MapplsWebView, { MapMarker, MapplsWebViewHandle } from "../components/map/MapplsWebView";
import MapScreenHeader from "../components/map-screen/MapScreenHeader";
import MapLocationBar from "../components/map-screen/MapLocationBar";
import MapModeToggle, { MapMode } from "../components/map-screen/MapModeToggle";
import MapSearchRow from "../components/map-screen/MapSearchRow";
import MapProductPicker from "../components/map-screen/MapProductPicker";
import MapControlRail from "../components/map-screen/MapControlRail";
import MapStoreCard, { MAP_CARD_HEIGHT } from "../components/map-screen/MapStoreCard";

const NAVY = "#0F4C81";

// Bottom store-card pager: one card per nearby store, swipe to switch.
const SCREEN_W = Dimensions.get("window").width;
const SIDE_PAD = 16;
const CARD_GAP = 12;
const CARD_W   = SCREEN_W - SIDE_PAD * 2 - 22;  // leave a peek of the next card
const PAGER_H  = MAP_CARD_HEIGHT + 18;          // card height + shadow room
const SNAP     = CARD_W + CARD_GAP;

function pinToMarker(pin: StoreMapPin): MapMarker {
  return {
    id: pin.id, lat: pin.lat, lng: pin.lng,
    title: pin.name, subtitle: `${pin.rating}⭐ · ${pin.distanceKm} km`,
    icon: "store", isLive: pin.isLive, isOpen: pin.isOpen,
  };
}

export default function MapScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();
  const { selectedAddress } = useLocation();
  const { coverage }       = useCoverage();
  const insets             = useSafeAreaInsets();
  const mapRef             = useRef<MapplsWebViewHandle>(null);
  const pagerRef           = useRef<FlatList<StoreMapPin>>(null);

  const { center, located } = useDeviceLocation();
  const { stores: pins }    = useNearbyStores(center, { k: COVERAGE_K[coverage] });
  const liveStats           = useStoreLiveStats({ city: selectedAddress.city, mockStateTotal: STORES_LIVE_COUNT });

  const [mode,            setMode]    = useState<MapMode>("stores");
  const [query,           setQuery]   = useState("");
  const [product,         setProduct] = useState<MapProduct | null>(null);
  const [mapH,            setMapH]    = useState(0);

  // Recenter the live map once a real GPS fix lands.
  useEffect(() => { if (located) mapRef.current?.panTo(center.lat, center.lng); }, [located, center.lat, center.lng]);

  // Visible pins per mode: Products → stores stocking the chosen product;
  // Stores → name search; otherwise all nearby pins. Sorted nearest-first so
  // the default store card is the closest shop.
  const visiblePins = useMemo(() => {
    let list: StoreMapPin[];
    if (mode === "products") {
      list = product ? pins.filter(p => product.availableStoreIds.includes(p.id)) : pins;
    } else {
      const q = query.trim().toLowerCase();
      list = q ? pins.filter(p => p.name.toLowerCase().includes(q)) : pins;
    }
    return [...list].sort((a, b) => a.distanceKm - b.distanceKm);
  }, [mode, product, query, pins]);

  const markers = useMemo(() => visiblePins.map(pinToMarker), [visiblePins]);

  // Product suggestions only while typing in Products mode (before a pick).
  const productResults = useMemo(
    () => (mode === "products" && !product ? searchProducts(query) : []),
    [mode, product, query],
  );

  const locationLabel = `${selectedAddress.city}, ${selectedAddress.state} – ${selectedAddress.pincode}`;

  // ── Handlers ──────────────────────────────────────────────
  // Tapping a map pin pans the map and scrolls the card pager to that store.
  function handleMarker(id: string) {
    const pin = pins.find(p => p.id === id) ?? null;
    if (!pin) return;
    mapRef.current?.panTo(pin.lat, pin.lng);
    const idx = visiblePins.findIndex(p => p.id === id);
    if (idx >= 0) pagerRef.current?.scrollToOffset({ offset: idx * SNAP, animated: true });
  }

  // Swiping the pager pans the map to the card now centred.
  function onPagerSettle(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SNAP);
    const p = visiblePins[idx];
    if (p) mapRef.current?.panTo(p.lat, p.lng);
  }

  function changeMode(m: MapMode) {
    setMode(m);
    setQuery("");
    setProduct(null);
  }

  function pickProduct(p: MapProduct) {
    setProduct(p);
    setQuery(p.name);
    const first = pins.find(s => p.availableStoreIds.includes(s.id));
    if (first) mapRef.current?.panTo(first.lat, first.lng);
  }

  function onQueryChange(t: string) {
    setQuery(t);
    if (product) setProduct(null); // editing the text clears the locked product
  }

  const recenter = () => mapRef.current?.panTo(center.lat, center.lng, 15);
  const openStore = (id: string) => router.push(`/store-detail?id=${id}` as any);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />

      {/* ── Navy header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: NAVY }]} edges={["top"]}>
        <MapScreenHeader onBack={() => router.back()} onHelp={() => Alert.alert("Map", "Tap a pin to see the store. Use Find Products to locate an item nearby.")} />
        <MapLocationBar
          label={locationLabel}
          storesLive={liveStats.stats?.totalLive ?? null}
          onPressLocation={() => router.push("/address-book")}
        />
        <MapModeToggle mode={mode} onChange={changeMode} />
        <MapSearchRow
          value={query}
          onChangeText={onQueryChange}
          mode={mode}
          onMenu={() => Alert.alert("Filters", "Map filters coming soon.")}
          onScan={() => router.push("/scanner")}
          onCart={() => router.push("/cart")}
        />
      </SafeAreaView>

      {/* ── Map area ── */}
      <View style={styles.mapArea} onLayout={(e) => setMapH(e.nativeEvent.layout.height)}>
        {mapH > 0 && (
          <MapplsWebView
            ref={mapRef}
            height={mapH}
            center={center}
            zoom={DEFAULT_ZOOM}
            markers={markers}
            zoomControl={false}
            showUserDot
            userLocation={center}
            onMarkerPress={handleMarker}
            isDark={isDark}
          />
        )}

        {/* Product suggestions overlay the top of the map */}
        {productResults.length > 0 && (
          <View style={styles.pickerWrap}>
            <MapProductPicker results={productResults} onSelect={pickProduct} />
          </View>
        )}

        {/* Control rail */}
        <MapControlRail
          onZoomIn={() => mapRef.current?.zoomIn()}
          onZoomOut={() => mapRef.current?.zoomOut()}
          onLocate={recenter}
          onLayers={() => Alert.alert("Layers", "Map layers coming soon.")}
          onNavigate={recenter}
        />

        {/* Floating store-card pager — one card per nearby store, swipe to switch */}
        {visiblePins.length > 0 && (
          <FlatList
            ref={pagerRef}
            style={[styles.pager, { height: PAGER_H, bottom: insets.bottom + 12 }]}
            data={visiblePins}
            keyExtractor={(p) => p.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={SNAP}
            snapToAlignment="start"
            disableIntervalMomentum
            contentContainerStyle={styles.pagerContent}
            onMomentumScrollEnd={onPagerSettle}
            renderItem={({ item }) => (
              <View style={{ width: CARD_W, marginRight: CARD_GAP }}>
                <MapStoreCard
                  pin={item}
                  onGetDirections={() => openStore(item.id)}
                  onViewStock={() => openStore(item.id)}
                  onBookRide={() => openStore(item.id)}
                />
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingBottom: 4 },
  mapArea: { flex: 1, position: "relative" },
  pickerWrap: { position: "absolute", top: 0, left: 0, right: 0 },
  pager: { position: "absolute", left: 0, right: 0, flexGrow: 0 },
  pagerContent: { paddingHorizontal: SIDE_PAD, alignItems: "center" },
});
