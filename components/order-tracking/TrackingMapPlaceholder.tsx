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
import {
  DEFAULT_LAT, DEFAULT_LNG,
} from "../../config/mapplsConfig";

const SW = Dimensions.get("window").width;
const MAP_H = 200;

// ── Default locations (Pune) — replaced by real coords from WS ──
// Partner starts a few blocks away from the customer for demo purposes.
const DEFAULT_PARTNER_LAT  = 18.5235;
const DEFAULT_PARTNER_LNG  = 73.8530;
const DEFAULT_CUSTOMER_LAT = DEFAULT_LAT;
const DEFAULT_CUSTOMER_LNG = DEFAULT_LNG;

interface TrackingMapProps {
  mode:             FulfillmentMode;
  etaMinutes:       number;
  partnerInitials:  string;
  partnerColor:     string;
  // Real-time location — optional; defaults to Pune mock coords
  partnerLocation?:  { lat: number; lng: number };
  customerLocation?: { lat: number; lng: number };
}

export default function TrackingMapPlaceholder({
  mode, etaMinutes, partnerInitials, partnerColor,
  partnerLocation, customerLocation,
}: TrackingMapProps) {
  const { colors, isDark } = useTheme();
  const cfg                = TRACKING_MODE_CONFIG[mode];
  const mapRef             = useRef<MapplsWebViewHandle>(null);

  // ── Resolve locations (real or mock fallback) ─────────────
  const pLat = partnerLocation?.lat  ?? DEFAULT_PARTNER_LAT;
  const pLng = partnerLocation?.lng  ?? DEFAULT_PARTNER_LNG;
  const cLat = customerLocation?.lat ?? DEFAULT_CUSTOMER_LAT;
  const cLng = customerLocation?.lng ?? DEFAULT_CUSTOMER_LNG;

  // ── Map centre — midpoint between partner and customer ────
  const centerLat = (pLat + cLat) / 2;
  const centerLng = (pLng + cLng) / 2;

  // ── Markers ───────────────────────────────────────────────
  const markers: MapMarker[] = [
    {
      id:       "partner",
      lat:      pLat,
      lng:      pLng,
      title:    mode === "ride" ? "Your Driver" : "Delivery Partner",
      subtitle: `${partnerInitials} · ETA ~${etaMinutes} min`,
      icon:     "partner",
      isLive:   true,
      isOpen:   true,
    },
    {
      id:       "customer",
      lat:      cLat,
      lng:      cLng,
      title:    mode === "pickup" ? "Store" : "Your Location",
      icon:     "customer",
      isOpen:   true,
    },
  ];

  return (
    <View style={[styles.wrap, { borderColor: colors.border }]}>

      {/* ── Real Mappls map ── */}
      <MapplsWebView
        ref={mapRef}
        height={MAP_H}
        center={{ lat: centerLat, lng: centerLng }}
        zoom={14}
        markers={markers}
        routeLine={[{ lat: pLat, lng: pLng }, { lat: cLat, lng: cLng }]}
        isDark={isDark}
      />

      {/* ── ETA overlay ── */}
      <View style={[styles.etaBubble, { backgroundColor: cfg.color }]}>
        <Ionicons name={cfg.icon as any} size={13} color="#fff" />
        <Text style={[styles.etaText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
          ~{etaMinutes} min
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
