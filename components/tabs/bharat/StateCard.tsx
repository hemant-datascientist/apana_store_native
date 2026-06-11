// ============================================================
// STATE CARD — Apana Store (Bharat Screen)
//
// Horizontal-scroll card per state:
//   • Rounded square with tinted bg
//   • State silhouette via SvgXml (perfectly centered)
//   • State name below (2 lines max)
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { typography } from "../../../theme/typography";
import useTheme from "../../../theme/useTheme";
import StateSvg from "./StateSvg";
import { StateInfo } from "../../../data/bharatData";
import { formatCount } from "../../../utils/formatUtils";

interface StateCardProps {
  state:    StateInfo;
  primary:  string;
  // Live count override: undefined = mock mode (bundled state.storesLive),
  // null = live mode still loading ("…" + grey dot), number = real count
  // (green dot when > 0, red when 0). §19.8 — never claims unknowns.
  liveCount?: number | null;
  onPress?: (state: StateInfo) => void;
}

const BOX_SIZE = 76;   // outer rounded square
const SVG_SIZE = 56;   // SVG render size inside the box

const DOT_LIVE    = "#22C55E";
const DOT_NONE    = "#EF4444";
const DOT_LOADING = "#9CA3AF";

export default function StateCard({ state, primary, liveCount, onPress }: StateCardProps) {
  const { colors } = useTheme();
  const bgTint     = primary + "12";   // ~7% opacity
  const borderTint = primary + "28";

  const shown    = liveCount === undefined ? state.storesLive : liveCount;
  const dotColor = shown == null ? DOT_LOADING : shown > 0 ? DOT_LIVE : DOT_NONE;

  return (
    <TouchableOpacity style={styles.wrap} onPress={() => onPress?.(state)} activeOpacity={0.72}>

      {/* Silhouette box */}
      <View style={[styles.box, { backgroundColor: bgTint, borderColor: borderTint }]}>
        <StateSvg
          stateKey={state.key}
          size={SVG_SIZE}
          fillColor={primary}
        />
      </View>

      {/* State name */}
      <Text
        style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.bold }]}
        numberOfLines={1}
      >
        {state.name}
      </Text>

      {/* Stores Live Count */}
      <View style={styles.liveRow}>
        <View style={[styles.liveDot, { backgroundColor: dotColor }]} />
        <Text style={[styles.liveCount, { color: colors.primary, fontFamily: typography.fontFamily.semiBold }]}>
          {shown == null ? "…" : formatCount(shown)} Live
        </Text>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width:       BOX_SIZE + 10,
    alignItems:  "center",
    marginRight: 10,
  },

  box: {
    width:          BOX_SIZE,
    height:         BOX_SIZE,
    borderRadius:   14,
    borderWidth:    1,
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   6,
    overflow:       "hidden",
  },

  name: {
    fontSize:   9.5,
    textAlign:  "center",
    lineHeight: 13,
    marginBottom: 2,
  },
  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  liveCount: {
    fontSize: 8.5,
  },
});
