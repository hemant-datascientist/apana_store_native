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

import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { View, StyleSheet, StatusBar, Alert } from "react-native";
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
import MapStoreCard from "../components/map-screen/MapStoreCard";

const NAVY = "#0F4C81";

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

  const { center, located } = useDeviceLocation();
  const { stores: pins }    = useNearbyStores(center, { k: COVERAGE_K[coverage] });
  const liveStats           = useStoreLiveStats({ city: selectedAddress.city, mockStateTotal: STORES_LIVE_COUNT });

  const [mode,            setMode]    = useState<MapMode>("stores");
  const [query,           setQuery]   = useState("");
  const [product,         setProduct] = useState<MapProduct | null>(null);
  const [selectedPin,     setSelected]= useState<StoreMapPin | null>(null);
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

  // The card is ALWAYS shown for a store (matches the design): the tapped pin
  // if it's still in view, else the nearest visible store.
  const activePin = useMemo(() => {
    if (selectedPin && visiblePins.some(p => p.id === selectedPin.id)) return selectedPin;
    return visiblePins[0] ?? null;
  }, [selectedPin, visiblePins]);

  // Product suggestions only while typing in Products mode (before a pick).
  const productResults = useMemo(
    () => (mode === "products" && !product ? searchProducts(query) : []),
    [mode, product, query],
  );

  const locationLabel = `${selectedAddress.city}, ${selectedAddress.state} – ${selectedAddress.pincode}`;

  // ── Handlers ──────────────────────────────────────────────
  const handleMarker = useCallback((id: string) => {
    const pin = pins.find(p => p.id === id) ?? null;
    setSelected(pin);
    if (pin) mapRef.current?.panTo(pin.lat, pin.lng);
  }, [pins]);

  function changeMode(m: MapMode) {
    setMode(m);
    setQuery("");
    setProduct(null);
    setSelected(null);
  }

  function pickProduct(p: MapProduct) {
    setProduct(p);
    setQuery(p.name);
    setSelected(null);
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
            onMarkerPress={handleMarker}
            onMapPress={() => setSelected(null)}
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

        {/* Floating store card — always shown for the nearest / tapped store */}
        {activePin && (
          <View style={[styles.cardWrap, { bottom: insets.bottom + 12 }]}>
            <MapStoreCard
              pin={activePin}
              onGetDirections={() => openStore(activePin.id)}
              onViewStock={() => openStore(activePin.id)}
              onBookRide={() => openStore(activePin.id)}
            />
          </View>
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
  cardWrap: { position: "absolute", left: 12, right: 12, bottom: 16 },
});
