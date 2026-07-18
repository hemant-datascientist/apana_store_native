// ============================================================
// DetailHero — product image carousel + "Made in India" flag badge.
// Mirrors the SmartConsumer detail hero: paged images, dot indicator,
// tricolor roundel top-right when the product's country is India.
// ============================================================

import React, { useState } from "react";
import { View, Image, StyleSheet, FlatList, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../../theme/useTheme";

interface DetailHeroProps {
  images: string[];
  isIndia: boolean;
}

function IndiaRoundel() {
  return (
    <View style={styles.flag}>
      <View style={[styles.band, { backgroundColor: "#FF9933" }]} />
      <View style={[styles.band, { backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }]}>
        <View style={styles.chakra} />
      </View>
      <View style={[styles.band, { backgroundColor: "#138808" }]} />
    </View>
  );
}

export default function DetailHero({ images, isIndia }: DetailHeroProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const cardWidth = width - 32; // screen padding 16 each side

  return (
    <View style={[styles.wrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {images.length > 0 ? (
        <FlatList
          data={images}
          keyExtractor={(u, i) => `${i}-${u}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) =>
            setPage(Math.round(e.nativeEvent.contentOffset.x / cardWidth))
          }
          renderItem={({ item }) => (
            <View style={{ width: cardWidth, height: 260 }}>
              <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
            </View>
          )}
        />
      ) : (
        <View style={[styles.placeholder, { width: cardWidth }]}>
          <Ionicons name="cube-outline" size={60} color={colors.subText} />
        </View>
      )}

      {isIndia && (
        <View style={styles.flagBadge}>
          <IndiaRoundel />
        </View>
      )}

      {images.length > 1 && (
        <View style={styles.dots}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === page ? colors.primary : colors.border, width: i === page ? 20 : 6 },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    position: "relative",
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  placeholder: { height: 260, alignItems: "center", justifyContent: "center" },
  flagBadge: { position: "absolute", top: 12, right: 12 },
  flag: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  band: { flex: 1 },
  chakra: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#000080",
  },
  dots: { flexDirection: "row", justifyContent: "center", gap: 5, marginTop: 12 },
  dot: { height: 6, borderRadius: 3 },
});
