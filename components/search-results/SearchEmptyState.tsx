// ============================================================
// SEARCH EMPTY STATE — Apana Store
//
// Shown in two situations:
//   1. query is blank         — "What are you looking for?"
//      Shows popular suggestion chips the user can tap.
//   2. query has no results   — "No results for '<query>'"
//      Shows a try-again hint and suggestion chips.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { POPULAR_SUGGESTIONS } from "../../data/searchResultsData";

interface SearchEmptyStateProps {
  query:        string;
  onSuggestion: (s: string) => void;
}

export default function SearchEmptyState({ query, onSuggestion }: SearchEmptyStateProps) {
  const { colors } = useTheme();
  const isBlank = query.trim().length === 0;

  return (
    <View style={styles.wrap}>

      {/* ── Icon ── */}
      <View style={[styles.iconWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons
          name={isBlank ? "search-outline" : "search-circle-outline"}
          size={48}
          color={colors.subText}
        />
      </View>

      {/* ── Title ── */}
      <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
        {isBlank ? "What are you looking for?" : `No results for "${query.trim()}"`}
      </Text>

      {/* ── Subtitle ── */}
      <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
        {isBlank
          ? "Search across products, stores, and categories."
          : "Try a shorter or different keyword, or browse popular searches below."}
      </Text>

      {/* ── Popular suggestions ── */}
      <Text style={[styles.sectionLabel, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
        POPULAR SEARCHES
      </Text>
      <View style={styles.chips}>
        {POPULAR_SUGGESTIONS.map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => onSuggestion(s)}
            activeOpacity={0.8}
          >
            <Ionicons name="trending-up-outline" size={12} color={colors.subText} />
            <Text style={[styles.chipText, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "flex-start",
    paddingTop:     40,
    paddingHorizontal: 24,
    gap:            14,
  },
  iconWrap: {
    width:          88,
    height:         88,
    borderRadius:   24,
    borderWidth:    1,
    alignItems:     "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
  },
  sub: {
    textAlign:  "center",
    lineHeight: 20,
  },
  sectionLabel: {
    letterSpacing: 0.8,
    marginTop:     4,
  },
  chips: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           8,
    justifyContent: "center",
  },
  chip: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    paddingHorizontal: 12,
    paddingVertical:   8,
    borderRadius:      20,
    borderWidth:       1,
  },
  chipText: {},
});
