// ============================================================
// INDIA MAP SVG — Apana Store (Bharat Screen hero)
//
// Renders a full composite India map by drawing all 36 state
// paths in ONE <Svg>. Every path in stateSvgData.ts shares
// the same geographic coordinate space (0 0 612 696), so they
// tessellate naturally — no per-state transforms required.
//
// States are coloured by region using REGION_GROUPS.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, G } from "react-native-svg";
import { typography } from "../../../theme/typography";
import { STATE_SVG_DATA } from "../../data/stateSvgData";
import { REGION_GROUPS } from "../../data/bharatData";

// ── Coordinate space of the full India SVG composite ─────────
const INDIA_W = 612;
const INDIA_H = 696;

// ── Region fill colours ───────────────────────────────────────
const REGION_COLORS: Record<string, string> = {
  north:     "#60A5FA",   // blue-400
  central:   "#FBBF24",   // amber-400
  west:      "#34D399",   // emerald-400
  east:      "#A78BFA",   // violet-400
  northeast: "#F472B6",   // pink-400
  south:     "#F87171",   // red-400
  uts:       "#94A3B8",   // slate-400
};
const FALLBACK_COLOR = "#94A3B8";

// ── Build stateKey → regionKey at module level (one-time) ─────
const STATE_REGION: Record<string, string> = {};
for (const group of REGION_GROUPS) {
  for (const state of group.states) {
    STATE_REGION[state.key] = group.key;
  }
}

// ── Legend items ──────────────────────────────────────────────
const LEGEND = [
  { key: "north",     label: "North"     },
  { key: "east",      label: "East"      },
  { key: "south",     label: "South"     },
  { key: "west",      label: "West"      },
  { key: "northeast", label: "Northeast" },
  { key: "central",   label: "Central"   },
  { key: "uts",       label: "UTs"       },
];

interface IndiaMapSvgProps {
  /** Rendered width of the map (height is auto-proportioned). */
  mapWidth?: number;
}

export default function IndiaMapSvg({ mapWidth = 240 }: IndiaMapSvgProps) {
  const mapHeight = Math.round(mapWidth * (INDIA_H / INDIA_W));

  return (
    <View style={styles.root}>

      {/* ── Map ── */}
      <View style={[styles.mapWrap, { width: mapWidth, height: mapHeight }]}>
        <Svg
          width={mapWidth}
          height={mapHeight}
          viewBox={`0 0 ${INDIA_W} ${INDIA_H}`}
        >
          <G>
            {Object.entries(STATE_SVG_DATA).map(([key, entry]) => {
              const regionKey = STATE_REGION[key];
              const fill      = regionKey ? (REGION_COLORS[regionKey] ?? FALLBACK_COLOR) : FALLBACK_COLOR;
              return (
                <Path
                  key={key}
                  d={entry.path}
                  fill={fill}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                />
              );
            })}
          </G>
        </Svg>
      </View>

      {/* ── Region legend ── */}
      <View style={styles.legend}>
        {LEGEND.map(item => (
          <View key={item.key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: REGION_COLORS[item.key] }]} />
            <Text style={[styles.legendLabel, { fontFamily: typography.fontFamily.regular, fontSize: 9 }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    gap:         12,
  },

  mapWrap: {
    // drop shadow on Android / elevation
    elevation:       4,
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.20,
    shadowRadius:    6,
  },

  // Legend
  legend: {
    flexDirection:  "row",
    flexWrap:       "wrap",
    justifyContent: "center",
    gap:             8,
    rowGap:          4,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems:    "center",
    gap:            4,
  },
  legendDot: {
    width:        8,
    height:       8,
    borderRadius: 4,
  },
  legendLabel: {
    color: "rgba(255,255,255,0.70)",
  },
});
