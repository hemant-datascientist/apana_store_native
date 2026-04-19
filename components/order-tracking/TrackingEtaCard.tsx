// ============================================================
// TRACKING ETA CARD — Apana Store
//
// Large ETA display at top of tracking screen.
// Shows minutes remaining, mode icon, order ID, and a
// pulsing status dot to signal live tracking is active.
// ============================================================

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { FulfillmentMode } from "../../data/cartData";
import { TRACKING_MODE_CONFIG } from "../../data/orderTrackingData";

interface TrackingEtaCardProps {
  mode:      FulfillmentMode;
  minutes:   number;
  label:     string;    // "Arriving in" | "Ready in" | "Driver in"
  orderId:   string;
  total:     number;
}

export default function TrackingEtaCard({ mode, minutes, label, orderId, total }: TrackingEtaCardProps) {
  const { colors } = useTheme();
  const cfg = TRACKING_MODE_CONFIG[mode];

  // Pulsing LIVE dot
  const liveOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(liveOpacity, { toValue: 0.2, duration: 600, useNativeDriver: true }),
        Animated.timing(liveOpacity, { toValue: 1,   duration: 600, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <View style={[styles.card, { backgroundColor: cfg.color, }]}>

      {/* LIVE badge */}
      <View style={styles.topRow}>
        <Animated.View style={[styles.liveDot, { opacity: liveOpacity }]} />
        <Text style={[styles.liveText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
          LIVE TRACKING
        </Text>

        {/* Mode badge */}
        <View style={[styles.modeBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
          <Ionicons name={cfg.icon as any} size={12} color="#fff" />
          <Text style={[styles.modeText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            {cfg.label}
          </Text>
        </View>
      </View>

      {/* Big ETA */}
      <View style={styles.etaRow}>
        <Text style={[styles.etaNum, { fontFamily: typography.fontFamily.bold, fontSize: 48 }]}>
          {minutes}
        </Text>
        <View style={styles.etaRight}>
          <Text style={[styles.etaUnit, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
            min
          </Text>
          <Text style={[styles.etaLabel, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {label}
          </Text>
        </View>
      </View>

      {/* Order ID + Amount */}
      <View style={[styles.metaRow, { borderTopColor: "rgba(255,255,255,0.2)" }]}>
        <Text style={[styles.metaText, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {orderId}
        </Text>
        <Text style={[styles.metaText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
          ₹{total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding:      20,
    gap:          12,
  },

  topRow: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            6,
  },
  liveDot: {
    width:        8,
    height:       8,
    borderRadius: 4,
    backgroundColor: "#4ADE80",
  },
  liveText:  { color: "rgba(255,255,255,0.85)", letterSpacing: 0.5 },
  modeBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
    marginLeft:        "auto",
  },
  modeText: { color: "#fff" },

  etaRow: {
    flexDirection: "row",
    alignItems:    "flex-end",
    gap:           6,
  },
  etaNum: {
    color:      "#fff",
    lineHeight: 52,
  },
  etaRight: { paddingBottom: 8, gap: 0 },
  etaUnit:  { color: "rgba(255,255,255,0.8)" },
  etaLabel: { color: "rgba(255,255,255,0.7)" },

  metaRow: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems:     "center",
    borderTopWidth: 1,
    paddingTop:     10,
  },
  metaText: { color: "rgba(255,255,255,0.75)" },
});
