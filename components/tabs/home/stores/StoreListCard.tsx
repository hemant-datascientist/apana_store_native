// ============================================================
// STORE LIST CARD — Apana Store (Home Screen, Nearby Feed)
//
// Horizontal card in the nearby stores list:
//   Left  — store thumbnail (placeholder: coloured icon square)
//   Right — name + type badge | rating · reviews · distance |
//            category tags | Direction + View Items buttons
//   Top-right corner — LIVE badge (when isLive)
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../../theme/typography";
import useTheme from "../../../../theme/useTheme";
import { NearbyStore } from "../../../../data/nearbyStoresData";

interface StoreListCardProps {
  store:         NearbyStore;
  onDirection:   (store: NearbyStore) => void;
  onViewItems:   (store: NearbyStore) => void;
}

export default function StoreListCard({ store, onDirection, onViewItems }: StoreListCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => onViewItems(store)}
        style={styles.cardPressable}
      >

      {/* LIVE badge — absolute top-right */}
      {store.isLive && (
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={[styles.liveText, { fontFamily: typography.fontFamily.bold, fontSize: 9 }]}>
            LIVE
          </Text>
        </View>
      )}

      <View style={styles.row}>

        {/* ── Thumbnail ── */}
        <View style={[styles.thumb, { backgroundColor: store.bgColor }]}>
          <Ionicons name={store.icon as any} size={30} color={store.typeColor} />
        </View>

        {/* ── Right content ── */}
        <View style={styles.info}>

          {/* Name + type badge */}
          <View style={styles.nameRow}>
            <Text
              style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}
              numberOfLines={1}
            >
              {store.name}
            </Text>
            <View style={[styles.typeBadge, { backgroundColor: store.typeBg }]}>
              <Text style={[styles.typeText, { color: store.typeColor, fontFamily: typography.fontFamily.semiBold, fontSize: 9 }]}>
                {store.type}
              </Text>
            </View>
          </View>

          {/* Rating · Reviews · Distance */}
          <View style={styles.metaRow}>
            <Ionicons name="star" size={11} color="#F59E0B" />
            <Text style={[styles.meta, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
              {store.rating}
            </Text>
            <Text style={[styles.metaDim, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {store.reviews.toLocaleString("en-IN")} reviews
            </Text>
            <View style={[styles.metaDot, { backgroundColor: colors.border }]} />
            <Ionicons name="location-outline" size={11} color={colors.subText} />
            <Text style={[styles.metaDim, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {store.distanceKm} km
            </Text>
          </View>

          {/* Category tags */}
          <View style={styles.tags}>
            {store.categories.map((cat, i) => (
              <View key={i} style={[styles.tag, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.tagText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 9.5 }]}>
                  {cat}
                </Text>
              </View>
            ))}
          </View>

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
    </TouchableOpacity>
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
  cardPressable: {
    // Ensuring the whole area is covered
  },

  // LIVE badge
  liveBadge: {
    position:          "absolute",
    top:               10,
    right:             10,
    flexDirection:     "row",
    alignItems:        "center",
    gap:                4,
    backgroundColor:   "#DCFCE7",
    paddingHorizontal: 7,
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
  liveText: {
    color: "#15803D",
  },

  // Layout
  row: {
    flexDirection: "row",
    padding:       12,
    gap:           12,
  },

  // Thumbnail
  thumb: {
    width:          76,
    height:         76,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },

  // Info
  info: {
    flex: 1,
    gap:   5,
  },
  nameRow: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:            8,
    flexWrap:      "wrap",
    paddingRight:   40,   // space for LIVE badge
  },
  name: {
    flexShrink: 1,
  },
  typeBadge: {
    paddingHorizontal: 7,
    paddingVertical:   2,
    borderRadius:      20,
    alignSelf:         "flex-start",
  },
  typeText: {},

  // Meta row
  metaRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:            4,
    flexWrap:      "wrap",
  },
  meta:    {},
  metaDim: {},
  metaDot: {
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
  tag: {
    paddingHorizontal: 7,
    paddingVertical:   2,
    borderRadius:      20,
    borderWidth:        1,
  },
  tagText: {},

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
    paddingHorizontal: 10,
    paddingVertical:    6,
    borderRadius:      20,
  },
  btnOutline: {
    borderWidth: 1,
  },
  btnFill:    {},
  btnText:    {},
});
