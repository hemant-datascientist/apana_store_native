// ============================================================
// ADD PAYMENT BUTTON — Apana Store (Payment Component)
//
// Dashed outlined button to add a new payment method.
// Renders full-width below the saved methods card.
//
// Props:
//   onPress — called when button is tapped
// ============================================================

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface AddPaymentButtonProps {
  onPress: () => void;
}

export default function AddPaymentButton({ onPress }: AddPaymentButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.btn, {
        backgroundColor: colors.primary + "08",
        borderColor:     colors.primary + "50",
      }]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
      <Text style={[styles.label, {
        color:      colors.primary,
        fontFamily: typography.fontFamily.semiBold,
        fontSize:   typography.size.sm,
      }]}>
        Add Payment Method
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             8,
    paddingVertical: 16,
    borderRadius:    14,
    borderWidth:     1.5,
    borderStyle:     "dashed",
  },
  label: {},
});
