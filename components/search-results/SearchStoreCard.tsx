// ============================================================
// SEARCH STORE CARD — Apana Store
//
// Full-width store card shown in the Stores tab of search results.
//
// Layout (horizontal):
//   Left  — store icon thumbnail (square, accent-coloured)
//   Right — [Name ........................ LIVE/OPEN/CLOSED]
//            Category pill
//            ⭐ Rating · (N reviews) · 📍 km
//            [tag] [tag] [tag] +N
//            [Direction]  [View Store]
//
// Status colours are resolved from the theme (success/warning/
// danger + primary) so dark/light modes look right without any
// hardcoded hex values.
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

  // ── Resolve status colour from theme ─────────────────────
  const status = store.isLive
    ? { label: "LIVE",   fg: colors.success, bg: colors.success + "22" }
    : store.isOpen
      ? { label: "OPEN",   fg: colors.primary, bg: colors.primary + "1A" }
      : { label: "CLOSED", fg: colors.danger,  bg: colors.danger  + "22" };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <View style={styles.row}>

        {/* ── Icon thumbnail ── */}
        <View style={[styles.thumb, { backgroundColor: store.iconBg }]}>
          <Ionicons name={store.icon as any} size={30} color={store.accentColor} />
        </View>

        {/* ── Right info column ── */}
        <View style={styles.info}>

          {/* Name + inline status badge */}
          <View style={styles.nameRow}>
            <Text
              numberOfLines={1}
              style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}
            >
              {store.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              {store.isLive && <View style={[styles.liveDot, { backgroundColor: status.fg }]} />}
              <Text style={[
                styles.statusText,
                { color: status.fg, fontFamily: typography.fontFamily.bold, fontSize: 9 },
              ]}>
                {status.label}
              </Text>
            </View>
          </View>

          {/* Category pill */}
          <View style={[styles.catPill, { backgroundColor: store.iconBg }]}>
            <Text style={[styles.catText, { color: store.accentColor, fontFamily: typography.fontFamily.semiBold, fontSize: 9.5 }]}>
              {store.category}
            </Text>
          </View>

          {/* Rating · reviews · distance */}
          <View style={styles.metaRow}>
            <Ionicons name="star" size={11} color={colors.warning} />
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
          {store.tags.length > 0 && (
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
          )}

          {/* Action buttons — wrap-safe on narrow screens */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnOutline, { borderColor: colors.primary }]}
              onPress={(e) => { e.stopPropagation?.(); onDirection(); }}
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
  },

  row: {
    flexDirection: "row",
    padding:       12,
    gap:           12,
  },

  // Thumbnail
  thumb: {
    width:          64,
    height:         64,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },

  // Info column
  info: { flex: 1, gap: 6 },

  // Name row — name flexes, badge is auto-sized
  nameRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
  },
  name: { flex: 1 },

  // Inline status badge
  statusBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
    flexShrink:        0,
  },
  liveDot: {
    width:        6,
    height:       6,
    borderRadius: 3,
  },
  statusText: {},

  // Category pill
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
  dim:    {},
  dot: {
    width:            3,
    height:           3,
    borderRadius:     2,
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
  tagText:  {},
  moreTags: {},

  // Action buttons
  actions: {
    flexDirection: "row",
    flexWrap:      "wrap",
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
