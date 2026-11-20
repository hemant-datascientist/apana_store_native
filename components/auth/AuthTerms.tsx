// ============================================================
// AUTH TERMS — Apana Store (Shared Auth Component)
//
// "By signing in / creating an account, you agree to our
//  Terms of Service and Privacy Policy" text.
//
// Used on: login, create-account
//
// Props:
//   action — "signing in" | "creating an account" (default: "signing in")
// ============================================================

import React from "react";
import { Text, StyleSheet } from "react-native";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { openLegal, PRIVACY_URL, TERMS_URL } from "../../lib/legalLinks";

interface AuthTermsProps {
  action?: "signing in" | "creating an account";
}

export default function AuthTerms({ action = "signing in" }: AuthTermsProps) {
  const { colors } = useTheme();

  return (
    <Text style={[styles.text, {
      color:      colors.subText,
      fontFamily: typography.fontFamily.regular,
      fontSize:   typography.size.xs,
    }]}>
      {/* Contextual action prefix */}
      By {action}, you agree to our{" "}

      {/* Terms link */}
      <Text style={[styles.link, { color: colors.primary }]} onPress={TERMS_URL ? () => openLegal(TERMS_URL) : undefined}>
        Terms of Service
      </Text>

      {" "}and{" "}

      {/* Privacy link */}
      <Text style={[styles.link, { color: colors.primary }]} onPress={PRIVACY_URL ? () => openLegal(PRIVACY_URL) : undefined}>
        Privacy Policy
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign:  "center",
    lineHeight: 18,
  },
  link: {},
});
