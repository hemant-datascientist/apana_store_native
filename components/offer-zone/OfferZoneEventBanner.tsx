// ============================================================
// OFFER ZONE EVENT BANNER — Apana Store
//
// Horizontal scroll of full-width event cards.
// Each card: colored background, tag pill, title, subtitle,
// store count, deal count, and date range.
// ============================================================

import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../theme/typography";
import { OfferEvent } from "../../data/offerZoneData";

interface OfferZoneEventBannerProps {
  events: OfferEvent[];
}

export default function OfferZoneEventBanner({ events }: OfferZoneEventBannerProps) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.sectionLabel, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
        🔥 Active Events
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {events.map(ev => (
          <TouchableOpacity
            key={ev.id}
            style={[styles.card, { backgroundColor: ev.color }]}
            activeOpacity={0.88}
          >
            {/* Tag pill */}
            <View style={styles.tagPill}>
              <Text style={[styles.tagText, { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
                {ev.tag}
              </Text>
            </View>

            {/* Title + subtitle */}
            <Text style={[styles.title, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
              {ev.title}
            </Text>
            <Text style={[styles.subtitle, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {ev.subtitle}
            </Text>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Ionicons name="storefront-outline" size={12} color="rgba(255,255,255,0.85)" />
                <Text style={[styles.statText, { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
                  {ev.storeCount} stores
                </Text>
              </View>
              <View style={styles.dot} />
              <View style={styles.stat}>
                <Ionicons name="pricetag-outline" size={12} color="rgba(255,255,255,0.85)" />
                <Text style={[styles.statText, { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
                  {ev.dealCount} deals
                </Text>
              </View>
            </View>

            {/* Date */}
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.7)" />
              <Text style={[styles.dateText, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                {ev.startDate} → {ev.endDate}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:         { gap: 10 },
  sectionLabel: { color: "#fff", paddingHorizontal: 16 },

  scroll: {
    paddingHorizontal: 16,
    gap:               12,
  },

  card: {
    width:         280,
    borderRadius:  18,
    padding:       16,
    gap:           8,
  },

  tagPill: {
    alignSelf:         "flex-start",
    backgroundColor:   "rgba(255,255,255,0.22)",
    paddingHorizontal: 10,
    paddingVertical:   3,
    borderRadius:      20,
  },
  tagText:  { color: "#fff" },
  title:    { color: "#fff" },
  subtitle: { color: "rgba(255,255,255,0.8)", lineHeight: 18 },

  statsRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
    marginTop:     4,
  },
  stat: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           4,
  },
  statText: { color: "rgba(255,255,255,0.85)" },
  dot: {
    width:        3,
    height:       3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.5)",
  },

  dateRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           5,
    marginTop:     2,
  },
  dateText: { color: "rgba(255,255,255,0.7)" },
});
