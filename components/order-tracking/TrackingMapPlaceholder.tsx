// ============================================================
// TRACKING MAP — Apana Store (Order Tracking Screen)
//
// Real MapMyIndia (Mappls) live-tracking map rendered via
// MapplsWebView (react-native-webview + Mappls Map JS SDK).
//
// Shows:
//   • Partner marker    — current partner/driver location
//   • Customer marker   — delivery destination
//   • Route line        — drawn between partner → customer
//   • ETA overlay card  — top-right corner, mode-coloured
//
// Real-time updates:
//   Feed real lat/lng via the imperative ref:
//     mapRef.current?.setMarkers([updatedPartnerMarker, customerMarker])
//   WebSocket: WS /ws/tracking/:orderId → { partnerLat, partnerLng }
//   Call mapRef.current?.panTo(partnerLat, partnerLng) on each update.
//
// Props (unchanged from the old placeholder — no screen rewrites needed):
//   mode            — "pickup" | "delivery" | "ride"
//   etaMinutes      — shown in the ETA card
//   partnerInitials — fallback text inside marker (until we have a photo)
//   partnerColor    — accent colour matching the mode
//   partnerLocation — real-time lat/lng of the partner (optional)
//   customerLocation— lat/lng of the delivery destination (optional)
// ============================================================

import React, { useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Ionicons }    from "@expo/vector-icons";
import useTheme        from "../../theme/useTheme";
import { typography }  from "../../theme/typography";
import { FulfillmentMode } from "../../data/cartData";
import { TRACKING_MODE_CONFIG } from "../../data/orderTrackingData";
import MapplsWebView, { MapMarker, MapplsWebViewHandle } from "../map/MapplsWebView";
import { usePartnerMarker, PartnerFix } from "../../hooks/usePartnerMarker";
import {
  DEFAULT_LAT, DEFAULT_LNG,
} from "../../config/mapplsConfig";

const SW = Dimensions.get("window").width;
const MAP_H = 200;

// ── Demo locations (Pune) — MOCK MODE ONLY ──
// The partner starts a few blocks from the customer so the sample order has
// something to animate. These must never stand in for a real order: a
// destination marker in the wrong city, with a route line drawn to it and a
// genuinely moving rider marker beside it, reads as correct.
const DEFAULT_PARTNER_LAT  = 18.5235;
const DEFAULT_PARTNER_LNG  = 73.8530;

interface TrackingMapProps {
  mode:             FulfillmentMode;
  /** Null when no ETA can be computed — the map then shows the partner state
   *  rather than a fabricated countdown. */
  etaMinutes:       number | null;
  partnerInitials:  string;
  partnerColor:     string;
  // Live partner stream (§19.5). Fed sparse fixes; usePartnerMarker
  // smooths them (Kalman + reckoning + hex-snap) into a 60fps marker.
  fix?:              PartnerFix | null;
  // Static fallbacks when no live fix is available.
  partnerLocation?:  { lat: number; lng: number };
  customerLocation?: { lat: number; lng: number };
}

export default function TrackingMapPlaceholder({
  mode, etaMinutes, partnerInitials, partnerColor,
  fix, partnerLocation, customerLocation,
}: TrackingMapProps) {
  const { colors, isDark } = useTheme();
  const cfg                = TRACKING_MODE_CONFIG[mode];
  const mapRef             = useRef<MapplsWebViewHandle>(null);

  // ── Smoothed live marker (§19.5) — falls back to static coords ──
  const marker = usePartnerMarker(fix ?? null);
  const isStale = marker?.mode === "stale";

  const pLat = marker?.lat ?? partnerLocation?.lat ?? DEFAULT_PARTNER_LAT;
  const pLng = marker?.lng ?? partnerLocation?.lng ?? DEFAULT_PARTNER_LNG;
  // No fallback. An order whose address has no pin has no destination to draw,
  // and the marker + route line are omitted rather than pointed at a default.
  const cLat = customerLocation?.lat ?? null;
  const cLng = customerLocation?.lng ?? null;
  const hasDrop = cLat != null && cLng != null;

  // ── Map centre — stable midpoint from the START fix, not the live
  // marker, so the map doesn't chase the rider every frame. ────────
  const startPLat = partnerLocation?.lat ?? DEFAULT_PARTNER_LAT;
  const startPLng = partnerLocation?.lng ?? DEFAULT_PARTNER_LNG;
  // Centre between the two when there is a drop; on the partner alone when
  // there is not.
  const centerLat = hasDrop ? (startPLat + cLat) / 2 : startPLat;
  const centerLng = hasDrop ? (startPLng + cLng) / 2 : startPLng;

  // ── Markers ───────────────────────────────────────────────
  const markers: MapMarker[] = [
    {
      id:       "partner",
      lat:      pLat,
      lng:      pLng,
      title:    mode === "ride" ? "Your Driver" : "Delivery Partner",
      subtitle: isStale || etaMinutes == null
        ? `${partnerInitials} · locating…`
        : `${partnerInitials} · ETA ~${etaMinutes} min`,
      icon:     "partner",
      isLive:   !isStale,
      isOpen:   true,
    },
  ];
  if (hasDrop) {
    markers.push({
      id:       "customer",
      lat:      cLat,
      lng:      cLng,
      title:    mode === "pickup" ? "Store" : "Your Location",
      icon:     "customer",
      isOpen:   true,
    });
  }

  return (
    <View style={[styles.wrap, { borderColor: colors.border }]}>

      {/* ── Real Mappls map ── */}
      <MapplsWebView
        ref={mapRef}
        height={MAP_H}
        center={{ lat: centerLat, lng: centerLng }}
        zoom={14}
        markers={markers}
        routeLine={hasDrop ? [{ lat: pLat, lng: pLng }, { lat: cLat, lng: cLng }] : undefined}
        isDark={isDark}
      />

      {/* ── ETA overlay ── */}
      <View style={[styles.etaBubble, { backgroundColor: isStale ? colors.subText : cfg.color }]}>
        <Ionicons name={isStale ? "navigate-outline" : (cfg.icon as keyof typeof Ionicons.glyphMap)} size={13} color="#fff" />
        <Text style={[styles.etaText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
          {isStale || etaMinutes == null ? "Locating…" : `~${etaMinutes} min`}
        </Text>
      </View>

      {/* ── Mappls attribution ── */}
      <View style={[styles.attribution, { backgroundColor: colors.card + "CC" }]}>
        <Text style={[styles.attributionText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 9 }]}>
          Live map powered by Mappls (MapMyIndia)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height:       MAP_H,
    borderRadius: 16,
    borderWidth:  1,
    overflow:     "hidden",
    position:     "relative",
  },

  // ETA card — floats top-right over the map
  etaBubble: {
    position:          "absolute",
    top:               10,
    right:             10,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    paddingHorizontal: 10,
    paddingVertical:   5,
    borderRadius:      20,
    zIndex:            10,
    elevation:         4,
  },
  etaText: { color: "#fff" },

  // Attribution
  attribution: {
    position:        "absolute",
    bottom:          0,
    left:            0,
    right:           0,
    paddingVertical: 4,
    alignItems:      "center",
    zIndex:          10,
  },
  attributionText: {},
});
