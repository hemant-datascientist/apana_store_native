// ============================================================
// HANDSHAKE RATING — Apana Store
//
// "Rate your experience" card. 5 tappable stars + optional
// quick-tag chips + submit button.
// Submitted state: shows a thank-you confirmation instead.
// ============================================================

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface HandshakeRatingProps {
  agentName:  string;
  agentRole:  string;
  modeColor:  string;
}

// Quick-tag chips that appear once a star is tapped
const TAGS_POSITIVE = ["Fast handover", "Very polite", "Professional", "Well packaged"];
const TAGS_NEGATIVE = ["Slow", "Rude behaviour", "Damaged item", "Wrong order"];

export default function HandshakeRating({ agentName, agentRole, modeColor }: HandshakeRatingProps) {
  const { colors } = useTheme();

  const [stars,     setStars]     = useState(0);
  const [tags,      setTags]      = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function handleStar(val: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStars(val);
    setTags([]);
  }

  function toggleTag(tag: string) {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  function handleSubmit() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
  }

  // ── Thank-you state ──────────────────────────────────────
  if (submitted) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.thankRow}>
          <Ionicons name="heart-circle" size={30} color={modeColor} />
          <View style={styles.thankText}>
            <Text style={[styles.thankTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              Thanks for your feedback!
            </Text>
            <Text style={[styles.thankSub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              Your rating helps improve the Apana experience.
            </Text>
          </View>
        </View>
        {/* Show chosen stars read-only */}
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map(i => (
            <Ionicons key={i} name={i <= stars ? "star" : "star-outline"} size={22} color="#F59E0B" />
          ))}
        </View>
      </View>
    );
  }

  const chips = stars >= 4 ? TAGS_POSITIVE : stars > 0 ? TAGS_NEGATIVE : [];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Header ── */}
      <View style={styles.titleRow}>
        <Ionicons name="star-half-outline" size={15} color={modeColor} />
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          Rate Your Experience
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.body}>
        {/* Prompt */}
        <Text style={[styles.prompt, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          How was your experience with {agentName} ({agentRole})?
        </Text>

        {/* Star row */}
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map(i => (
            <TouchableOpacity key={i} onPress={() => handleStar(i)} activeOpacity={0.75}>
              <Ionicons
                name={i <= stars ? "star" : "star-outline"}
                size={32}
                color={i <= stars ? "#F59E0B" : colors.border}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Star label */}
        {stars > 0 && (
          <Text style={[styles.starLabel, { color: modeColor, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            {["", "Poor", "Below Average", "Average", "Good", "Excellent"][stars]}
          </Text>
        )}

        {/* Quick tags */}
        {chips.length > 0 && (
          <View style={styles.chips}>
            {chips.map(tag => {
              const active = tags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.chip,
                    {
                      borderColor:     active ? modeColor : colors.border,
                      backgroundColor: active ? modeColor + "15" : colors.background,
                    },
                  ]}
                  onPress={() => toggleTag(tag)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.chipText, {
                    color:      active ? modeColor : colors.subText,
                    fontFamily: active ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                    fontSize:   typography.size.xs,
                  }]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Submit button */}
        {stars > 0 && (
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: modeColor }]}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={[styles.submitText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              Submit Rating
            </Text>
          </TouchableOpacity>
        )}

        {/* Skip */}
        {stars === 0 && (
          <Text style={[styles.skip, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            Tap a star to rate
          </Text>
        )}
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
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  sectionTitle: {},
  divider:      { height: 1 },
  body: {
    padding: 16,
    gap:     14,
    alignItems: "center",
  },
  prompt: { textAlign: "center" },
  starRow: {
    flexDirection: "row",
    gap:           6,
  },
  starLabel: {},
  chips: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           8,
    justifyContent:"center",
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      20,
    borderWidth:       1,
  },
  chipText:   {},
  submitBtn: {
    alignSelf:         "stretch",
    alignItems:        "center",
    paddingVertical:   13,
    borderRadius:      12,
  },
  submitText:  { color: "#fff" },
  skip:        { textAlign: "center" },

  // Thank-you state
  thankRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    padding:           16,
  },
  thankText:  { flex: 1, gap: 3 },
  thankTitle: {},
  thankSub:   { lineHeight: 18 },
});
