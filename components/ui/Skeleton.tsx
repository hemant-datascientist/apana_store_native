// ============================================================
// SKELETON — the shape of the content, pulsing, while it loads.
//
// WHY SKELETONS AND NOT A CENTRED SPINNER
// ---------------------------------------
// A spinner says "something is happening somewhere". A skeleton says "a
// list of store cards is about to appear here, and it will be about this
// tall" — so the screen does not visibly reflow when data lands, and the
// wait feels shorter because the layout is already legible.
//
// Use a skeleton when the shape is KNOWN and the wait is likely >300ms
// (a list, a card, a detail screen). Use <Spinner> when the shape is not
// known or the action is a point event (a button submitting).
//
// 🔴 NEVER render a skeleton over content that has already loaded, and
// never as a "just in case" wrapper. A skeleton is a claim that real data
// is coming; leaving one up when a request has FAILED is the loading-state
// version of phantom data (§19.8) — the customer waits forever for
// something that is never going to arrive. Pair every skeleton with an
// error branch that swaps to <StateView variant="error">.
//
// Animation runs on the UI thread via reanimated, so it keeps pulsing
// smoothly even while the JS thread is busy parsing the response it is
// waiting for — which is exactly when a JS-driven animation would stutter
// and look broken.
// ============================================================

import React, { useEffect } from "react";
import { View, StyleSheet, type ViewStyle, type DimensionValue } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing,
} from "react-native-reanimated";
import useTheme from "../../theme/useTheme";

const PULSE_MS = 750;

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

/** One pulsing block. Everything below composes these. */
export function Skeleton({ width = "100%", height = 14, radius = 6, style }: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.55);

  useEffect(() => {
    // Opacity, not a gradient sweep: a sweep needs expo-linear-gradient,
    // which only one of the three apps has. Pulsing reads as "loading"
    // just as clearly and works identically everywhere.
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: PULSE_MS, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.55, { duration: PULSE_MS, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [opacity]);

  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: colors.border },
        animated,
        style,
      ]}
      // Screen readers should hear "loading", not a stack of blank boxes.
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    />
  );
}

/** A text block — several lines, last one short like real wrapped text. */
export function SkeletonText({ lines = 3, lastLineWidth = "60%" }: { lines?: number; lastLineWidth?: DimensionValue }) {
  return (
    <View style={styles.textBlock}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={12}
          width={i === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </View>
  );
}

/** Thumbnail + two lines — the store/product card shape used across the app. */
export function SkeletonCard({ imageHeight = 110 }: { imageHeight?: number }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Skeleton height={imageHeight} radius={12} />
      <Skeleton height={13} width="80%" />
      <Skeleton height={11} width="50%" />
    </View>
  );
}

/** Avatar + two lines — the list-row shape (orders, notifications, addresses). */
export function SkeletonRow() {
  return (
    <View style={styles.row}>
      <Skeleton width={44} height={44} radius={22} />
      <View style={styles.rowText}>
        <Skeleton height={13} width="70%" />
        <Skeleton height={11} width="45%" />
      </View>
    </View>
  );
}

/**
 * N rows or cards. `count` should match what the screen usually shows, so
 * the page does not jump when real data replaces it.
 */
export function SkeletonList({ count = 5, variant = "row" }: { count?: number; variant?: "row" | "card" }) {
  return (
    <View style={variant === "card" ? styles.cardGrid : undefined}>
      {Array.from({ length: count }).map((_, i) =>
        variant === "card" ? <SkeletonCard key={i} /> : <SkeletonRow key={i} />,
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textBlock: { gap: 8 },
  card:      { borderRadius: 16, borderWidth: 1, padding: 12, gap: 10, marginBottom: 12 },
  cardGrid:  { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  row:       { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  rowText:   { flex: 1, gap: 8 },
});
