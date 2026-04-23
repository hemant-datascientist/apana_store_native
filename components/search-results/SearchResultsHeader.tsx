// ============================================================
// SEARCH RESULTS HEADER — Apana Store
//
// Top bar for the search results screen:
//   [←]  [🔍 <editable query>  ✕]
//
// Auto-focus behaviour:
//   • If the user arrives with a pre-filled query (came from the
//     home search bar), the input is NOT focused — they want to
//     read results, not type again.
//   • If the user lands here with an empty query, the input IS
//     focused so the keyboard opens and they can type right away.
// ============================================================

import React, { useRef, useEffect } from "react";
import {
  View, TextInput, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface SearchResultsHeaderProps {
  query:         string;
  onChangeQuery: (q: string) => void;
  onBack:        () => void;
}

export default function SearchResultsHeader({
  query, onChangeQuery, onBack,
}: SearchResultsHeaderProps) {
  const { colors } = useTheme();
  const inputRef   = useRef<TextInput>(null);

  // Focus the input only when arriving with a blank query.
  // Snapshot the initial query in a ref so we don't re-fire focus
  // when the user later clears it to edit.
  const initialBlankRef = useRef(query.trim().length === 0);
  useEffect(() => {
    if (!initialBlankRef.current) return;
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={[styles.wrap, { backgroundColor: colors.card }]}>

      {/* ── Search row ── */}
      <View style={styles.row}>

        {/* Back */}
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.background }]}
          onPress={onBack}
          activeOpacity={0.75}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
            autoCorrect={false}
            autoCapitalize="none"
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 10,
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
    paddingVertical:   9,
    gap:               8,
  },
  input: {
    flex:    1,
    padding: 0,
  },
});
