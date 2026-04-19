// ============================================================
// BRANDS SEARCH BAR — Apana Store
//
// Prominent search input with search icon on the left and a
// clear (×) button that appears when there is typed text.
// ============================================================

import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface BrandsSearchBarProps {
  value:    string;
  onChange: (text: string) => void;
}

export default function BrandsSearchBar({ value, onChange }: BrandsSearchBarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.bar, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name="search-outline" size={18} color={colors.subText} />

      <TextInput
        style={[styles.input, {
          color:      colors.text,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.sm,
        }]}
        placeholder="Search brands…"
        placeholderTextColor={colors.subText}
        value={value}
        onChangeText={onChange}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close-circle" size={18} color={colors.subText} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    paddingHorizontal: 14,
    paddingVertical:   12,
    borderRadius:      14,
    borderWidth:       1,
    marginHorizontal:  16,
  },
  input: { flex: 1 },
});
