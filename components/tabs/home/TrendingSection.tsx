// ============================================================
// TRENDING SECTION — Apana Store (Customer App)
//
// "Trending in {city}" — horizontal scroll of local brand /
// store cards. Each card: colored image area with icon +
// name + category + open/popular badge.
// ============================================================

import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TrendingItem } from "../../../data/homeData";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

interface TrendingSectionProps {
  city:     string;
  items:    TrendingItem[];
  onPress:  (item: TrendingItem) => void;
  /** Override the section title. If omitted, shows "Trending in {city}". */
  title?:   string;
  /** Override the section icon. If omitted, shows the flame icon. */
  icon?:    string;
}

const CARD_W   = 130;
const IMG_H    = 100;

export default function TrendingSection({ city, items, onPress, title, icon }: TrendingSectionProps) {
  const { colors } = useTheme();

  const sectionTitle = title ?? `Trending in ${city}`;
  const sectionIcon  = icon  ?? "flame";
  const iconColor    = icon  ? colors.primary : "#F97316";

  return (
    <View style={styles.section}>

      {/* Section header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name={sectionIcon as any} size={18} color={iconColor} />
          <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            {sectionTitle}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={[styles.seeAll, { color: colors.primary, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal card scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {items.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => onPress(item)}
            activeOpacity={0.8}
          >
            {/* Image area */}
            <View style={[styles.imgArea, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon as any} size={38} color="rgba(0,0,0,0.25)" />

              {/* Badge */}
              <View style={[styles.badge, { backgroundColor: item.badgeBg }]}>
                <Text style={[styles.badgeText, { color: item.badgeColor, fontFamily: typography.fontFamily.semiBold }]}>
                  {item.badge}
                </Text>
              </View>
            </View>

            {/* Info */}
            <View style={styles.info}>
              <Text numberOfLines={2} style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                {item.name}
              </Text>
              <View style={styles.meta}>
                <Ionicons name="location-outline" size={10} color={colors.subText} />
                <Text numberOfLines={1} style={[styles.area, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 10 }]}>
                  {item.area}
                </Text>
              </View>
              <Text numberOfLines={1} style={[styles.category, { color: colors.primary, fontFamily: typography.fontFamily.medium, fontSize: 10 }]}>
                {item.category}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  header: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    marginBottom:      12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
  },
  title:  {},
  seeAll: {},
  scroll: {
    paddingHorizontal: 16,
    gap:               10,
  },
  card: {
    width:        CARD_W,
    borderRadius: 14,
    borderWidth:  1,
    overflow:     "hidden",
  },
  imgArea: {
    height:         IMG_H,
    alignItems:     "center",
    justifyContent: "center",
    position:       "relative",
  },
  badge: {
    position:         "absolute",
    top:               8,
    right:             8,
    paddingHorizontal: 6,
    paddingVertical:   2,
    borderRadius:      6,
  },
  badgeText: {
    fontSize: 9,
  },
  info: {
    padding: 8,
    gap:     3,
  },
  name:     { lineHeight: 16 },
  meta: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           2,
  },
  area:     { flex: 1 },
  category: {},
});
