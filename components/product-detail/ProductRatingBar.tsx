// ============================================================
// PRODUCT RATING BAR — Apana Store
//
// Shows: overall star rating (large), total review count,
// and a horizontal bar breakdown (5★ → 1★) like Amazon.
// ============================================================

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface ProductRatingBarProps {
  rating:          number;
  reviewCount:     number;
  breakdown:       Record<number, number>;   // { 5: 120, 4: 45, … }
  onSeeAllReviews: () => void;
}

export default function ProductRatingBar({
  rating, reviewCount, breakdown, onSeeAllReviews,
}: ProductRatingBarProps) {
  const { colors } = useTheme();

  const totalVotes = Object.values(breakdown).reduce((s, v) => s + v, 0);

  // Render filled/half/empty stars
  function StarRow({ value }: { value: number }) {
    return (
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map(i => {
          const filled = i <= Math.floor(value);
          const half   = !filled && i - value < 1 && value % 1 >= 0.5;
          return (
            <Ionicons
              key={i}
              name={filled ? "star" : half ? "star-half" : "star-outline"}
              size={16}
              color="#F59E0B"
            />
          );
        })}
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Title row ── */}
      <View style={styles.titleRow}>
        <Ionicons name="star" size={16} color="#F59E0B" />
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          Ratings & Reviews
        </Text>
        <TouchableOpacity onPress={onSeeAllReviews} style={styles.seeAll}>
          <Text style={[styles.seeAllText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            See all
          </Text>
          <Ionicons name="chevron-forward" size={13} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Summary row ── */}
      <View style={styles.summaryRow}>

        {/* Big rating number */}
        <View style={styles.bigRatingBox}>
          <Text style={[styles.bigRating, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: 48 }]}>
            {rating.toFixed(1)}
          </Text>
          <StarRow value={rating} />
          <Text style={[styles.reviewCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {reviewCount.toLocaleString()} reviews
          </Text>
        </View>

        {/* Breakdown bars */}
        <View style={styles.barsCol}>
          {[5, 4, 3, 2, 1].map(star => {
            const count = breakdown[star] ?? 0;
            const pct   = totalVotes > 0 ? count / totalVotes : 0;
            return (
              <View key={star} style={styles.barRow}>
                <Text style={[styles.barLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                  {star}
                </Text>
                <Ionicons name="star" size={10} color="#F59E0B" />
                <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
                  <View style={[styles.barFill, {
                    width:           `${Math.round(pct * 100)}%` as any,
                    backgroundColor: star >= 4 ? "#22C55E" : star === 3 ? "#F59E0B" : "#EF4444",
                  }]} />
                </View>
                <Text style={[styles.barCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                  {count}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth:  1,
    overflow:     "hidden",
  },
  titleRow: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            7,
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  sectionTitle: { flex: 1 },
  seeAll: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           2,
  },
  seeAllText: {},
  divider: { height: 1 },
  summaryRow: {
    flexDirection:  "row",
    gap:            16,
    padding:        16,
    alignItems:     "center",
  },
  bigRatingBox: {
    alignItems: "center",
    gap:        4,
    minWidth:   80,
  },
  bigRating:   {},
  starRow:     { flexDirection: "row", gap: 2 },
  reviewCount: { marginTop: 2 },
  barsCol:     { flex: 1, gap: 6 },
  barRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           5,
  },
  barLabel: { width: 10, textAlign: "right" },
  barTrack: {
    flex:         1,
    height:       6,
    borderRadius: 3,
    overflow:     "hidden",
  },
  barFill:  { height: 6, borderRadius: 3 },
  barCount: { width: 28, textAlign: "right" },
});
