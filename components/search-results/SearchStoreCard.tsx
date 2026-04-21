// ============================================================
// SEARCH STORE CARD — Apana Store
//
// Full-width store card shown in the Stores tab of search results.
// Layout (horizontal):
//   Left  — store icon placeholder (square)
//   Right — name + LIVE/Closed badge | ⭐ rating · reviews · km
//            category tags row | Direction + View Items buttons
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { SearchStoreResult } from "../../data/searchResultsData";

interface SearchStoreCardProps {
  store:       SearchStoreResult;
  onPress:     () => void;
  onDirection: () => void;
}

export default function SearchStoreCard({ store, onPress, onDirection }: SearchStoreCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* LIVE/Closed badge — absolute top-right */}
      <View style={[
        styles.statusBadge,
        { backgroundColor: store.isOpen ? (store.isLive ? "#DCFCE7" : "#DBEAFE") : "#FEE2E2" },
      ]}>
        {store.isLive && <View style={styles.liveDot} />}
        <Text style={[
          styles.statusText,
          {
            color: store.isOpen ? (store.isLive ? "#15803D" : "#1D4ED8") : "#DC2626",
            fontFamily: typography.fontFamily.bold,
            fontSize: 9,
          },
        ]}>
          {store.isLive ? "LIVE" : store.isOpen ? "OPEN" : "CLOSED"}
        </Text>
      </View>

      <View style={styles.row}>

        {/* ── Icon placeholder ── */}
        <View style={[styles.thumb, { backgroundColor: store.iconBg }]}>
          <Ionicons name={store.icon as any} size={32} color={store.accentColor} />
        </View>

        {/* ── Right info ── */}
        <View style={styles.info}>

          {/* Store name */}
          <Text
            numberOfLines={1}
            style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}
          >
            {store.name}
          </Text>

          {/* Category pill */}
          <View style={[styles.catPill, { backgroundColor: store.iconBg }]}>
            <Text style={[styles.catText, { color: store.accentColor, fontFamily: typography.fontFamily.semiBold, fontSize: 9.5 }]}>
              {store.category}
            </Text>
          </View>

          {/* Rating · reviews · distance */}
          <View style={styles.metaRow}>
            <Ionicons name="star" size={11} color="#F59E0B" />
            <Text style={[styles.rating, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
              {store.rating}
            </Text>
            <Text style={[styles.dim, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              ({store.reviewCount.toLocaleString("en-IN")})
            </Text>
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <Ionicons name="location-outline" size={11} color={colors.subText} />
            <Text style={[styles.dim, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {store.distanceKm} km
            </Text>
          </View>

          {/* Category tags */}
          <View style={styles.tags}>
            {store.tags.slice(0, 3).map((tag, i) => (
              <View key={i} style={[styles.tag, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.tagText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 9.5 }]}>
                  {tag}
                </Text>
              </View>
            ))}
            {store.tags.length > 3 && (
              <Text style={[styles.moreTags, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 9.5 }]}>
                +{store.tags.length - 3}
              </Text>
            )}
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnOutline, { borderColor: colors.primary }]}
              onPress={e => { e.stopPropagation?.(); onDirection(); }}
              activeOpacity={0.75}
            >
              <Ionicons name="navigate-outline" size={13} color={colors.primary} />
              <Text style={[styles.btnText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                Direction
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnFill, { backgroundColor: colors.primary }]}
              onPress={onPress}
              activeOpacity={0.75}
            >
              <Ionicons name="storefront-outline" size={13} color="#fff" />
              <Text style={[styles.btnText, { color: "#fff", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                View Store
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom:     12,
    borderRadius:     16,
    borderWidth:      1,
    overflow:         "hidden",
    position:         "relative",
  },

  // Status badge
  statusBadge: {
    position:          "absolute",
    top:               10,
    right:             10,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
    zIndex:            1,
  },
  liveDot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: "#16A34A",
  },
  statusText: {},

  // Layout
  row: {
    flexDirection: "row",
    padding:       12,
    gap:           12,
  },

  // Thumbnail
  thumb: {
    width:          72,
    height:         72,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },

  // Info column
  info: {
    flex: 1,
    gap:   5,
    paddingRight: 36,   // space for status badge
  },
  name: {},
  catPill: {
    alignSelf:         "flex-start",
    paddingHorizontal: 8,
    paddingVertical:   2,
    borderRadius:      20,
  },
  catText: {},

  // Meta row
  metaRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           3,
    flexWrap:      "wrap",
  },
  rating: {},
  dim: {},
  dot: {
    width:           3,
    height:          3,
    borderRadius:    2,
    marginHorizontal: 2,
  },

  // Tags
  tags: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           5,
    alignItems:    "center",
  },
  tag: {
    paddingHorizontal: 7,
    paddingVertical:   2,
    borderRadius:      20,
    borderWidth:       1,
  },
  tagText: {},
  moreTags: {},

  // Buttons
  actions: {
    flexDirection: "row",
    gap:           8,
    marginTop:     2,
  },
  btn: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 12,
    paddingVertical:   7,
    borderRadius:      20,
  },
  btnOutline: { borderWidth: 1 },
  btnFill:    {},
  btnText:    {},
});
