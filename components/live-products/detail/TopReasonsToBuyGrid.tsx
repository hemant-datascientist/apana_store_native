// ============================================================
// TopReasonsToBuyGrid — Big Tech "Top Reasons to Buy" Visual Grid
//
// Shows ONLY the reasons the brand entered in the registry
// (top_reasons_to_buy). No entry = section hidden; never a category guess.
// ============================================================

import React from "react";
import { View, Text, StyleSheet, Image, useWindowDimensions } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import { brandReasons } from "./brandContent";

export interface ReasonItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  mciName?: keyof typeof MaterialCommunityIcons.glyphMap;
  badge?: string;
  accentColor?: string;
}

interface TopReasonsToBuyGridProps {
  title?: string;
  reasons?: ReasonItem[];
  attributes?: Record<string, unknown>;
}

export default function TopReasonsToBuyGrid({
  title = "Top Reasons to Buy",
  reasons: propReasons,
  attributes,
}: TopReasonsToBuyGridProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const items: ReasonItem[] = propReasons && propReasons.length > 0
    ? propReasons
    : brandReasons(attributes);

  if (!items || items.length === 0) return null;

  // Compute 3 items per row with margin
  const cardWidth = Math.floor((width - 32 - 16) / 3); // (screenWidth - padding(32) - gap(16)) / 3

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Ionicons name="ribbon-outline" size={20} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
            {title}
          </Text>
        </View>
        <Text style={[styles.badgeCount, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
          {items.length} Highlights
        </Text>
      </View>

      <View style={styles.grid}>
        {items.map((item, idx) => (
          <View
            key={item.id || idx}
            style={[
              styles.card,
              {
                width: cardWidth,
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Visual Icon / Photo Hero */}
            <View
              style={[
                styles.mediaBox,
                {
                  backgroundColor: item.accentColor ? `${item.accentColor}12` : `${colors.primary}10`,
                },
              ]}
            >
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.cardImage} resizeMode="cover" />
              ) : (
                <Ionicons
                  name={item.iconName || "sparkles-outline"}
                  size={26}
                  color={item.accentColor || colors.primary}
                />
              )}
            </View>

            {/* Bold Title */}
            <Text
              numberOfLines={2}
              style={[
                styles.cardTitle,
                {
                  color: colors.text,
                  fontFamily: typography.fontFamily.bold,
                },
              ]}
            >
              {item.title}
            </Text>

            {/* Optional Subtitle */}
            {item.subtitle && (
              <Text
                numberOfLines={2}
                style={[
                  styles.cardSub,
                  {
                    color: colors.subText,
                    fontFamily: typography.fontFamily.regular,
                  },
                ]}
              >
                {item.subtitle}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: typography.size.lg,
  },
  badgeCount: {
    fontSize: typography.size.xs,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    alignItems: "center",
    minHeight: 122,
    justifyContent: "flex-start",
  },
  mediaBox: {
    width: "100%",
    height: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardTitle: {
    fontSize: 11.5,
    textAlign: "center",
    lineHeight: 14.5,
  },
  cardSub: {
    fontSize: 9.5,
    textAlign: "center",
    marginTop: 2,
    lineHeight: 12,
  },
});
