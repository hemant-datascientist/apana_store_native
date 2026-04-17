// ============================================================
// VERIFICATION INFO CARD — Apana Store (Auth Component)
//
// Shown on Create Account screen.
// Explains the two-step OTP flow:
//   ① Verify Mobile  →  ② Verify Email
//
// Uses colors.primary for step circles, connector line, labels.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export default function VerificationInfoCard() {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, {
      backgroundColor: colors.primary + "10",
      borderColor:     colors.primary + "35",
    }]}>

      {/* ── Step circles + connector ── */}
      <View style={styles.stepRow}>
        <View style={[styles.stepCircle, { backgroundColor: colors.primary }]}>
          <Text style={[styles.stepNum, { fontFamily: typography.fontFamily.bold, color: colors.white }]}>
            1
          </Text>
        </View>

        {/* Connector line */}
        <View style={[styles.connector, { backgroundColor: colors.primary, opacity: 0.3 }]} />

        <View style={[styles.stepCircle, { backgroundColor: colors.primary }]}>
          <Text style={[styles.stepNum, { fontFamily: typography.fontFamily.bold, color: colors.white }]}>
            2
          </Text>
        </View>
      </View>

      {/* ── Step labels ── */}
      <View style={styles.labelRow}>
        {/* Step 1 label */}
        <View style={styles.label}>
          <Ionicons name="phone-portrait-outline" size={13} color={colors.primary} />
          <Text style={[styles.labelText, {
            color:      colors.primary,
            fontFamily: typography.fontFamily.medium,
            fontSize:   typography.size.xs,
          }]}>
            Verify Mobile
          </Text>
        </View>

        {/* Step 2 label */}
        <View style={styles.label}>
          <Ionicons name="mail-outline" size={13} color={colors.primary} />
          <Text style={[styles.labelText, {
            color:      colors.primary,
            fontFamily: typography.fontFamily.medium,
            fontSize:   typography.size.xs,
          }]}>
            Verify Email
          </Text>
        </View>
      </View>

      {/* ── Hint ── */}
      <Text style={[styles.hint, {
        color:      colors.primary,
        fontFamily: typography.fontFamily.regular,
        fontSize:   typography.size.xs - 1,
        opacity:    0.8,
      }]}>
        Both your mobile number and email will be verified by OTP
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth:  1,
    padding:      14,
    gap:          8,
  },

  // ── Step row ──────────────────────────────────────────────────
  stepRow: {
    flexDirection: "row",
    alignItems:    "center",
  },
  stepCircle: {
    width:          24,
    height:         24,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  stepNum: { fontSize: 12 },
  connector: {
    flex:             1,
    height:           2,
    marginHorizontal: 4,
  },

  // ── Labels ────────────────────────────────────────────────────
  labelRow: {
    flexDirection:  "row",
    justifyContent: "space-between",
  },
  label: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           4,
  },
  labelText: {},
  hint:      { lineHeight: 16 },
});
