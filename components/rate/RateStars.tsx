// ============================================================
// RATE STARS — Apana Store
//
// Interactive 5-star rating row.
// Tapping a star sets the rating; the selected star gets a
// scale-bounce animation. Stars left of selection are filled gold.
// ============================================================

import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const STAR_COUNT  = 5;
const STAR_SIZE   = 44;
const GOLD        = "#F59E0B";
const GRAY        = "#D1D5DB";

interface RateStarsProps {
  rating:    number;       // 0 = none selected, 1–5
  onChange:  (r: number) => void;
}

export default function RateStars({ rating, onChange }: RateStarsProps) {
  // ── One Animated.Value per star for the bounce effect ────
  const scales = useRef(
    Array.from({ length: STAR_COUNT }, () => new Animated.Value(1))
  ).current;

  function handlePress(idx: number) {
    const newRating = idx + 1;
    onChange(newRating);
    // Bounce the tapped star
    Animated.sequence([
      Animated.timing(scales[idx], { toValue: 1.4, duration: 120, useNativeDriver: true }),
      Animated.spring(scales[idx],  { toValue: 1,   useNativeDriver: true, friction: 4 }),
    ]).start();
  }

  return (
    <View style={styles.row}>
      {Array.from({ length: STAR_COUNT }, (_, idx) => {
        const filled = idx < rating;
        return (
          <TouchableOpacity
            key={idx}
            onPress={() => handlePress(idx)}
            activeOpacity={0.7}
          >
            <Animated.View style={{ transform: [{ scale: scales[idx] }] }}>
              <Ionicons
                name={filled ? "star" : "star-outline"}
                size={STAR_SIZE}
                color={filled ? GOLD : GRAY}
              />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  "row",
    justifyContent: "center",
    gap:            8,
  },
});
