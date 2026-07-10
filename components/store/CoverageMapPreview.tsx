// ============================================================
// COVERAGE MAP PREVIEW — Apana Store (Customer App)
//
// A REAL Mappls map centred on the customer's LIVE location, marking
// them as "You", with their coverage area drawn as a FILLED polygon
// (solid tinted region, no border outline — strokeWeight 0).
// The area comes from the backend (geolocation /customer/stores/coverage
// → the true sub-district / district from the §19.10 admin partition,
// the same shape the Testing/ harness renders) — not a synthetic ring.
//
//   nearest → sub-district area  (Nearest Coverage)
//   long    → district area      (Long Coverage)
//
// Live mode fills the real admin shape; mock / offline fills a local
// approximation around the pin (coverageService swaps the source).
// Bound to CoverageContext, so toggling repaints + re-zooms the same map.
// ============================================================

import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { useCoverage, COVERAGE_META } from "../../context/CoverageContext";
import { DEFAULT_LAT, DEFAULT_LNG } from "../../config/mapplsConfig";
import {
  fetchCoverageGeometry, CoverageGeometry, LatLng,
} from "../../services/coverageService";
import MapplsWebView, { MapPolygon, MapplsWebViewHandle } from "../map/MapplsWebView";

interface CoverageMapPreviewProps {
  // Fallback pin when GPS is denied/unavailable (e.g. the saved address).
  lat?:    number;
  lng?:    number;
  height?: number;
}

// Display zoom per scope — tuned to the BE outline resolutions
// (nearest r7 sub-district, long r6 district).
const NEAREST_ZOOM = 10.5;
const LONG_ZOOM    = 8.5;

export default function CoverageMapPreview({
  lat, lng, height = 200,
}: CoverageMapPreviewProps) {
  const { colors, isDark } = useTheme();
  const { coverage, meta } = useCoverage();
  const mapRef = useRef<MapplsWebViewHandle>(null);

  const [coords, setCoords] = useState<LatLng | null>(null);
  const [geo, setGeo]       = useState<CoverageGeometry | null>(null);
  const [mapErr, setErr]    = useState<string | null>(null);

  // 1) Resolve the customer's pin. Show the map IMMEDIATELY on the best
  //    pin we already have (saved address → city default) so it never
  //    hangs on a cold GPS fix, then upgrade to live GPS when it lands
  //    (last-known first for an instant move, then a fresh fix).
  useEffect(() => {
    let cancelled = false;
    setCoords((prev) => prev ?? { lat: lat ?? DEFAULT_LAT, lng: lng ?? DEFAULT_LNG });
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const last = await Location.getLastKnownPositionAsync();
        if (last && !cancelled) {
          setCoords({ lat: last.coords.latitude, lng: last.coords.longitude });
        }
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!cancelled) setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      } catch {
        // permission/GPS failure — the fallback pin already set above stands
      }
    })();
    return () => { cancelled = true; };
  }, [lat, lng]);

  // 2) Fetch the coverage outline for that pin (backend, or local
  //    approximation on failure — coverageService never rejects).
  useEffect(() => {
    if (!coords) return;
    let cancelled = false;
    fetchCoverageGeometry(coords.lat, coords.lng)
      .then((g) => { if (!cancelled) setGeo(g); })
      .catch(() => { if (!cancelled) setGeo(null); });
    return () => { cancelled = true; };
  }, [coords]);

  // 3) Active scope's area → ONE MultiPolygon overlay (Testing/ harness
  // polygon system: a single GeoJSON source + MapLibre fill layer with a
  // hairline fill-outline — solid tinted region, no border polyline).
  const polygons: MapPolygon[] = useMemo(() => {
    const scope = geo ? geo[coverage] : null;
    if (!scope || !scope.multi.length) return [];
    return [{
      id:           coverage,
      coordinates:  scope.multi,
      fillColor:    colors.primary,
      fillOpacity:  0.32,
      outlineColor: colors.primary,
      // Border: a GL line layer over the same shape (fill-outline-color
      // alone is a 1 px hairline and reads as no border at all).
      strokeColor:  colors.primary,
      strokeWeight: 2.5,
    }];
  }, [geo, coverage, colors.primary]);

  // Re-centre + re-zoom on the pin when scope changes (mount applies the
  // initial center/zoom; runtime changes go through panTo).
  useEffect(() => {
    if (!coords) return;
    mapRef.current?.panTo(coords.lat, coords.lng, coverage === "nearest" ? NEAREST_ZOOM : LONG_ZOOM);
  }, [coverage, coords]);

  // Caption — the real area name when the backend resolved one; an honest
  // "approximate" label on the local fallback. Never invents a name.
  const scope    = geo ? geo[coverage] : null;
  const areaName = scope?.name;
  const caption  = mapErr
    ? mapErr
    : !geo
      ? "Loading your coverage area…"
      : areaName
        ? `Showing ${areaName} · your ${meta.scopeWord}`
        : `Approximate ${meta.scopeWord} coverage · connect for your exact area`;

  return (
    <View style={styles.wrap}>
      <View style={[styles.mapBox, { height, borderColor: colors.border, backgroundColor: colors.background }]}>
        {coords ? (
          <MapplsWebView
            ref={mapRef}
            height={height}
            center={coords}
            zoom={coverage === "nearest" ? NEAREST_ZOOM : LONG_ZOOM}
            polygons={polygons}
            showUserDot
            userLocation={coords}
            onMapError={(reason) => setErr(reason)}
            isDark={isDark}
          />
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              Finding your location…
            </Text>
          </View>
        )}
      </View>

      {/* Scope caption */}
      <View style={styles.captionRow}>
        <Ionicons
          name={mapErr ? "alert-circle-outline" : "navigate-circle-outline"}
          size={13}
          color={mapErr ? colors.danger : colors.primary}
        />
        <Text
          numberOfLines={1}
          style={[styles.caption, {
            color:      mapErr ? colors.danger : colors.subText,
            fontFamily: typography.fontFamily.regular,
            fontSize:   11,
          }]}
        >
          {caption}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  mapBox: {
    borderRadius: 16,
    borderWidth:  1,
    overflow:     "hidden",
  },
  loading: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
    gap:            8,
  },
  loadingText: {},
  captionRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           5,
    paddingHorizontal: 2,
  },
  caption: { flex: 1 },
});
