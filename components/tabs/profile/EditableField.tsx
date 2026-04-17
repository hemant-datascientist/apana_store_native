// ============================================================
// EDITABLE FIELD — Apana Store (Profile Component)
//
// Label + icon + TextInput + optional clear button + error text.
// Used for Name and Email fields on the Edit Profile screen.
//
// Props:
//   label          — field label
//   icon           — Ionicons glyph for left icon
//   value          — current value
//   onChange       — (text) called on change
//   error?         — error string (shown below input if set)
//   placeholder?   — placeholder text
//   keyboardType?  — defaults to "default"
//   autoCapitalize?— defaults to "sentences"
//   autoCorrect?   — defaults to true
//   returnKeyType? — "next" | "done"
//   onSubmit?      — called on keyboard submit
// ============================================================

import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

interface EditableFieldProps {
  label:          string;
  icon:           string;
  value:          string;
  onChange:       (text: string) => void;
  error?:         string;
  placeholder?:   string;
  keyboardType?:  "default" | "email-address";
  autoCapitalize?:"none" | "sentences" | "words";
  autoCorrect?:   boolean;
  returnKeyType?: "next" | "done";
  onSubmit?:      () => void;
}

export default function EditableField({
  label, icon, value, onChange, error, placeholder,
  keyboardType    = "default",
  autoCapitalize  = "sentences",
  autoCorrect     = true,
  returnKeyType   = "next",
  onSubmit,
}: EditableFieldProps) {
  const { colors } = useTheme();

  const hasError = Boolean(error);

  return (
    <View style={styles.block}>
      {/* ── Label ── */}
      <Text style={[styles.label, {
        color:      colors.subText,
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
        <Ionicons name={icon as any} size={18} color={colors.subText} style={styles.icon} />

        <TextInput
          style={[styles.input, {
            color:      colors.text,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.md - 1,
          }]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.subText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmit}
        />

        {/* Clear button */}
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChange("")} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={16} color={colors.subText} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Error ── */}
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
    borderWidth:       1.5,
    borderRadius:      12,
    paddingHorizontal: 12,
    paddingVertical:   4,
    gap:               8,
  },
  icon:  {},
  input: {
    flex:            1,
    paddingVertical: 12,
  },
  error: { marginTop: 2 },
});
