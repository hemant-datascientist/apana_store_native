// ============================================================
// COMING SOON CARD — Apana Store
//
// Teaser card for an upcoming store, product, or concept.
// Dashed border signals "not yet live". Shows launch date
// with a calendar icon and a "Notify Me" CTA.
// ============================================================

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { Launch } from "../../data/newLaunchersData";

const TYPE_ICON: Record<string, string> = {
  store:   "storefront-outline",
  product: "cube-outline",
  concept: "bulb-outline",
};

interface ComingSoonCardProps {
  launch: Launch;
}

export default function ComingSoonCard({ launch }: ComingSoonCardProps) {
  const { colors } = useTheme();
  const icon = TYPE_ICON[launch.type] ?? "star-outline";

  // ── Notify toggle (local mock state — wire to backend later) ─
  const [notified, setNotified] = useState(false);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: launch.color + "50" }]}>

      {/* Header row: type + badge + launch date */}
      <View style={styles.headerRow}>
        <View style={[styles.typeCircle, { backgroundColor: launch.color + "1A" }]}>
          <Ionicons name={icon as any} size={14} color={launch.color} />
        </View>

        {/* Coming Soon badge with dashed effect via border */}
        <View style={[styles.badge, { borderColor: launch.color }]}>
          <Text style={[styles.badgeText, { color: launch.color, fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
            {launch.badgeText}
          </Text>
        </View>

        {launch.isHot && (
          <Text style={[styles.hotText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
            🔥
          </Text>
        )}

        {/* Launch date chip */}
        <View style={[styles.dateChip, { backgroundColor: launch.color + "18" }]}>
          <Ionicons name="calendar-outline" size={12} color={launch.color} />
          <Text style={[styles.dateText, { color: launch.color, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            {launch.launchDate}
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

      {/* Highlights */}
      <View style={styles.highlights}>
        {launch.highlights.map((h, i) => (
          <View key={i} style={styles.highlightRow}>
            <Ionicons name="checkmark-outline" size={12} color={launch.color} />
            <Text style={[styles.highlightText, { color: colors.text, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
              {h}
            </Text>
          </View>
        ))}
      </View>

      {/* Notify Me CTA */}
      <TouchableOpacity
        style={[
          styles.notifyBtn,
          { backgroundColor: notified ? "#22C55E" : launch.color },
        ]}
        onPress={() => setNotified(n => !n)}
        activeOpacity={0.85}
      >
        <Ionicons
          name={notified ? "checkmark-circle-outline" : "notifications-outline"}
          size={15}
          color="#fff"
        />
        <Text style={[styles.notifyText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
          {notified ? "You'll be notified!" : "Notify Me at Launch"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth:  1.5,
    padding:      14,
    gap:          10,
    // dashed border is not natively supported; solid with lighter opacity achieves the teaser feel
  },

  headerRow: {
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
    borderWidth:       1,
  },
  badgeText: {},

  hotText: { color: "#EF4444" },

  dateChip: {
    marginLeft:        "auto",
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderRadius:      20,
  },
  dateText: {},

  title:    { lineHeight: 20 },
  subtitle: { lineHeight: 17 },

  highlights: { gap: 5 },
  highlightRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
  },
  highlightText: {},

  notifyBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               6,
    paddingVertical:   11,
    borderRadius:      12,
    marginTop:         2,
  },
  notifyText: { color: "#fff" },
});
