// ============================================================
// SEARCH RESULTS HEADER — Apana Store
//
// Sticky top bar for the search results screen:
//   [←]  [🔍 <editable query>  ✕]
//   "X results for 'query'"
//
// The search input is auto-focused on mount so the user can
// immediately refine their query.
// ============================================================

import React, { useRef, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface SearchResultsHeaderProps {
  query:         string;
  onChangeQuery: (q: string) => void;
  onBack:        () => void;
  resultCount:   number;
}

export default function SearchResultsHeader({
  query, onChangeQuery, onBack, resultCount,
}: SearchResultsHeaderProps) {
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);

  // Auto-focus the input on mount so the user can type immediately
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={[styles.wrap, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>

      {/* ── Search row ── */}
      <View style={styles.row}>

        {/* Back */}
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.background }]}
          onPress={onBack}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        {/* Input pill */}
        <View style={[styles.pill, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={17} color={colors.subText} />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={onChangeQuery}
            returnKeyType="search"
            style={[styles.input, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}
            placeholderTextColor={colors.subText}
            placeholder="Search products & stores…"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => onChangeQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={17} color={colors.subText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Result count ── */}
      {query.trim().length > 0 && (
        <Text style={[styles.count, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {resultCount} result{resultCount !== 1 ? "s" : ""} for{" "}
          <Text style={[styles.queryBold, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
            "{query.trim()}"
          </Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: 1,
    paddingBottom:     10,
    gap:               6,
  },
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 12,
    paddingTop:        10,
    gap:               10,
  },
  iconBtn: {
    width:          38,
    height:         38,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  pill: {
    flex:              1,
    flexDirection:     "row",
    alignItems:        "center",
    borderRadius:      12,
    borderWidth:       1,
    paddingHorizontal: 12,
    paddingVertical:    9,
    gap:               8,
  },
  input: {
    flex:    1,
    padding: 0,
  },
  count: {
    paddingHorizontal: 16,
  },
  queryBold: {},
});
