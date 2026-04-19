// ============================================================
// SHARE ITEMS BUTTON — Apana Store
//
// Reusable outlined button that triggers sharing the shopping
// list items as a plain-text message via the OS share sheet.
//
// The actual Share.share() call must happen in the parent
// screen (not inside a Modal) to avoid Android's native-window
// restriction. This component fires onPress() and the parent
// handles the API call.
// ============================================================

import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface ShareItemsButtonProps {
  onPress: () => void;
  style?:  ViewStyle;
}

export default function ShareItemsButton({ onPress, style }: ShareItemsButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.btn, { borderColor: colors.border, backgroundColor: colors.background }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="list-outline" size={18} color={colors.text} />
      <Text style={[styles.label, {
        color:      colors.text,
        fontFamily: typography.fontFamily.semiBold,
        fontSize:   typography.size.sm,
      }]}>
        Share Items as Text
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               8,
    alignSelf:         "stretch",
    paddingVertical:   13,
    borderRadius:      14,
    borderWidth:       1,
  },
  label: {},
});
