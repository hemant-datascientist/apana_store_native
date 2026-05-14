// ============================================================
// STORE TYPE CARD — Apana Store (Customer App)
//
// Large 2-column card for the Stores discovery mode.
// Top area:  full-width colored image zone with centered icon
//            + a subtle dark gradient overlay at the bottom.
// Bottom:    store type name (bold) + short descriptor (muted).
//
// Width passed from parent = (screenWidth - padding - gap) / 2.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StoreType } from "../../../data/categoryData";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

interface StoreTypeCardProps {
  item:    StoreType;
  width:   number;
  onPress: (item: StoreType) => void;
}

export default function StoreTypeCard({ item, width, onPress }: StoreTypeCardProps) {
  const { colors } = useTheme();
  const imgHeight = width * 0.68; // ~68% height keeps the card portrait-like

  return (
    <TouchableOpacity
      style={[styles.card, { width, backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      {/* ── Image / Skeleton area ── */}
      <View style={[styles.imgArea, { backgroundColor: item.color, height: imgHeight }]}>

        {/* Skeleton icon (underlay) */}
        <View style={StyleSheet.absoluteFillObject}>
          <View style={styles.skeletonContainer}>
            <Ionicons name={item.icon as any} size={52} color="rgba(0,0,0,0.12)" />
          </View>
        </View>

        {/* Remote image */}
        {item.imageUrl && (
          <Image
            source={item.imageUrl}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            transition={300}
          />
        )}

        {/* Bottom gradient overlay strip */}
        <View style={styles.overlay} />

      </View>

      {/* ── Text area ── */}
      <View style={styles.textArea}>
        <Text
          numberOfLines={1}
          style={[styles.label, {
            color:      colors.text,
            fontFamily: typography.fontFamily.semiBold,
            fontSize:   typography.size.sm,
          }]}
        >
          {item.label}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.sub, {
            color:      colors.subText,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.xs,
          }]}
        >
          {item.sub}
        </Text>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius:  14,
    borderWidth:    1,
    overflow:      "hidden",
  },
  imgArea: {
    width:          "100%",
    alignItems:     "center",
    justifyContent: "center",
    position:       "relative",
  },
  skeletonContainer: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
  },
  overlay: {
    position:        "absolute",
    bottom:           0,
    left:             0,
    right:            0,
    height:           28,
    backgroundColor: "rgba(0,0,0,0.07)",
  },
  textArea: {
    paddingHorizontal: 10,
    paddingVertical:    10,
    gap:                3,
  },
  label: {},
  sub:   {},
});
