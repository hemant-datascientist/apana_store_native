// ============================================================
// FORM FIELD — Apana Store (Auth Component)
//
// Reusable labelled input row used on the Create Account screen
// for Name and Email fields.
//
// Props:
//   label          — field label above the input
//   icon           — Ionicons glyph for the left icon
//   value          — current text value
//   onChange       — (text) called on change
//   placeholder    — placeholder string
//   error?         — error message (shown if truthy)
//   keyboardType?  — defaults to "default"
//   autoCapitalize?— defaults to "sentences"
//   returnKeyType? — defaults to "next"
//   onSubmit?      — called on submit/return
//   inputRef?      — forward ref for programmatic focus
//   autoFocus?     — auto-focus on mount
// ============================================================

import React, { RefObject } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface FormFieldProps {
  label:          string;
  icon:           string;
  value:          string;
  onChange:       (text: string) => void;
  placeholder:    string;
  error?:         string;
  keyboardType?:  "default" | "email-address" | "phone-pad";
  autoCapitalize?:"none" | "sentences" | "words" | "characters";
  autoCorrect?:   boolean;
  returnKeyType?: "next" | "done" | "go";
  onSubmit?:      () => void;
  inputRef?:      RefObject<TextInput | null>;
  autoFocus?:     boolean;
}

export default function FormField({
  label, icon, value, onChange, placeholder, error,
  keyboardType    = "default",
  autoCapitalize  = "sentences",
  autoCorrect     = true,
  returnKeyType   = "next",
  onSubmit,
  inputRef,
  autoFocus,
}: FormFieldProps) {
  const { colors } = useTheme();

  const hasError = Boolean(error);

  return (
    <View style={styles.block}>
      {/* ── Label ── */}
      <Text style={[styles.label, {
        color:      colors.text,
        fontFamily: typography.fontFamily.medium,
        fontSize:   typography.size.xs + 1,
      }]}>
        {label}
      </Text>

      {/* ── Input row ── */}
      <View style={[styles.row, {
        borderColor:     hasError ? colors.danger : colors.border,
        backgroundColor: colors.card,
      }]}>
        <Ionicons name={icon as any} size={18} color={colors.subText} />

        <TextInput
          ref={inputRef as RefObject<TextInput>}
          style={[styles.input, {
            color:      colors.text,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.md - 1,
          }]}
          placeholder={placeholder}
          placeholderTextColor={colors.subText}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmit}
          autoFocus={autoFocus}
        />

        {/* ── Clear button ── */}
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChange("")} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={16} color={colors.subText} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Error text ── */}
      {hasError && (
        <Text style={[styles.error, {
          color:      colors.danger,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.xs - 1,
        }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 6 },
  label: {},
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    borderWidth:       1.5,
    borderRadius:      14,
    paddingHorizontal: 14,
  },
  input: {
    flex:            1,
    paddingVertical: 15,
  },
  error: { marginTop: 2 },
});
