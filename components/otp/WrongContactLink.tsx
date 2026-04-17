// ============================================================
// WRONG CONTACT LINK — Apana Store (OTP Component)
//
// "Wrong number? Change it" / "Wrong email? Change it" link
// shown at the bottom of the OTP screen.
// Navigates back to login / create-account to correct the input.
//
// Props:
//   method  — "phone" | "email" (affects the copy)
//   onPress — router.back()
// ============================================================

import React from "react";
import { Text, TouchableOpacity } from "react-native";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface WrongContactLinkProps {
  method:  string;
  onPress: () => void;
}

export default function WrongContactLink({ method, onPress }: WrongContactLinkProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <Text style={[{
        color:      colors.subText,
        fontFamily: typography.fontFamily.regular,
        fontSize:   typography.size.xs + 1,
        marginTop:  8,
      }]}>
        {/* ── Prompt text ── */}
        Wrong {method === "phone" ? "number" : "email"}?{" "}

        {/* ── Tappable link accent ── */}
        <Text style={{
          fontFamily: typography.fontFamily.semiBold,
          color:      colors.primary,
        }}>
          Change it
        </Text>
      </Text>
    </TouchableOpacity>
  );
}
