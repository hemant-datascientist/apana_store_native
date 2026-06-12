// ============================================================
// RIDERS MAP — Apana Store (Auto Riders)
//
// Top-of-screen live map: customer dot + rider markers, coloured by
// vehicle class (Bike blue · Auto amber · Cab purple). Renders via the
// shared MapplsWebView (Mappls JS SDK — never Google/Mapbox).
// Markers auto-sync when the rider set or class filter changes.
// ============================================================

import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapplsWebView, { MapMarker } from "../map/MapplsWebView";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { NearbyRider, VEHICLE_CLASSES, VEHICLE_INFO } from "../../data/ridersData";
import { formatDistance } from "../../lib/rideLogic";

const MAP_HEIGHT = 260;

interface RidersMapProps {
  riders:   NearbyRider[];
  userLat:  number;
  userLng:  number;
  onRiderPress?: (riderId: string) => void;
}

export default function RidersMap({ riders, userLat, userLng, onRiderPress }: RidersMapProps) {
  const { colors, isDark } = useTheme();

  const markers = useMemo<MapMarker[]>(
    () =>
      riders.map((r) => ({
        id: r.id,
        lat: r.lat,
        lng: r.lng,
        title: r.name,
        subtitle: `${VEHICLE_INFO[r.vehicleClass].label} · ${formatDistance(r.distanceM)}`,
        color: VEHICLE_INFO[r.vehicleClass].color,
        icon: "partner" as const,
      })),
    [riders],
  );

  return (
    <View>
      <MapplsWebView
        markers={markers}
        center={{ lat: userLat, lng: userLng }}
        zoom={14}
        height={MAP_HEIGHT}
        showUserDot
        userLocation={{ lat: userLat, lng: userLng }}
        onMarkerPress={(id) => onRiderPress?.(id)}
        isDark={isDark}
      />

      {/* Class legend over the map bottom edge */}
      <View style={[styles.legend, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {VEHICLE_CLASSES.map((cls) => (
          <View key={cls} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: VEHICLE_INFO[cls].color }]} />
            <Text style={[styles.legendText, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
              {VEHICLE_INFO[cls].label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    position:        "absolute",
    bottom:          10,
    alignSelf:       "center",
    flexDirection:   "row",
    gap:             14,
    paddingHorizontal: 14,
    paddingVertical:   6,
    borderRadius:     18,
    borderWidth:      1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           5,
  },
  legendDot: {
    width:        8,
    height:       8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: typography.size.ss,
  },
});
