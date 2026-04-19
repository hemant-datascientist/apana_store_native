// ============================================================
// TRACKING MAP PLACEHOLDER — Apana Store
//
// Visual stand-in for the Mappls live tracking map.
// Shows a mocked route arc with animated partner dot.
// Replace this entire component with MapplsMapView when the
// SDK is integrated — the interface (partnerLocation, customerLocation)
// stays the same.
//
// TODO: Integrate Mappls React Native SDK
//   import MapplsMapView from "@mappls/react-native-mappls";
//   Feed real-time lat/lng from WebSocket: WS /ws/tracking/:orderId
// ============================================================

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { FulfillmentMode } from "../../data/cartData";
import { TRACKING_MODE_CONFIG } from "../../data/orderTrackingData";

const SW = Dimensions.get("window").width;

interface TrackingMapProps {
  mode:            FulfillmentMode;
  etaMinutes:      number;
  partnerInitials: string;
  partnerColor:    string;
}

export default function TrackingMapPlaceholder({
  mode, etaMinutes, partnerInitials, partnerColor,
}: TrackingMapProps) {
  const { colors, isDark } = useTheme();
  const cfg = TRACKING_MODE_CONFIG[mode];

  // Animate partner dot along a fake route
  const dotX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotX, { toValue: 1,   duration: 3000, useNativeDriver: true }),
        Animated.timing(dotX, { toValue: 0.6, duration: 1500, useNativeDriver: true }),
        Animated.timing(dotX, { toValue: 1,   duration: 2500, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  // Map the animated value to a horizontal translation
  const translateX = dotX.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, SW * 0.38],
  });

  return (
    <View style={[styles.mapWrap, { backgroundColor: isDark ? "#0A1628" : "#E8F4FD", borderColor: colors.border }]}>

      {/* Top-left: map label */}
      <View style={[styles.mapLabel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="map-outline" size={12} color={colors.primary} />
        <Text style={[styles.mapLabelText, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
          Mappls Live Map
        </Text>
      </View>

      {/* Mock road / route background */}
      <View style={styles.routeContainer}>
        {/* Road surface */}
        <View style={[styles.road, { backgroundColor: isDark ? "#1E3A5F" : "#CBD5E1" }]} />
        {/* Dashed centre line */}
        <View style={styles.dashRow}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={[styles.dash, { backgroundColor: isDark ? "#3B82F6" : "#94A3B8" }]} />
          ))}
        </View>

        {/* Animated partner dot */}
        <Animated.View style={[styles.partnerDot, { backgroundColor: partnerColor, transform: [{ translateX }] }]}>
          <Text style={[styles.partnerInitials, { fontFamily: typography.fontFamily.bold, fontSize: 9 }]}>
            {partnerInitials}
          </Text>
        </Animated.View>

        {/* Customer pin (destination) */}
        <View style={[styles.destinationPin, { backgroundColor: colors.primary }]}>
          <Ionicons name="home" size={11} color="#fff" />
        </View>
      </View>

      {/* ETA overlay */}
      <View style={[styles.etaBubble, { backgroundColor: cfg.color, }]}>
        <Ionicons name={cfg.icon as any} size={13} color="#fff" />
        <Text style={[styles.etaText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
          ~{etaMinutes} min
        </Text>
      </View>

      {/* Bottom: Mappls attribution */}
      <View style={[styles.attribution, { backgroundColor: colors.card + "CC" }]}>
        <Text style={[styles.attributionText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 9 }]}>
          Live map powered by Mappls (MapMyIndia)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrap: {
    height:       200,
    borderRadius: 16,
    borderWidth:  1,
    overflow:     "hidden",
    position:     "relative",
  },

  mapLabel: {
    position:          "absolute",
    top:               10,
    left:              10,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    paddingHorizontal: 9,
    paddingVertical:   4,
    borderRadius:      8,
    borderWidth:       1,
    zIndex:            10,
  },
  mapLabelText: {},

  // Fake road
  routeContainer: {
    position:       "absolute",
    top:            "38%",
    left:           "8%",
    right:          "8%",
    alignItems:     "flex-start",
    justifyContent: "center",
  },
  road: {
    height:       26,
    borderRadius: 13,
    width:        "100%",
  },
  dashRow: {
    position:       "absolute",
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-evenly",
    width:          "100%",
    gap:            4,
  },
  dash: {
    width:        16,
    height:       2,
    borderRadius: 1,
    opacity:      0.5,
  },

  partnerDot: {
    position:       "absolute",
    top:            3,
    left:           6,
    width:          20,
    height:         20,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
    elevation:      4,
  },
  partnerInitials: { color: "#fff" },

  destinationPin: {
    position:       "absolute",
    top:            3,
    right:          6,
    width:          20,
    height:         20,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },

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
  },
  etaText: { color: "#fff" },

  attribution: {
    position:        "absolute",
    bottom:          0,
    left:            0,
    right:           0,
    paddingVertical: 4,
    alignItems:      "center",
  },
  attributionText: {},
});
