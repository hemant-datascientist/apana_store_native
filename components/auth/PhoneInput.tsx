// ============================================================
// PHONE INPUT — Apana Store (Auth Component)
//
// Mobile number input with 🇮🇳 +91 country code prefix.
// Used on login and create-account screens.
//
// Props:
//   value       — current text value (10-digit string)
//   onChange    — text change callback
//   inputRef    — forwarded ref for programmatic focus
//   onSubmit    — called when keyboard "Done" is pressed
// ============================================================

import React, { RefObject } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface PhoneInputProps {
  value:      string;
  onChange:   (v: string) => void;
  inputRef?:  RefObject<TextInput | null>;
  onSubmit?:  () => void;
  autoFocus?: boolean;
}

export default function PhoneInput({
  value, onChange, inputRef, onSubmit, autoFocus,
}: PhoneInputProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, {
      borderColor:     colors.border,
      backgroundColor: colors.background,
    }]}>
      {/* ── Country code prefix ── */}
      <View style={[styles.prefix, { borderRightColor: colors.border, backgroundColor: colors.card }]}>
        <Text style={styles.flag}>🇮🇳</Text>
        <Text style={[styles.code, {
          color:      colors.text,
          fontFamily: typography.fontFamily.semiBold,
          fontSize:   typography.size.sm,
        }]}>
          +91
        </Text>
      </View>

      {/* ── Phone number input ── */}
      <TextInput
        ref={inputRef}
        style={[styles.input, {
          color:      colors.text,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.md,
        }]}
        placeholder="Enter mobile number"
        placeholderTextColor={colors.subText}
        keyboardType="phone-pad"
        maxLength={10}
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
    flexDirection:  "row",
    alignItems:     "center",
    borderWidth:    1.5,
    borderRadius:   14,
    overflow:       "hidden",
  },

  // ── Prefix block ────────────────────────────────────────────
  prefix: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    paddingHorizontal: 14,
    paddingVertical:   16,
    borderRightWidth:  1,
  },
  flag: { fontSize: 18 },
  code: {},

  // ── Text input ──────────────────────────────────────────────
  input: {
    flex:              1,
    paddingHorizontal: 14,
    paddingVertical:   16,
    letterSpacing:     0.5,
  },

  // ── Clear icon ──────────────────────────────────────────────
  clearBtn: { padding: 8 },
});
