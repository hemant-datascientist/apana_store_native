// ============================================================
// HOME HEADER — Apana Store
//
// Top bar of the home screen hero section:
//   Left:  home icon + "Area, State – Pincode" + chevron ▾
//   Right: status dot + "Stores Live – N"
//          green = stores live · red = none live · grey = still loading
//
// storesLive: null while the live count loads — shows "…" and a grey
// dot rather than claiming 0 (§19.8 no phantom data).
// Tapping the location row opens the area-change sheet.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../theme/typography";
import { UserLocation } from "../../../data/homeData";
import { formatCount } from "../../../utils/formatUtils";

const DOT_LIVE    = "#22C55E";
const DOT_NONE    = "#EF4444";
const DOT_LOADING = "#9CA3AF";

interface HomeHeaderProps {
  location:        UserLocation;
  storesLive:      number | null;
  onLocationPress: () => void;
  onStoreLivePress?: () => void;
}

export default function HomeHeader({ location, storesLive, onLocationPress, onStoreLivePress }: HomeHeaderProps) {
  const dotColor =
    storesLive == null ? DOT_LOADING : storesLive > 0 ? DOT_LIVE : DOT_NONE;

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

      {/* ── Stores Live badge (tappable → Store Live screen) ── */}
      <TouchableOpacity style={styles.liveBadge} onPress={onStoreLivePress} activeOpacity={0.75}>
        <View style={[styles.liveDot, { backgroundColor: dotColor }]} />
        <Text style={[styles.liveText, { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
          Stores Live – {storesLive == null ? "…" : formatCount(storesLive)}
        </Text>
      </TouchableOpacity>

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
    width:        8,
    height:       8,
    borderRadius: 4,
  },
  liveText: {
    color: "#fff",
  },
});
