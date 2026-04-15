// ============================================================
// B2C STORE CARD — Apana Store (Home, Stores B2C tab)
//
// Taller card for direct-to-consumer manufacturer listings:
//   Left  — brand logo square (initials + color)
//   Right — name + LIVE badge | rating · reviews · distance |
//            Website tag + category tags |
//            description paragraph |
//            Direction + View Items buttons
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../theme/typography";
import useTheme from "../../../theme/useTheme";
import { B2CStore } from "../../../data/b2cStoresData";

interface B2CStoreCardProps {
  store:       B2CStore;
  onDirection: (store: B2CStore) => void;
  onViewItems: (store: B2CStore) => void;
  onWebsite:   (store: B2CStore) => void;
}

export default function B2CStoreCard({ store, onDirection, onViewItems, onWebsite }: B2CStoreCardProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* LIVE badge — top right */}
      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={[styles.liveText, { fontFamily: typography.fontFamily.bold, fontSize: 9 }]}>
          LIVE
        </Text>
      </View>

      <View style={styles.row}>

        {/* ── Brand logo ── */}
        <View style={[styles.logo, { backgroundColor: store.logoColor }]}>
          <Text style={[styles.logoText, { color: store.logoTextColor, fontFamily: typography.fontFamily.bold, fontSize: store.logoText.length > 2 ? 11 : 15 }]}>
            {store.logoText}
          </Text>
        </View>

        {/* ── Right content ── */}
        <View style={styles.info}>

          {/* Name */}
          <Text
            style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}
            numberOfLines={1}
          >
            {store.name}
          </Text>

          {/* Rating · Reviews · Distance */}
          <View style={styles.metaRow}>
            <Ionicons name="star" size={11} color="#F59E0B" />
            <Text style={[styles.metaBold, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
              {store.rating}
            </Text>
            <Text style={[styles.metaDim, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {store.reviews.toLocaleString("en-IN")} reviews
            </Text>
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <Ionicons name="location-outline" size={11} color={colors.subText} />
            <Text style={[styles.metaDim, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {store.distanceKm} km
            </Text>
          </View>

          {/* Tags row: Website + category tags */}
          <View style={styles.tags}>
            {store.website && (
              <TouchableOpacity
                style={[styles.websiteTag, { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }]}
                onPress={() => onWebsite(store)}
                activeOpacity={0.75}
              >
                <Ionicons name="globe-outline" size={10} color="#1D4ED8" />
                <Text style={[styles.websiteText, { fontFamily: typography.fontFamily.semiBold, fontSize: 9.5 }]}>
                  Website
                </Text>
              </TouchableOpacity>
            )}
            {store.tags.map((tag, i) => (
              <View key={i} style={[styles.tag, { backgroundColor: i === 0 ? store.categoryBg : colors.background, borderColor: i === 0 ? store.categoryColor + "40" : colors.border }]}>
                <Text style={[styles.tagText, { color: i === 0 ? store.categoryColor : colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: 9.5 }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <TouchableOpacity onPress={() => setExpanded(e => !e)} activeOpacity={0.85}>
            <Text
              style={[styles.description, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}
              numberOfLines={expanded ? undefined : 2}
            >
              {store.description}
            </Text>
            <Text style={[styles.readMore, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: 9.5 }]}>
              {expanded ? "Show less" : "Read more"}
            </Text>
          </TouchableOpacity>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnOutline, { borderColor: colors.primary }]}
              onPress={() => onDirection(store)}
              activeOpacity={0.75}
            >
              <Ionicons name="navigate-outline" size={13} color={colors.primary} />
              <Text style={[styles.btnText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                Direction
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnFill, { backgroundColor: colors.primary }]}
              onPress={() => onViewItems(store)}
              activeOpacity={0.75}
            >
              <Ionicons name="grid-outline" size={13} color="#fff" />
              <Text style={[styles.btnText, { color: "#fff", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                View Items
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom:      12,
    borderRadius:      14,
    borderWidth:        1,
    overflow:          "hidden",
    position:          "relative",
  },

  // LIVE
  liveBadge: {
    position:          "absolute",
    top:                10,
    right:              10,
    flexDirection:     "row",
    alignItems:        "center",
    gap:                4,
    backgroundColor:   "#DCFCE7",
    paddingHorizontal: 7,
    paddingVertical:   3,
    borderRadius:      20,
    zIndex:             1,
  },
  liveDot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: "#16A34A",
  },
  liveText: { color: "#15803D" },

  // Layout
  row: {
    flexDirection: "row",
    padding:       12,
    gap:           12,
  },

  // Brand logo
  logo: {
    width:          72,
    height:         72,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  logoText: {},

  // Info
  info: { flex: 1, gap: 6 },

  name: { paddingRight: 44 },   // clear LIVE badge

  // Meta
  metaRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:            4,
    flexWrap:      "wrap",
  },
  metaBold: {},
  metaDim:  {},
  dot: {
    width:        3,
    height:       3,
    borderRadius: 2,
    marginHorizontal: 2,
  },

  // Tags
  tags: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:            5,
  },
  websiteTag: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:                3,
    paddingHorizontal: 7,
    paddingVertical:   3,
    borderRadius:      20,
    borderWidth:        1,
  },
  websiteText: { color: "#1D4ED8" },
  tag: {
    paddingHorizontal: 7,
    paddingVertical:   3,
    borderRadius:      20,
    borderWidth:        1,
  },
  tagText: {},

  // Description
  description: { lineHeight: 16 },
  readMore:    { marginTop: 2 },

  // Buttons
  actions: {
    flexDirection: "row",
    gap:            8,
    marginTop:      2,
  },
  btn: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:                4,
    paddingHorizontal: 12,
    paddingVertical:    7,
    borderRadius:      20,
  },
  btnOutline: { borderWidth: 1 },
  btnFill:    {},
  btnText:    {},
});
