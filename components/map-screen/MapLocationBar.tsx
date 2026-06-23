// ============================================================
// MAP LOCATION BAR — Apana Store (Map View)
//
// 🏠 City, State – PIN ▼   ·   🟢 Stores Live – N
// Tapping the location opens the address book; the live count mirrors the
// home header badge (null → "…", grey, never a fake number per §19.8).
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../theme/typography";

interface MapLocationBarProps {
  label:      string;            // "Pune, Maharashtra – 411001"
  storesLive: number | null;     // null while loading
  onPressLocation: () => void;
}

export default function MapLocationBar({ label, storesLive, onPressLocation }: MapLocationBarProps) {
  const live    = storesLive != null && storesLive > 0;
  const liveText = storesLive == null ? "Stores Live – …" : `Stores Live – ${storesLive.toLocaleString("en-IN")}`;
  const dotColor = storesLive == null ? "rgba(255,255,255,0.4)" : live ? "#22C55E" : "#F87171";

  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.loc} onPress={onPressLocation} activeOpacity={0.8}>
        <Ionicons name="home" size={14} color="#fff" />
        <Text numberOfLines={1} style={[styles.locText, { fontFamily: typography.fontFamily.semiBold }]}>{label}</Text>
        <Ionicons name="chevron-down" size={14} color="#fff" />
      </TouchableOpacity>

      <View style={styles.live}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
        <Text style={[styles.liveText, { fontFamily: typography.fontFamily.semiBold }]}>{liveText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 8, gap: 10 },
  loc: { flexDirection: "row", alignItems: "center", gap: 5, flexShrink: 1 },
  locText: { color: "#fff", fontSize: typography.size.sm, flexShrink: 1 },
  live: { flexDirection: "row", alignItems: "center", gap: 5, flexShrink: 0 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  liveText: { color: "#86EFAC", fontSize: typography.size.xs },
});
