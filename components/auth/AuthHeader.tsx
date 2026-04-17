// ============================================================
// AUTH HEADER — Apana Store (Shared Auth Component)
//
// Dark blue header used across all auth screens:
//   login, otp, create-account, edit-profile
//
// Props:
//   title      — centre label ("Sign In", "Verify OTP", etc.)
//   onBack     — left back-arrow press handler
//   rightSlot  — optional right side element (e.g. Save button)
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import useTheme         from "../../theme/useTheme";
import { typography }   from "../../theme/typography";

interface AuthHeaderProps {
  title:      string;
  onBack:     () => void;
  rightSlot?: React.ReactNode;   // optional right-side element
}

export default function AuthHeader({ title, onBack, rightSlot }: AuthHeaderProps) {
  const { colors } = useTheme();

  return (
    // SafeAreaView handles status-bar padding on iOS notch devices
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.primary }]}
      edges={["top"]}
    >
      {/* ── Back button ── */}
      <TouchableOpacity style={styles.btn} onPress={onBack} activeOpacity={0.75}>
        <Ionicons name="arrow-back" size={22} color={colors.white} />
      </TouchableOpacity>

      {/* ── Screen title ── */}
      <Text style={[styles.title, {
        color:      colors.white,
        fontFamily: typography.fontFamily.semiBold,
        fontSize:   typography.size.lg,
      }]}>
        {title}
      </Text>

      {/* ── Right slot (optional) or spacer ── */}
      <View style={styles.btn}>
        {rightSlot ?? null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 8,
    paddingBottom:     14,
  },
  btn: {
    width:          48,
    height:         44,
    alignItems:     "center",
    justifyContent: "center",
  },
  title: {
    flex:      1,
    textAlign: "center",
  },
});
