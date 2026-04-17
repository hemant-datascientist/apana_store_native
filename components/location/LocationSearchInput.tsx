// ============================================================
// LOCATION SEARCH INPUT — Apana Store (Location Component)
//
// Manual area/address search bar using Mappls Autosuggest.
// Shown below the GPS button as an alternative on the
// location-access screen.
//
// Props:
//   value    — current text value
//   onChange — (text) called on every keystroke
//   onClear  — clears the input
// ============================================================

import React, { RefObject } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface LocationSearchInputProps {
  value:      string;
  onChange:   (text: string) => void;
  onClear:    () => void;
  inputRef?:  RefObject<TextInput | null>;
}

export default function LocationSearchInput({
  value, onChange, onClear, inputRef,
}: LocationSearchInputProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, {
      backgroundColor: colors.card,
      borderColor:     colors.border,
    }]}>
      {/* ── Search icon ── */}
      <Ionicons name="search-outline" size={18} color={colors.subText} />

      {/* ── Text input ── */}
      <TextInput
        ref={inputRef as RefObject<TextInput>}
        style={[styles.input, {
          color:      colors.text,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.md - 1,
        }]}
        placeholder="Search your area, locality or city..."
        placeholderTextColor={colors.subText}
        value={value}
        onChangeText={onChange}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />

      {/* ── Clear button ── */}
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
    paddingVertical: 14,
  },
});
