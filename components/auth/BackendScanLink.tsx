// ============================================================
// SCAN THE BACKEND QR — from the SIGN-IN screen.
//
// 🔴 THE CHICKEN AND EGG THIS FIXES. "Connect to backend" lived only in
// Profile, which is behind sign-in — and signing in is the first thing that
// needs a reachable backend. A fresh install pointed at an old or rotated
// tunnel could neither sign in nor reach the screen that fixes it. Same fix
// the seller app already has (apana_seller_native/components/auth/BackendScanLink.tsx).
//
// ⚠ NOT gated on an environment flag: the phone that needs this most is a real
// phone during a trial, on whatever build it has.
//
// ⚠ Quiet until it matters: a plain link normally; a card with the address it
// tried only once a send has actually failed to reach the server.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { effectiveOrigin } from "../../lib/backendOverride";

interface BackendScanLinkProps {
  /**
   * Did the last attempt fail WITHOUT reaching the server? A wrong number or a
   * rate limit comes FROM the server — pointing at the backend address for
   * those is advice that cannot help.
   */
  unreachable?: boolean;
}

export default function BackendScanLink({ unreachable = false }: BackendScanLinkProps) {
  const { colors } = useTheme();

  // `from=login` so closing the scanner comes back HERE, not to the tabs a
  // signed-out person cannot open.
  const open = () => router.push({ pathname: "/connect", params: { from: "login" } });

  if (!unreachable) {
    return (
      <TouchableOpacity onPress={open} style={styles.quietRow} hitSlop={8}>
        <Ionicons name="qr-code-outline" size={14} color={colors.subText} />
        <Text style={[styles.quietText, { color: colors.subText }]}>
          Can&apos;t connect? Scan backend QR
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>
        The app could not reach the server
      </Text>
      {/* The address is shown — seeing which one was tried is what makes a
          wrong or expired tunnel obvious. */}
      <Text style={[styles.cardBody, { color: colors.subText }]} numberOfLines={2}>
        It tried {effectiveOrigin() || "the built-in address"}. If your backend
        moved, scan its QR to point the app at the new one.
      </Text>
      <TouchableOpacity onPress={open} style={[styles.cardBtn, { backgroundColor: colors.primary }]}>
        <Ionicons name="qr-code" size={16} color={colors.white} />
        <Text style={[styles.cardBtnText, { color: colors.white }]}>Scan backend QR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  quietRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10,
  },
  quietText: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs },
  card: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 8 },
  cardTitle: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm },
  cardBody: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs, lineHeight: 18 },
  cardBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, borderRadius: 10, paddingVertical: 12, marginTop: 4,
  },
  cardBtnText: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm },
});
