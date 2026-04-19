// ============================================================
// RATE THANK YOU — Apana Store
//
// Shown after a rating is submitted.
// Displays the submitted star count, a thank-you message,
// and a "Rate on Play Store" CTA for users who gave 4–5 stars.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

// ── Emoji + message based on star rating ─────────────────
const RATING_META: Record<number, { emoji: string; heading: string; message: string }> = {
  1: { emoji: "😞", heading: "We're sorry to hear that",     message: "Your feedback helps us improve. We'll work on it." },
  2: { emoji: "😐", heading: "Thanks for being honest",      message: "We'll use your feedback to do better." },
  3: { emoji: "🙂", heading: "Thanks for the feedback!",     message: "We're continuously improving the experience for you." },
  4: { emoji: "😊", heading: "Great, we're glad you like it!", message: "Help others discover Apana Store by rating us." },
  5: { emoji: "🤩", heading: "You made our day!",            message: "Love from the Apana team. Help us spread the word!" },
};

interface RateThankYouProps {
  rating: number;
}

export default function RateThankYou({ rating }: RateThankYouProps) {
  const { colors } = useTheme();
  const router     = useRouter();
  const meta       = RATING_META[rating] ?? RATING_META[3];
  const showStoreLink = rating >= 4;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* Emoji + stars */}
      <Text style={styles.emoji}>{meta.emoji}</Text>

      <View style={styles.starsRow}>
        {Array.from({ length: 5 }, (_, i) => (
          <Ionicons
            key={i}
            name={i < rating ? "star" : "star-outline"}
            size={22}
            color={i < rating ? "#F59E0B" : colors.border}
          />
        ))}
      </View>

      {/* Heading + message */}
      <Text style={[styles.heading, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
        {meta.heading}
      </Text>
      <Text style={[styles.message, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
        {meta.message}
      </Text>

      {/* Play Store CTA — only for happy raters */}
      {showStoreLink && (
        <TouchableOpacity
          style={[styles.storeBtn, { backgroundColor: "#22C55E" }]}
          onPress={() => Linking.openURL("https://play.google.com/store")}
          activeOpacity={0.85}
        >
          <Ionicons name="logo-google-playstore" size={18} color="#fff" />
          <Text style={[styles.storeBtnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            Rate on Play Store
          </Text>
        </TouchableOpacity>
      )}

      {/* Back to home */}
      <TouchableOpacity
        style={[styles.homeBtn, { borderColor: colors.border }]}
        onPress={() => router.replace("/(tabs)")}
        activeOpacity={0.8}
      >
        <Ionicons name="home-outline" size={16} color={colors.text} />
        <Text style={[styles.homeBtnText, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
          Back to Home
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius:     20,
    borderWidth:      1,
    padding:          28,
    alignItems:       "center",
    gap:              14,
  },

  emoji:     { fontSize: 64 },

  starsRow: {
    flexDirection: "row",
    gap:           4,
  },

  heading: { textAlign: "center" },
  message: { textAlign: "center", lineHeight: 22 },

  storeBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               8,
    paddingHorizontal: 24,
    paddingVertical:   13,
    borderRadius:      14,
    marginTop:         4,
    alignSelf:         "stretch",
    justifyContent:    "center",
  },
  storeBtnText: { color: "#fff" },

  homeBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               8,
    paddingHorizontal: 24,
    paddingVertical:   12,
    borderRadius:      14,
    borderWidth:       1,
    alignSelf:         "stretch",
    justifyContent:    "center",
  },
  homeBtnText: {},
});
