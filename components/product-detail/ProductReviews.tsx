// ============================================================
// PRODUCT REVIEWS — Apana Store
//
// Renders the first 3 customer reviews with:
//   author avatar (initials), verified badge, star rating,
//   title, body text, review images (placeholder), helpful count.
// "See all reviews" navigates to full review list (future screen).
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { ProductReview } from "../../data/productDetailData";

interface ProductReviewsProps {
  reviews:    ProductReview[];
  totalCount: number;
}

// ── Star row helper ───────────────────────────────────────────
function Stars({ value }: { value: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons
          key={i}
          name={i <= value ? "star" : "star-outline"}
          size={12}
          color="#F59E0B"
        />
      ))}
    </View>
  );
}

export default function ProductReviews({ reviews, totalCount }: ProductReviewsProps) {
  const { colors } = useTheme();

  if (reviews.length === 0) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Header ── */}
      <View style={styles.titleRow}>
        <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          Customer Reviews
        </Text>
        <Text style={[styles.count, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          ({totalCount})
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Review list ── */}
      {reviews.map((review, i) => (
        <View key={review.id}>
          <View style={styles.review}>

            {/* Author row */}
            <View style={styles.authorRow}>
              <View style={[styles.avatar, { backgroundColor: review.avatarBg }]}>
                <Text style={[styles.initials, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
                  {review.initials}
                </Text>
              </View>
              <View style={styles.authorInfo}>
                <Text style={[styles.authorName, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
                  {review.author}
                </Text>
                <View style={styles.verifiedRow}>
                  {review.verified && (
                    <>
                      <Ionicons name="checkmark-circle" size={12} color="#16A34A" />
                      <Text style={[styles.verified, { color: "#16A34A", fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                        Verified Purchase
                      </Text>
                      <Text style={[styles.dot, { color: colors.border }]}>·</Text>
                    </>
                  )}
                  <Text style={[styles.date, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                    {review.date}
                  </Text>
                </View>
              </View>
              <Stars value={review.rating} />
            </View>

            {/* Review content */}
            <Text style={[styles.reviewTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
              {review.title}
            </Text>
            <Text style={[styles.reviewBody, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
              {review.body}
            </Text>

            {/* Review images */}
            {review.images.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imagesRow}>
                {review.images.map(img => (
                  <View key={img.id} style={[styles.reviewImg, { backgroundColor: img.color }]}>
                    <Ionicons name="image-outline" size={20} color="#00000033" />
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Helpful row */}
            <View style={styles.helpfulRow}>
              <Text style={[styles.helpfulLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                Helpful?
              </Text>
              <TouchableOpacity style={[styles.helpfulBtn, { borderColor: colors.border }]}>
                <Ionicons name="thumbs-up-outline" size={13} color={colors.subText} />
                <Text style={[styles.helpfulCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                  {review.helpful}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {i < reviews.length - 1 && (
            <View style={[styles.reviewDivider, { backgroundColor: colors.border }]} />
          )}
        </View>
      ))}

      {/* ── See all ── */}
      {totalCount > reviews.length && (
        <TouchableOpacity style={[styles.seeAllBtn, { borderTopColor: colors.border }]} activeOpacity={0.75}>
          <Text style={[styles.seeAllText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
            See all {totalCount} reviews
          </Text>
          <Ionicons name="arrow-forward" size={15} color={colors.primary} />
        </TouchableOpacity>
      )}
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
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  title:   { flex: 1 },
  count:   {},
  divider: { height: 1 },
  review:  { padding: 16, gap: 10 },
  authorRow: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           10,
  },
  avatar: {
    width:          38,
    height:         38,
    borderRadius:   19,
    alignItems:     "center",
    justifyContent: "center",
  },
  initials:    {},
  authorInfo:  { flex: 1, gap: 3 },
  authorName:  {},
  verifiedRow: { flexDirection: "row", alignItems: "center", gap: 4, flexWrap: "wrap" },
  verified:    {},
  dot:         {},
  date:        {},
  reviewTitle: {},
  reviewBody:  { lineHeight: 20 },
  imagesRow:   { gap: 8 },
  reviewImg: {
    width:          72,
    height:         72,
    borderRadius:   8,
    alignItems:     "center",
    justifyContent: "center",
  },
  helpfulRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
  },
  helpfulLabel: {},
  helpfulBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    borderWidth:       1,
    borderRadius:      8,
    paddingHorizontal: 10,
    paddingVertical:   4,
  },
  helpfulCount: {},
  reviewDivider: { height: 1 },
  seeAllBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             6,
    paddingVertical: 14,
    borderTopWidth:  1,
  },
  seeAllText: {},
});
