// ============================================================
// EMAIL INPUT — Apana Store (Auth Component)
//
// Email address input with leading mail icon and clear button.
// Used on login and create-account screens.
//
// Props:
//   value      — current text value
//   onChange   — text change callback
//   inputRef   — forwarded ref for programmatic focus
//   onSubmit   — called when keyboard "Done" is pressed
//   autoFocus  — whether to focus on mount
// ============================================================

import React, { RefObject } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface EmailInputProps {
  value:      string;
  onChange:   (v: string) => void;
  inputRef?:  RefObject<TextInput | null>;
  onSubmit?:  () => void;
  autoFocus?: boolean;
}

export default function EmailInput({
  value, onChange, inputRef, onSubmit, autoFocus,
}: EmailInputProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, {
      borderColor:     colors.border,
      backgroundColor: colors.background,
    }]}>
      {/* ── Leading mail icon ── */}
      <Ionicons
        name="mail-outline"
        size={20}
        color={colors.subText}
        style={styles.icon}
      />

      {/* ── Email text input ── */}
      <TextInput
        ref={inputRef}
        style={[styles.input, {
          color:      colors.text,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.md,
        }]}
        placeholder="Enter email address"
        placeholderTextColor={colors.subText}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChange}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
      />

      {/* ── Clear button — shown only when there is text ── */}
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange("")} style={styles.clearBtn}>
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
    borderWidth:       1.5,
    borderRadius:      14,
    paddingHorizontal: 14,
  },
  icon:  { marginRight: 8 },
  input: {
    flex:            1,
    paddingVertical: 16,
  },
  clearBtn: { padding: 8 },
});
