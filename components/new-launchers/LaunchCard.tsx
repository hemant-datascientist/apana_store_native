// ============================================================
// LAUNCH CARD — Apana Store
//
// Card for a live launch (store, product, or concept).
// Left colored accent border matches the launch/brand color.
// Shows: type icon, badge, "HOT" flag, title, subtitle,
//        highlight bullets, category chip, launched-ago text.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { Launch } from "../../data/newLaunchersData";

// ── Map launch type → Ionicons glyph ─────────────────────
const TYPE_ICON: Record<string, string> = {
  store:   "storefront-outline",
  product: "cube-outline",
  concept: "bulb-outline",
};

interface LaunchCardProps {
  launch: Launch;
}

export default function LaunchCard({ launch }: LaunchCardProps) {
  const { colors } = useTheme();
  const icon = TYPE_ICON[launch.type] ?? "star-outline";

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.85}
    >
      {/* Left colored accent stripe */}
      <View style={[styles.accent, { backgroundColor: launch.color }]} />

      <View style={styles.body}>
        {/* Top: type icon + badge + HOT */}
        <View style={styles.topRow}>
          <View style={[styles.typeCircle, { backgroundColor: launch.color + "1A" }]}>
            <Ionicons name={icon as any} size={14} color={launch.color} />
          </View>

          <View style={[styles.badge, { backgroundColor: launch.color }]}>
            <Text style={[styles.badgeText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
              {launch.badgeText}
            </Text>
          </View>

          {launch.isHot && (
            <View style={styles.hotBadge}>
              <Text style={[styles.hotText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
                🔥
              </Text>
            </View>
          )}

          {/* Launched ago — pushed to right */}
          <View style={styles.agoChip}>
            <Ionicons name="time-outline" size={11} color={colors.subText} />
            <Text style={[styles.agoText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
              {launch.launchedAgo}
            </Text>
          </View>
        </View>

        {/* Title + subtitle */}
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          {launch.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]} numberOfLines={2}>
          {launch.subtitle}
        </Text>

        {/* Highlight bullets */}
        <View style={styles.highlights}>
          {launch.highlights.map((h, i) => (
            <View key={i} style={styles.highlightRow}>
              <View style={[styles.dot, { backgroundColor: launch.color }]} />
              <Text style={[styles.highlightText, { color: colors.text, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
                {h}
              </Text>
            </View>
          ))}
        </View>

        {/* Category chip */}
        <View style={[styles.categoryChip, { backgroundColor: launch.color + "18" }]}>
          <Text style={[styles.categoryText, { color: launch.color, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
            {launch.category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius:  16,
    borderWidth:   1,
    overflow:      "hidden",
  },

  accent: { width: 5 },

  body: {
    flex:    1,
    padding: 14,
    gap:     8,
  },

  topRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
  },
  typeCircle: {
    width:          28,
    height:         28,
    borderRadius:   8,
    alignItems:     "center",
    justifyContent: "center",
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
  },
  badgeText: { color: "#fff" },

  hotBadge: {},
  hotText:  {},

  agoChip: {
    marginLeft:    "auto",
    flexDirection: "row",
    alignItems:    "center",
    gap:           3,
  },
  agoText: {},

  title:    { lineHeight: 20 },
  subtitle: { lineHeight: 17 },

  highlights: { gap: 5 },
  highlightRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           7,
  },
  dot: {
    width:        6,
    height:       6,
    borderRadius: 3,
  },
  highlightText: {},

  categoryChip: {
    alignSelf:         "flex-start",
    paddingHorizontal: 10,
    paddingVertical:   3,
    borderRadius:      20,
  },
  categoryText: {},
});
