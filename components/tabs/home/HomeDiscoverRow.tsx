// ============================================================
// HOME DISCOVER ROW — Apana Store
//
// Three quick-access discovery tiles on the home screen:
//   Offer Zone     — active deals & seller events
//   Brands         — shop by brand name
//   New Launchers  — what's new in the city
//
// Each tile: colored icon circle, label, short description,
// and a small arrow indicator.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

const TILES = [
  {
    label:       "Offer Zone",
    description: "Deals & events",
    icon:        "pricetag-outline",
    color:       "#F97316",
    route:       "/offer-zone",
  },
  {
    label:       "Brands",
    description: "Shop by brand",
    icon:        "ribbon-outline",
    color:       "#0F4C81",
    route:       "/brands",
  },
  {
    label:       "New Launches",
    description: "Fresh in city",
    icon:        "rocket-outline",
    color:       "#7C3AED",
    route:       "/new-launchers",
  },
] as const;

export default function HomeDiscoverRow() {
  const router    = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.heading, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
        Discover
      </Text>

      <View style={styles.row}>
        {TILES.map(tile => (
          <TouchableOpacity
            key={tile.route}
            style={[styles.tile, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push(tile.route)}
            activeOpacity={0.82}
          >
            {/* Icon circle */}
            <View style={[styles.iconCircle, { backgroundColor: tile.color + "18" }]}>
              <Ionicons name={tile.icon as any} size={20} color={tile.color} />
            </View>

            <View style={styles.textBlock}>
              <Text style={[styles.tileLabel, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
                {tile.label}
              </Text>
              <Text style={[styles.tileDesc, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                {tile.description}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={14} color={colors.subText} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    gap:               10,
  },
  heading: {},

  row: { gap: 8 },

  tile: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    borderRadius:      14,
    borderWidth:       1,
    paddingHorizontal: 14,
    paddingVertical:   12,
  },

  iconCircle: {
    width:          40,
    height:         40,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },

  textBlock: { flex: 1 },
  tileLabel: {},
  tileDesc:  { marginTop: 1 },
});
