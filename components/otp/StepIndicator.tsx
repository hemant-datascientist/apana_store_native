// ============================================================
// STEP INDICATOR — Apana Store (OTP Component)
//
// Two-step progress bar shown during registration OTP flow.
//   Step 1 — Verify Mobile  (phone icon)
//   Step 2 — Verify Email   (mail icon)
//
// States per circle:
//   Done    → green background + checkmark
//   Active  → primary background + number
//   Pending → border background + number
//
// Props:
//   step          — current active step: "phone" | "email"
//   phoneVerified — true after phone OTP is confirmed
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface StepIndicatorProps {
  step:          "phone" | "email";
  phoneVerified: boolean;
}

export default function StepIndicator({ step, phoneVerified }: StepIndicatorProps) {
  const { colors } = useTheme();

  // ── Step 1 visual state ──────────────────────────────────────
  const step1Done   = phoneVerified;
  const step1Active = !phoneVerified && step === "phone";

  // ── Step 2 visual state ──────────────────────────────────────
  const step2Active = step === "email";

  // ── Circle background resolver ──────────────────────────────
  function circleBg(done: boolean, active: boolean) {
    if (done)   return colors.success;
    if (active) return colors.primary;
    return colors.border;
  }

  return (
    <View style={styles.row}>
      {/* ── Step 1: Mobile ── */}
      <View style={styles.stepWrap}>
        <View style={[styles.circle, { backgroundColor: circleBg(step1Done, step1Active) }]}>
          {step1Done
            ? <Ionicons name="checkmark" size={14} color={colors.white} />
            : <Text style={[styles.num, { color: colors.white, fontFamily: typography.fontFamily.bold }]}>1</Text>
          }
        </View>
        <Text style={[styles.label, {
          color:      step1Active ? colors.text : colors.subText,
          fontFamily: step1Active ? typography.fontFamily.semiBold : typography.fontFamily.regular,
          fontSize:   typography.size.xs,
        }]}>
          Mobile
        </Text>
      </View>

      {/* ── Connector line — green when step 1 is done ── */}
      <View style={[styles.line, { backgroundColor: colors.border }]}>
        {step1Done && (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.success }]} />
        )}
      </View>

      {/* ── Step 2: Email ── */}
      <View style={styles.stepWrap}>
        <View style={[styles.circle, { backgroundColor: circleBg(false, step2Active) }]}>
          <Text style={[styles.num, { color: colors.white, fontFamily: typography.fontFamily.bold }]}>
            2
          </Text>
        </View>
        <Text style={[styles.label, {
          color:      step2Active ? colors.text : colors.subText,
          fontFamily: step2Active ? typography.fontFamily.semiBold : typography.fontFamily.regular,
          fontSize:   typography.size.xs,
        }]}>
          Email
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  "row",
    alignItems:     "center",
    alignSelf:      "stretch",
    marginBottom:   8,
  },
  stepWrap: {
    alignItems: "center",
    gap:         4,
  },
  circle: {
    width:          30,
    height:         30,
    borderRadius:   15,
    alignItems:     "center",
    justifyContent: "center",
  },
  num:   { fontSize: 13 },
  label: { marginTop: 2 },
  line: {
    flex:             1,
    height:           2,
    marginHorizontal: 6,
    marginBottom:     14,
    overflow:         "hidden",
  },
});
