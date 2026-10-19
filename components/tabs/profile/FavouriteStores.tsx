// ============================================================
// STORES YOU FOLLOW — Apana Store (Customer App)
//
// Profile section: horizontal scroll of the stores the customer follows
// (§30 — the single store relationship; replaced the old separate
// "favourite stores" list). Cards: icon + name + city + store type, from the
// server's follow list. No rating or Open badge: that endpoint carries
// neither, and the demo store's values would be invented (§19.8). Empty state
// nudges toward following a store — never phantom rows.
// ============================================================

import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FollowedStore } from "../../../lib/followStore";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

interface FavouriteStoresProps {
  stores:    FollowedStore[];
  onViewAll: () => void;
  onPress:   (store: FollowedStore) => void;
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
            Stores You Follow
          </Text>
        </View>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={[styles.viewAll, { color: colors.primary, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {stores.length === 0 ? (
        /* Empty — no phantom stores; nudge toward the follow action */
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="heart-outline" size={22} color={colors.subText} />
          <Text style={[styles.emptyText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            Follow a store to see it here — tap the heart on any storefront.
          </Text>
        </View>
      ) : (
        /* Horizontal store cards */
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
                <Ionicons name="storefront-outline" size={22} color={colors.primary} />
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
                {store.city ?? ""}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.storeArea, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}
              >
                {store.categoryLabel}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

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
  emptyCard: {
    flexDirection:    "row",
    alignItems:       "center",
    gap:              10,
    marginHorizontal: 16,
    borderRadius:     14,
    borderWidth:      1,
    padding:          14,
  },
  emptyText: {
    flex:       1,
    lineHeight: 16,
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
});
