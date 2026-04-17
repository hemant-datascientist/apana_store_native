// ============================================================
// TIMER RESEND — Apana Store (OTP Component)
//
// Shows countdown timer while OTP is valid.
// When timer reaches 0, replaces itself with "Resend OTP" link.
//
// Props:
//   timer     — seconds remaining (0 = expired)
//   resending — true while resend API call is in-flight
//   onResend  — called when user taps "Resend OTP"
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface TimerResendProps {
  timer:     number;
  resending: boolean;
  onResend:  () => void;
}

export default function TimerResend({ timer, resending, onResend }: TimerResendProps) {
  const { colors } = useTheme();

  // ── MM:SS format ─────────────────────────────────────────────
  const mm = String(Math.floor(timer / 60)).padStart(2, "0");
  const ss = String(timer % 60).padStart(2, "0");

  const canResend = timer === 0;

  return (
    <View style={styles.row}>
      {canResend ? (
        // ── Resend link — shown after timer expires ──
        <TouchableOpacity onPress={onResend} disabled={resending} activeOpacity={0.8}>
          {resending ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={[styles.resend, {
              color:      colors.primary,
              fontFamily: typography.fontFamily.semiBold,
              fontSize:   typography.size.sm,
            }]}>
              Resend OTP
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        // ── Countdown text ──
        <Text style={[styles.timer, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.xs + 1,
        }]}>
          Resend OTP in{" "}
          <Text style={{
            fontFamily: typography.fontFamily.semiBold,
            color:      colors.primary,
          }}>
            {mm}:{ss}
          </Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height:         28,
    alignItems:     "center",
    justifyContent: "center",
    marginTop:      4,
  },
  resend: {},
  timer:  {},
});
