// ============================================================
// SERVICE STORE CARD — Apana Store (Home, Stores Service Based)
//
// Card layout (differs from StoreListCard and B2CStoreCard):
//   Left  — store photo placeholder (larger thumbnail)
//   Right — name + LIVE | rating · reviews · distance |
//            Website tag |
//            3 buttons: Call Now | Direction | View Info
// ============================================================

import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "../../../../theme/typography";
import useTheme from "../../../../theme/useTheme";
import { ServiceStore } from "../../../data/serviceStoresData";

interface ServiceStoreCardProps {
  store:       ServiceStore;
  onCall:      (store: ServiceStore) => void;
  onDirection: (store: ServiceStore) => void;
  onViewInfo:  (store: ServiceStore) => void;
}

export default function ServiceStoreCard({ store, onCall, onDirection, onViewInfo }: ServiceStoreCardProps) {
  const { colors } = useTheme();

  // Star color based on rating
  const starColor = store.rating >= 4.5 ? "#16A34A" : store.rating >= 4.0 ? "#F59E0B" : "#EF4444";

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* LIVE badge */}
      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={[styles.liveText, { fontFamily: typography.fontFamily.bold, fontSize: 9 }]}>
          LIVE
        </Text>
      </View>

      <View style={styles.row}>

        {/* ── Thumbnail ── */}
        <View style={[styles.thumb, { backgroundColor: store.bgColor }]}>
          <Ionicons name={store.icon as any} size={32} color={colors.primary} />
        </View>

        {/* ── Right content ── */}
        <View style={styles.info}>

          {/* Store name */}
          <Text
            style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}
            numberOfLines={2}
          >
            {store.name}
          </Text>

          {/* Rating · Reviews · Distance */}
          <View style={styles.metaRow}>
            <Ionicons name="star" size={12} color={starColor} />
            <Text style={[styles.rating, { color: starColor, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
              {store.rating}
            </Text>
            <Text style={[styles.metaDim, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              · {store.reviews.toLocaleString("en-IN")} reviews · {store.distanceKm} km
            </Text>
          </View>

          {/* Website tag */}
          {store.website && (
            <TouchableOpacity
              style={[styles.websiteTag, { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }]}
              onPress={() => Alert.alert(store.name, "Website coming soon.")}
              activeOpacity={0.75}
            >
              <Ionicons name="globe-outline" size={11} color="#1D4ED8" />
              <Text style={[styles.websiteText, { color: "#1D4ED8", fontFamily: typography.fontFamily.semiBold, fontSize: 9.5 }]}>
                Website
              </Text>
            </TouchableOpacity>
          )}

          {/* 3 action buttons */}
          <View style={styles.actions}>
            {/* Call Now */}
            <TouchableOpacity
              style={[styles.btn, styles.btnOutline, { borderColor: colors.primary, flex: 1 }]}
              onPress={() => onCall(store)}
              activeOpacity={0.75}
            >
              <Ionicons name="call-outline" size={12} color={colors.primary} />
              <Text style={[styles.btnText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: 10 }]}>
                Call Now
              </Text>
            </TouchableOpacity>

            {/* Direction */}
            <TouchableOpacity
              style={[styles.btn, styles.btnFill, { backgroundColor: colors.primary, flex: 1 }]}
              onPress={() => onDirection(store)}
              activeOpacity={0.75}
            >
              <Ionicons name="navigate-outline" size={12} color="#fff" />
              <Text style={[styles.btnText, { color: "#fff", fontFamily: typography.fontFamily.semiBold, fontSize: 10 }]}>
                Direction
              </Text>
            </TouchableOpacity>

            {/* View Info */}
            <TouchableOpacity
              style={[styles.btn, styles.btnOutline, { borderColor: colors.border, flex: 1 }]}
              onPress={() => onViewInfo(store)}
              activeOpacity={0.75}
            >
              <Ionicons name="information-circle-outline" size={12} color={colors.subText} />
              <Text style={[styles.btnText, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: 10 }]}>
                View Info
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

  // LIVE badge
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

  // Thumbnail — taller than Nearby cards
  thumb: {
    width:          78,
    height:         "100%",
    minHeight:      100,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },

  // Info
  info: { flex: 1, gap: 6 },

  name: {
    paddingRight: 44,   // avoid LIVE badge overlap
    lineHeight:   19,
  },

  // Meta
  metaRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:            3,
  },
  rating:  {},
  metaDim: {},

  // Website tag
  websiteTag: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:                4,
    alignSelf:         "flex-start",
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
    borderWidth:        1,
  },
  websiteText: {},

  // Buttons
  actions: {
    flexDirection: "row",
    gap:            5,
    marginTop:      2,
  },
  btn: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:                3,
    paddingHorizontal: 6,
    paddingVertical:   6,
    borderRadius:      20,
  },
  btnOutline: { borderWidth: 1 },
  btnFill:    {},
  btnText:    {},
});
