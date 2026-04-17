// ============================================================
// HELP SEARCH BAR — Apana Store (Help Component)
//
// Search input that filters FAQ questions in real time.
// Shown at the top of the Help & Support screen.
//
// Props:
//   value    — current query
//   onChange — (text) called on every keystroke
//   onClear  — clears the search
// ============================================================

import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface HelpSearchBarProps {
  value:    string;
  onChange: (text: string) => void;
  onClear:  () => void;
}

export default function HelpSearchBar({ value, onChange, onClear }: HelpSearchBarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, {
      backgroundColor: colors.card,
      borderColor:     colors.border,
    }]}>
      <Ionicons name="search-outline" size={18} color={colors.subText} />

      <TextInput
        style={[styles.input, {
          color:      colors.text,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.sm,
        }]}
        placeholder="Search FAQs..."
        placeholderTextColor={colors.subText}
        value={value}
        onChangeText={onChange}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />

      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={18} color={colors.subText} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    borderWidth:       1.5,
    borderRadius:      14,
    paddingHorizontal: 14,
    paddingVertical:   2,
  },
  input: {
    flex:            1,
    paddingVertical: 13,
  },
});
