// ============================================================
// POPULAR STORES SECTION — Apana Store
//
// Horizontal scroll of top-rated local stores near the user.
// Card: store name + category + area + star rating + badge.
// ============================================================

import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from "react-native";
import { Ionicons }       from "@expo/vector-icons";
import { typography }     from "../../../../theme/typography";
import SectionHeader      from "./SectionHeader";
import { PopularStore }   from "../../../../data/allFeedData";

interface PopularStoresSectionProps {
  stores: PopularStore[];
}

const STORE_ACCENT = "#0F4C81";
const CARD_W       = 148;
const IMG_H        = 88;

export default function PopularStoresSection({ stores }: PopularStoresSectionProps) {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <SectionHeader
          icon="location-outline"
          title="Popular Near You"
          accentColor={STORE_ACCENT}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {stores.map(s => (
          <TouchableOpacity
            key={s.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => Alert.alert(s.name, `${s.category} · ${s.area}`)}
          >
            {/* Image placeholder */}
            <View style={[styles.imgArea, { backgroundColor: s.bg }]}>
              <Ionicons name={s.icon as any} size={38} color="rgba(0,0,0,0.20)" />

              {/* Badge */}
              <View style={[styles.badge, { backgroundColor: s.badgeBg }]}>
                <Text style={[styles.badgeText, { color: s.badgeColor, fontFamily: typography.fontFamily.bold }]}>
                  {s.badge}
                </Text>
              </View>
            </View>

            {/* Info */}
            <View style={styles.info}>
              <Text numberOfLines={1} style={[styles.name, { fontFamily: typography.fontFamily.bold }]}>
                {s.name}
              </Text>

              <Text numberOfLines={1} style={[styles.category, { color: STORE_ACCENT, fontFamily: typography.fontFamily.medium }]}>
                {s.category}
              </Text>

              {/* Location + rating row */}
              <View style={styles.metaRow}>
                <View style={styles.locRow}>
                  <Ionicons name="location-outline" size={10} color="#9CA3AF" />
                  <Text style={[styles.area, { fontFamily: typography.fontFamily.regular }]}>
                    {s.area}
                  </Text>
                </View>

                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={10} color="#F59E0B" />
                  <Text style={[styles.rating, { fontFamily: typography.fontFamily.semiBold }]}>
                    {s.rating.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { marginTop: 20 },

  header: { paddingHorizontal: 16 },

  scroll: {
    paddingHorizontal: 16,
    gap:               10,
    paddingBottom:     4,
  },

  card: {
    width:           CARD_W,
    borderRadius:    12,
    overflow:        "hidden",
    backgroundColor: "#fff",
    borderWidth:     1,
    borderColor:     "#E5E7EB",
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.07,
    shadowRadius:    4,
    elevation:       2,
  },

  imgArea: {
    width:          "100%",
    height:         IMG_H,
    alignItems:     "center",
    justifyContent: "center",
    position:       "relative",
  },

  badge: {
    position:          "absolute",
    top:               6,
    right:             6,
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:      5,
  },
  badgeText: { fontSize: 8.5 },

  info: {
    padding: 8,
    gap:     2,
  },
  name: {
    fontSize: 12,
    color:    "#111827",
  },
  category: {
    fontSize: 10.5,
  },

  metaRow: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    marginTop:      3,
  },
  locRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           2,
    flex:          1,
  },
  area: {
    fontSize: 9.5,
    color:    "#9CA3AF",
    flex:     1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           2,
  },
  rating: {
    fontSize: 10.5,
    color:    "#374151",
  },
});
