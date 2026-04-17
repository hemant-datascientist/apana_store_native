// ============================================================
// STORE PRODUCT SEARCH — Apana Store (Store Detail Component)
//
// Search bar scoped to the current store's products.
// Sits above the Product Categories section.
//
// Props:
//   value    — current query string
//   onChange — called on every keystroke
//   onClear  — clears the field
//   onSubmit — called when user presses search / return key
// ============================================================

import React from "react";
import {
  View, TextInput, TouchableOpacity, StyleSheet,
} from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface StoreProductSearchProps {
  value:    string;
  onChange: (text: string) => void;
  onClear:  () => void;
  onSubmit: () => void;
}

export default function StoreProductSearch({
  value, onChange, onClear, onSubmit,
}: StoreProductSearchProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, {
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
        placeholder="Search products in this store..."
        placeholderTextColor={colors.subText}
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
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
  wrap: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    borderWidth:       1.5,
    borderRadius:      14,
    paddingHorizontal: 14,
    paddingVertical:   2,
    marginHorizontal:  16,
  },
  input: {
    flex:            1,
    paddingVertical: 13,
  },
});
