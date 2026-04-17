// ============================================================
// INPUT HINT — Apana Store (Auth Component)
//
// Small helper text below the phone/email input on login.
// Changes copy based on the active OTP method.
//
// Props:
//   method — "phone" | "email"
// ============================================================

import React from "react";
import { Text, StyleSheet } from "react-native";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface InputHintProps {
  method: "phone" | "email";
}

export default function InputHint({ method }: InputHintProps) {
  const { colors } = useTheme();

  return (
    <Text style={[styles.hint, {
      color:      colors.subText,
      fontFamily: typography.fontFamily.regular,
      fontSize:   typography.size.xs,
    }]}>
      {method === "phone"
        ? "We'll send a 6-digit OTP to this number"
        : "We'll send a 6-digit OTP to this email"
      }
    </Text>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: -6,
  },
});
