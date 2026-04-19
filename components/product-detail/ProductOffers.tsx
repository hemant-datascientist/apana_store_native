// ============================================================
// PRODUCT OFFERS — Apana Store
//
// List of available offers/coupons for this product.
// Each row shows icon, offer title, and description.
// ============================================================

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { ProductOffer } from "../../data/productDetailData";

interface ProductOffersProps {
  offers: ProductOffer[];
}

export default function ProductOffers({ offers }: ProductOffersProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  if (offers.length === 0) return null;

  const visible = expanded ? offers : offers.slice(0, 2);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Header ── */}
      <View style={styles.titleRow}>
        <Ionicons name="pricetag-outline" size={16} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          Available Offers
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Offer rows ── */}
      <View style={styles.offerList}>
        {visible.map((offer, i) => (
          <View key={offer.id}>
            <View style={styles.offerRow}>
              <View style={[styles.iconCircle, { backgroundColor: offer.color + "18" }]}>
                <Ionicons name={offer.icon as any} size={16} color={offer.color} />
              </View>
              <View style={styles.offerBody}>
                <Text style={[styles.offerTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
                  {offer.title}
                </Text>
                <Text style={[styles.offerDesc, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                  {offer.description}
                </Text>
              </View>
            </View>
            {i < visible.length - 1 && (
              <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
            )}
          </View>
        ))}
      </View>

      {/* ── Show more / less toggle ── */}
      {offers.length > 2 && (
        <TouchableOpacity
          style={[styles.toggleBtn, { borderColor: colors.border }]}
          onPress={() => setExpanded(e => !e)}
          activeOpacity={0.75}
        >
          <Text style={[styles.toggleText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            {expanded ? "Show fewer offers" : `+${offers.length - 2} more offers`}
          </Text>
          <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={14} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth:  1,
    overflow:     "hidden",
  },
  titleRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           7,
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  title:    {},
  divider:  { height: 1 },
  offerList: { paddingHorizontal: 16, paddingTop: 12, gap: 0 },
  offerRow: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           12,
    paddingBottom: 12,
  },
  iconCircle: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },
  offerBody:  { flex: 1 },
  offerTitle: {},
  offerDesc:  { marginTop: 2, lineHeight: 17 },
  rowDivider: { height: 1, marginBottom: 12 },
  toggleBtn: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            4,
    paddingVertical: 12,
    borderTopWidth:  1,
  },
  toggleText: {},
});
