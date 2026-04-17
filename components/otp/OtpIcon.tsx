// ============================================================
// OTP ICON — Apana Store (OTP Component)
//
// Rounded icon circle shown at the top of the OTP screen.
// Icon switches between phone and mail based on method.
//
// Props:
//   method — "phone" | "email"
// ============================================================

import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme     from "../../theme/useTheme";

interface OtpIconProps {
  method: string;
}

export default function OtpIcon({ method }: OtpIconProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.primary + "18" }]}>
      <Ionicons
        name={method === "phone" ? "phone-portrait-outline" : "mail-outline"}
        size={36}
        color={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width:          76,
    height:         76,
    borderRadius:   22,
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   4,
  },
});
