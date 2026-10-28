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

import React, { useEffect, useRef } from "react";
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
  /** The shop's pin. A pickup customer walks here; the rider collects here. */
  shopLocation?:     { lat: number; lng: number; name?: string | null };
  /**
   * A REAL order: no demo coordinates anywhere. The rider marker drew at a
   * hardcoded Pune point when no fix had arrived, and the map centred halfway
   * between Pune and the customer — a Jalgaon customer saw neither.
   */
  live?:             boolean;
  /** Real order status, so the route goes rider→shop before pickup, rider→you after. */
  status?:           string | null;
}

export default function TrackingMapPlaceholder({
  mode, etaMinutes, partnerInitials, partnerColor,
  fix, partnerLocation, customerLocation, shopLocation, live = false, status,
}: TrackingMapProps) {
  const { colors, isDark } = useTheme();
  const cfg                = TRACKING_MODE_CONFIG[mode];
  const mapRef             = useRef<MapplsWebViewHandle>(null);

  // ── Smoothed live marker (§19.5) — falls back to static coords ──
  const marker = usePartnerMarker(fix ?? null);
  const isStale = marker?.mode === "stale";

  // Rider: a real smoothed fix, or (demo only) the sample start point. A real
  // order with no fix yet has NO rider marker — there is nobody to show.
  const rider = marker
    ? { lat: marker.lat, lng: marker.lng }
    : live ? null
    : { lat: partnerLocation?.lat ?? DEFAULT_PARTNER_LAT, lng: partnerLocation?.lng ?? DEFAULT_PARTNER_LNG };
  // No fallback for the drop: an address without a pin draws nothing.
  const drop = mode !== "pickup" && customerLocation ? customerLocation : null;
  const shop = shopLocation ?? null;

  // Where the map looks: the rider when moving, else the shop, else the drop.
  const focus = rider ?? shop ?? drop;

  const markers: MapMarker[] = [];
  if (shop) {
    markers.push({ id: "shop", lat: shop.lat, lng: shop.lng, title: shop.name || "Shop", icon: "store", isOpen: mode === "pickup" });
  }
  if (rider) {
    markers.push({
      id:       "partner",
      lat:      rider.lat,
      lng:      rider.lng,
      title:    mode === "ride" ? "Your Driver" : "Delivery Partner",
      subtitle: isStale ? `${partnerInitials} · last known position`
        : etaMinutes == null ? partnerInitials
        : `${partnerInitials} · ETA ~${etaMinutes} min`,
      icon:     "partner",
      isLive:   !isStale,
      isOpen:   true,
    });
  }
  if (drop) {
    markers.push({ id: "customer", lat: drop.lat, lng: drop.lng, title: "Your Location", icon: "customer", isOpen: !rider });
  }

  // Before pickup the rider is heading to the SHOP; after, to you.
  const leg = !rider ? null
    : status === "ready" && shop ? shop
    : drop;
  const routeLine = rider && leg ? [rider, { lat: leg.lat, lng: leg.lng }] : undefined;

  // The WebView applies `center` only on mount. Follow the real position as it
  // moves, and re-centre once data arrives after a cold mount.
  const focusKey = focus ? `${focus.lat.toFixed(4)},${focus.lng.toFixed(4)}` : "";
  useEffect(() => {
    if (focus) mapRef.current?.panTo(focus.lat, focus.lng);
  }, [focusKey]);
  useEffect(() => { mapRef.current?.setMarkers(markers); }, [JSON.stringify(markers)]);
  useEffect(() => { if (routeLine) mapRef.current?.drawRoute(routeLine); }, [JSON.stringify(routeLine ?? null)]);

  // What the bubble may honestly say. A pickup has no rider and no ETA.
  const bubble = mode === "pickup" ? null
    : !rider ? (live ? "No rider yet" : "Locating…")
    : isStale ? "Last known position"
    : etaMinutes == null ? "On the way" : `~${etaMinutes} min`;

  return (
    <View style={[styles.wrap, { borderColor: colors.border }]}>

      {/* ── Real Mappls map — mounted once something real can be shown ── */}
      {focus ? (
        <MapplsWebView
          ref={mapRef}
          height={MAP_H}
          center={{ lat: focus.lat, lng: focus.lng }}
          zoom={14}
          markers={markers}
          routeLine={routeLine}
          isDark={isDark}
        />
      ) : (
        <View style={{ height: MAP_H, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="map-outline" size={28} color={colors.subText} />
          <Text style={{ color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs, marginTop: 6 }}>
            Loading the map…
          </Text>
        </View>
      )}

      {/* ── ETA overlay ── */}
      {bubble && (
        <View style={[styles.etaBubble, { backgroundColor: isStale || !rider ? colors.subText : cfg.color }]}>
          <Ionicons name={isStale || !rider ? "navigate-outline" : (cfg.icon as keyof typeof Ionicons.glyphMap)} size={13} color="#fff" />
          <Text style={[styles.etaText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
            {bubble}
          </Text>
        </View>
      )}

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
