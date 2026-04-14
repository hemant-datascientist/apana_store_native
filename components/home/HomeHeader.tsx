// ============================================================
// HOME HEADER — Apana Store
//
// Top bar of the home screen hero section:
//   Left:  home icon + "Area, State – Pincode" + chevron ▾
//   Right: green pulse dot + "Stores Live – N"
//
// Tapping the location row opens the area-change sheet.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../theme/typography";
import { UserLocation } from "../../data/homeData";

interface HomeHeaderProps {
  location:       UserLocation;
  storesLive:     number;
  onLocationPress: () => void;
}

export default function HomeHeader({ location, storesLive, onLocationPress }: HomeHeaderProps) {
  return (
    <View style={styles.row}>

      {/* ── Location selector ── */}
      <TouchableOpacity style={styles.locationBtn} onPress={onLocationPress} activeOpacity={0.75}>
        <Ionicons name="home-outline" size={16} color="#fff" />
        <Text
          style={[styles.locationText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}
          numberOfLines={1}
        >
          {location.area},{location.state} – {location.pincode}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#fff" />
      </TouchableOpacity>

      {/* ── Stores Live badge ── */}
      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={[styles.liveText, { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
          Stores Live – {storesLive.toLocaleString("en-IN")}
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical:    10,
  },

  locationBtn: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
    flex:          1,
    marginRight:   12,
  },
  locationText: {
    color:      "#fff",
    flex:       1,
    flexShrink: 1,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
  },
  liveDot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: "#22C55E",
  },
  liveText: {
    color: "#fff",
  },
});
