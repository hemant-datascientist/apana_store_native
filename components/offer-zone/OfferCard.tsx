// ============================================================
// OFFER CARD — Apana Store
//
// Single deal card in the offer zone list.
// Layout:
//   Left colored stripe in store color
//   Discount badge (top-right, bold)
//   Offer title + subtitle
//   Store name badge + validity pill
//   HOT badge if isHot = true
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { Offer } from "../../data/offerZoneData";

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.85}
    >
      {/* Left color stripe matching store color */}
      <View style={[styles.stripe, { backgroundColor: offer.storeColor }]} />

      <View style={styles.body}>
        {/* Top row: title + discount badge */}
        <View style={styles.topRow}>
          <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]} numberOfLines={2}>
            {offer.title}
          </Text>
          {/* Discount badge — prominent, colored bg */}
          <View style={[styles.discountBadge, { backgroundColor: offer.storeColor }]}>
            <Text style={[styles.discountText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
              {offer.discount}
            </Text>
          </View>
        </View>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]} numberOfLines={1}>
          {offer.subtitle}
        </Text>

        {/* Bottom row: store name + validity + HOT badge */}
        <View style={styles.bottomRow}>
          <View style={[styles.storeBadge, { backgroundColor: offer.storeColor + "18" }]}>
            <Ionicons name="storefront-outline" size={11} color={offer.storeColor} />
            <Text style={[styles.storeText, { color: offer.storeColor, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
              {offer.storeName}
            </Text>
          </View>

          <View style={[styles.validityChip, { backgroundColor: colors.background }]}>
            <Ionicons name="time-outline" size={11} color={colors.subText} />
            <Text style={[styles.validityText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
              {offer.validUntil}
            </Text>
          </View>

          {offer.isHot && (
            <View style={styles.hotBadge}>
              <Text style={[styles.hotText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
                🔥 HOT
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius:  14,
    borderWidth:   1,
    overflow:      "hidden",
  },

  stripe: {
    width: 5,
  },

  body: {
    flex:    1,
    padding: 14,
    gap:     8,
  },

  topRow: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           10,
  },
  title: {
    flex:       1,
    lineHeight: 20,
  },

  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderRadius:      8,
    alignSelf:         "flex-start",
  },
  discountText: { color: "#fff" },

  subtitle: { lineHeight: 16 },

  bottomRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
    flexWrap:      "wrap",
  },

  storeBadge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
  },
  storeText: {},

  validityChip: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 7,
    paddingVertical:   3,
    borderRadius:      20,
  },
  validityText: {},

  hotBadge: {
    marginLeft: "auto",
  },
  hotText: { color: "#EF4444" },
});
