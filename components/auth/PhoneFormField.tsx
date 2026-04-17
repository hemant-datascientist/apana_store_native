// ============================================================
// PHONE FORM FIELD — Apana Store (Auth Component)
//
// Phone number input with +91 country prefix for the
// Create Account screen.
//
// Props:
//   value     — current 10-digit phone value
//   onChange  — (text) called on change
//   error?    — error message (shown if truthy)
//   inputRef? — forward ref for programmatic focus
//   onSubmit? — called on keyboard "done"
// ============================================================

import React, { RefObject } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface PhoneFormFieldProps {
  value:    string;
  onChange: (text: string) => void;
  error?:   string;
  inputRef?: RefObject<TextInput | null>;
  onSubmit?: () => void;
}

export default function PhoneFormField({ value, onChange, error, inputRef, onSubmit }: PhoneFormFieldProps) {
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
        Mobile Number
      </Text>

      {/* ── Phone row ── */}
      <View style={[styles.row, {
        borderColor: hasError ? colors.danger : colors.border,
        backgroundColor: colors.card,
      }]}>
        {/* +91 prefix */}
        <View style={[styles.prefix, {
          borderRightColor: colors.border,
          backgroundColor:  colors.background,
        }]}>
          <Text style={styles.flag}>🇮🇳</Text>
          <Text style={[styles.prefixText, {
            color:      colors.text,
            fontFamily: typography.fontFamily.semiBold,
            fontSize:   typography.size.sm,
          }]}>
            +91
          </Text>
        </View>

        {/* Phone number input */}
        <TextInput
          ref={inputRef as RefObject<TextInput>}
          style={[styles.input, {
            color:      colors.text,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.md - 1,
          }]}
          placeholder="Enter mobile number"
          placeholderTextColor={colors.subText}
          keyboardType="phone-pad"
          maxLength={10}
          value={value}
          onChangeText={onChange}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
          letterSpacing={0.5}
        />

        {/* Clear button */}
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChange("")} style={styles.clearBtn} activeOpacity={0.7}>
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
    flexDirection: "row",
    alignItems:    "center",
    borderWidth:   1.5,
    borderRadius:  14,
    overflow:      "hidden",
  },
  prefix: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    paddingHorizontal: 12,
    paddingVertical:   15,
    borderRightWidth:  1,
  },
  flag:       { fontSize: 16 },
  prefixText: {},
  input: {
    flex:              1,
    paddingHorizontal: 12,
    paddingVertical:   15,
  },
  clearBtn: { paddingRight: 12 },
  error:    { marginTop: 2 },
});
