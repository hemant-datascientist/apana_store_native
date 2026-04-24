// ============================================================
// RATE US SCREEN — Apana Store
//
// Lets customers rate the app and leave quick feedback.
//
// Layout (before submission):
//   Header          — amber/gold header + back
//   Emoji mood      — changes with star count (😞→😐→🙂→😊→🤩)
//   RateStars       — interactive 5-star row with bounce animation
//   Sentiment label — "Tap a star to rate" / "Poor" / … / "Excellent"
//   RateTagChips    — multi-select quick-feedback chips
//   Feedback input  — optional freeform comment
//   Submit button   — disabled until at least 1 star selected
//
// Layout (after submission):
//   RateThankYou    — emoji + message + Play Store CTA
// ============================================================

import React, { useState } from "react";
import {
  View, Text, ScrollView, TextInput,
  TouchableOpacity, StyleSheet, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

import RateStars    from "../../components/rate/RateStars";
import RateTagChips from "../../components/rate/RateTagChips";
import RateThankYou from "../../components/rate/RateThankYou";

const ACCENT = "#F59E0B";

// ── Emoji + label per star count ─────────────────────────
const RATING_LABEL: Record<number, { emoji: string; label: string; color: string }> = {
  0: { emoji: "🌟", label: "Tap a star to rate",  color: "#9CA3AF" },
  1: { emoji: "😞", label: "Poor",                color: "#EF4444" },
  2: { emoji: "😐", label: "Fair",                color: "#F97316" },
  3: { emoji: "🙂", label: "Good",                color: "#EAB308" },
  4: { emoji: "😊", label: "Very Good",           color: "#22C55E" },
  5: { emoji: "🤩", label: "Excellent!",          color: "#0F4C81" },
};

export default function RateUsScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();

  // ── Rating state ──────────────────────────────────────────
  const [rating,    setRating]    = useState(0);
  const [tags,      setTags]      = useState<string[]>([]);
  const [feedback,  setFeedback]  = useState("");
  const [submitted, setSubmitted] = useState(false);

  const meta = RATING_LABEL[rating];

  function toggleTag(key: string) {
    setTags(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );
  }

  // ── Submit rating ─────────────────────────────────────────
  // Backend: POST /user/rating { rating, tags, feedback }
  function handleSubmit() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={ACCENT} />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: ACCENT }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
            Rate Us
          </Text>
          <View style={[styles.iconBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Ionicons name="star-outline" size={18} color="#fff" />
          </View>
        </View>
      </SafeAreaView>

      {submitted ? (
        // ── Thank you state ───────────────────────────────────
        <ScrollView contentContainerStyle={styles.thankyouScroll}>
          <RateThankYou rating={rating} />
        </ScrollView>
      ) : (
        // ── Rating form ───────────────────────────────────────
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

            {/* ── Emoji mood indicator ── */}
            <View style={styles.emojiBlock}>
              <Text style={styles.moodEmoji}>{meta.emoji}</Text>
              <Text style={[styles.moodLabel, {
                color:      meta.color,
                fontFamily: rating > 0 ? typography.fontFamily.bold : typography.fontFamily.regular,
                fontSize:   typography.size.md,
              }]}>
                {meta.label}
              </Text>
            </View>

            {/* ── Stars ── */}
            <RateStars rating={rating} onChange={setRating} />

            {/* ── Tag chips (only after a star is selected) ── */}
            {rating > 0 && (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <RateTagChips rating={rating} selected={tags} onToggle={toggleTag} />
              </View>
            )}

            {/* ── Freeform feedback ── */}
            {rating > 0 && (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.feedbackHeader}>
                  <Ionicons name="chatbubble-ellipses-outline" size={16} color={ACCENT} />
                  <Text style={[styles.feedbackTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                    Tell us more
                  </Text>
                  <Text style={[styles.optional, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                    (optional)
                  </Text>
                </View>
                <TextInput
                  style={[styles.feedbackInput, {
                    color:           colors.text,
                    borderColor:     colors.border,
                    backgroundColor: colors.background,
                    fontFamily:      typography.fontFamily.regular,
                    fontSize:        typography.size.sm,
                  }]}
                  placeholder={rating >= 4
                    ? "What did you enjoy most?"
                    : "What should we fix or improve?"
                  }
                  placeholderTextColor={colors.subText}
                  value={feedback}
                  onChangeText={setFeedback}
                  multiline
                  maxLength={300}
                  textAlignVertical="top"
                />
                <Text style={[styles.charCount, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
                  {feedback.length}/300
                </Text>
              </View>
            )}

            {/* Trust note */}
            <View style={styles.trustRow}>
              <Ionicons name="shield-checkmark-outline" size={14} color={colors.subText} />
              <Text style={[styles.trustText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                Your feedback is private and helps us improve
              </Text>
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* ── Sticky submit CTA ── */}
          <SafeAreaView
            style={[styles.ctaBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}
            edges={["bottom"]}
          >
            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: rating > 0 ? ACCENT : colors.border },
              ]}
              onPress={handleSubmit}
              disabled={rating === 0}
              activeOpacity={0.85}
            >
              <Ionicons name="star" size={17} color="#fff" />
              <Text style={[styles.submitText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
                {rating === 0 ? "Select a rating first" : `Submit ${rating}-Star Rating`}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {},
  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 16,
    paddingVertical:   12,
    gap:               12,
  },
  backBtn: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems:      "center",
    justifyContent:  "center",
  },
  headerTitle: { flex: 1, color: "#fff" },
  iconBtn: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },

  // Scrolls
  scroll:        { padding: 20, gap: 20 },
  thankyouScroll: { flexGrow: 1, justifyContent: "center", padding: 20 },

  // Emoji mood block
  emojiBlock: {
    alignItems: "center",
    gap:        8,
  },
  moodEmoji: { fontSize: 72 },
  moodLabel: {},

  // Cards wrapping chips + feedback
  card: {
    borderRadius: 16,
    borderWidth:  1,
    padding:      16,
    gap:          12,
  },

  feedbackHeader: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
  },
  feedbackTitle: {},
  optional:      {},

  feedbackInput: {
    borderWidth:  1,
    borderRadius: 10,
    padding:      12,
    minHeight:    90,
  },
  charCount: { textAlign: "right" },

  trustRow: {
    flexDirection: "row",
    alignItems:    "center",
    justifyContent:"center",
    gap:           6,
  },
  trustText: {},

  // CTA bar
  ctaBar: {
    position:          "absolute",
    bottom:            0,
    left:              0,
    right:             0,
    borderTopWidth:    1,
    paddingHorizontal: 16,
    paddingTop:        12,
  },
  submitBtn: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            8,
    paddingVertical: 14,
    borderRadius:   14,
  },
  submitText: { color: "#fff" },
});
