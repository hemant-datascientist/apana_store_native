// ============================================================
// FAVOURITE STORES — Apana Store (Customer App)
//
// Section showing the customer's saved/favourite stores.
// Horizontal scroll of store cards: icon + name + area + rating.
// Open/Closed badge on each card.
// ============================================================

import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FavouriteStore } from "../../../data/profileData";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

interface FavouriteStoresProps {
  stores:    FavouriteStore[];
  onViewAll: () => void;
  onPress:   (store: FavouriteStore) => void;
}

export default function FavouriteStores({ stores, onViewAll, onPress }: FavouriteStoresProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>

      {/* Section header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="heart" size={16} color={colors.danger} />
          <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md }]}>
            Favourite Stores
          </Text>
        </View>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={[styles.viewAll, { color: colors.primary, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal store cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {stores.map(store => (
          <TouchableOpacity
            key={store.id}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => onPress(store)}
            activeOpacity={0.75}
          >
            {/* Icon circle */}
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + "15" }]}>
              <Ionicons name={store.icon as any} size={22} color={colors.primary} />
            </View>

            {/* Store info */}
            <Text
              numberOfLines={1}
              style={[styles.storeName, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}
            >
              {store.name}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.storeArea, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}
            >
              {store.area}
            </Text>

            {/* Footer: rating + open badge */}
            <View style={styles.footer}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={10} color="#F59E0B" />
                <Text style={[styles.rating, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: 10 }]}>
                  {store.rating}
                </Text>
              </View>
              <View style={[
                styles.badge,
                { backgroundColor: store.open ? "#DCFCE7" : "#F3F4F6" },
              ]}>
                <Text style={[
                  styles.badgeText,
                  { color: store.open ? "#15803D" : "#6B7280", fontFamily: typography.fontFamily.semiBold },
                ]}>
                  {store.open ? "Open" : "Closed"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
  },
  header: {
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "center",
    paddingHorizontal: 16,
    marginBottom:      10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
  },
  title:   {},
  viewAll: {},
  scroll: {
    paddingHorizontal: 16,
    gap:               10,
  },
  card: {
    width:         130,
    borderRadius:  14,
    borderWidth:   1,
    padding:       12,
    gap:           5,
  },
  iconCircle: {
    width:         40,
    height:        40,
    borderRadius:  12,
    alignItems:    "center",
    justifyContent: "center",
    marginBottom:  4,
  },
  storeName: {
    lineHeight: 17,
  },
  storeArea: {
    lineHeight: 16,
  },
  footer: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    marginTop:      4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           2,
  },
  rating: {},
  badge: {
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:      6,
  },
  badgeText: {
    fontSize: 10,
  },
});
