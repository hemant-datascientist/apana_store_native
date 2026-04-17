// ============================================================
// OTP CONTACT DISPLAY — Apana Store (OTP Component)
//
// Title + subtitle section on the OTP screen.
// Adapts copy based on flow (login vs register) and step.
//
// Props:
//   isRegister   — true for registration flow
//   step         — "phone" | "email" (register flow only)
//   name         — user's name (shown in register greeting)
//   display      — formatted contact string to show
// ============================================================

import React from "react";
import { Text, StyleSheet } from "react-native";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface OtpContactDisplayProps {
  isRegister: boolean;
  step:       "phone" | "email";
  name?:      string;
  display:    string;
}

export default function OtpContactDisplay({
  isRegister, step, name, display,
}: OtpContactDisplayProps) {
  const { colors } = useTheme();

  // ── Title copy ───────────────────────────────────────────────
  const title =
    isRegister && step === "phone" ? "Verify Your Mobile"        :
    isRegister && step === "email" ? "Now Verify Your Email"     :
                                     "Enter Verification Code";

  return (
    <>
      {/* ── Title ── */}
      <Text style={[styles.title, {
        color:      colors.text,
        fontFamily: typography.fontFamily.bold,
        fontSize:   typography.size.xl,
      }]}>
        {title}
      </Text>

      {/* ── Subtitle — contextual copy per scenario ── */}
      {isRegister && step === "phone" && name ? (
        // Register step 1 — personalised greeting with user's name
        <Text style={[styles.sub, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.xs + 1,
        }]}>
          Hi{" "}
          <Text style={{ fontFamily: typography.fontFamily.semiBold, color: colors.text }}>
            {name}
          </Text>
          ! We sent a 6-digit OTP to
        </Text>
      ) : isRegister && step === "email" ? (
        // Register step 2 — phone verified confirmation
        <Text style={[styles.sub, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.xs + 1,
        }]}>
          Mobile verified ✓  Now enter the OTP sent to
        </Text>
      ) : (
        // Login flow — simple copy
        <Text style={[styles.sub, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.xs + 1,
        }]}>
          We sent a 6-digit OTP to
        </Text>
      )}

      {/* ── Contact value — phone/email bold ── */}
      <Text style={[styles.contact, {
        color:      colors.text,
        fontFamily: typography.fontFamily.semiBold,
        fontSize:   typography.size.sm + 1,
      }]}>
        {display}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign:    "center",
    marginBottom: 2,
  },
  sub: {
    textAlign: "center",
  },
  contact: {
    marginBottom: 4,
  },
});
