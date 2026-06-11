// ============================================================
// SUB CATEGORY CARD — Apana Store (Customer App)
//
// Single tile in the 3-column category grid.
// Top:    colored square with a centered Ionicons icon.
// Bottom: label (2 lines max, centered).
// Width passed from parent = (screenWidth - padding - gaps) / 3.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { SubCategory } from "../../../data/categoryData";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

interface SubCategoryCardProps {
  item:    SubCategory;
  width:   number;
  onPress: (item: SubCategory) => void;
}

function SubCategoryCard({ item, width, onPress }: SubCategoryCardProps) {
  const { colors } = useTheme();
  const tileSize = width - 16;

  return (
    <TouchableOpacity
      style={[styles.card, { width, backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onPress(item)}
      activeOpacity={0.75}
    >
      {/* ── Image / Skeleton tile ── */}
      <View style={[styles.tile, { backgroundColor: item.color, width: tileSize, height: tileSize }]}>
        
        {/* Skeleton icon (always present in background) */}
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.skeletonContainer}>
            <Ionicons name={item.icon as any} size={34} color="rgba(0,0,0,0.18)" />
          </View>
        </View>

        {/* Image — expo-image handles require() assets, objects and URIs */}
        {item.imageUrl != null && item.imageUrl !== "" && (
          <Image
            source={
              typeof item.imageUrl === "string"
                ? { uri: item.imageUrl }
                : item.imageUrl
            }
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={300}
            recyclingKey={item.key}
            cachePolicy="memory-disk"
          />
        )}

      </View>

      {/* Label */}
      <Text
        numberOfLines={2}
        style={[styles.label, {
          color:      colors.text,
          fontFamily: typography.fontFamily.medium,
          fontSize:   typography.size.xs,
        }]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth:  1,
    padding:      8,
    alignItems:   "center",
    gap:          7,
  },
  tile: {
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
    overflow:       "hidden",
  },
  skeletonContainer: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
  },
  label: {
    textAlign:  "center",
    lineHeight: 17,
  },
});

// Memoised: in the virtualized category grid the same tile re-renders as the
// list recycles rows — props are stable, so skip re-render unless they change.
export default React.memo(SubCategoryCard);
