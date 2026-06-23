// ============================================================
// MAP SEARCH BAR — Apana Store (Map View)
//
// In-map search for store name or what they sell (matches store tags).
// Reused by the inline map feed and the fullscreen map. Pure presentational;
// the filtering lives in the parent so inline + fullscreen stay in sync.
// ============================================================

import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../../../theme/useTheme";
import { typography } from "../../../../theme/typography";

interface MapSearchBarProps {
  value:        string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  autoFocus?:   boolean;
}

export default function MapSearchBar({ value, onChangeText, placeholder, autoFocus }: MapSearchBarProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <Ionicons name="search-outline" size={16} color={colors.subText} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? "Search store or product"}
        placeholderTextColor={colors.subText}
        autoFocus={autoFocus}
        returnKeyType="search"
        style={[styles.input, { color: colors.text, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close-circle" size={16} color={colors.subText} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex:              1,
    flexDirection:     "row",
    alignItems:        "center",
    gap:               8,
    borderWidth:       1,
    borderRadius:      12,
    paddingHorizontal: 12,
    height:            42,
  },
  input: { flex: 1, padding: 0 },
});
