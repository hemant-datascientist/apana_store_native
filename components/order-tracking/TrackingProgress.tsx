// ============================================================
// TRACKING PROGRESS — Apana Store
//
// Vertical stepper showing all fulfillment status steps.
// Each step can be: done | active | pending.
// Active step pulses with a ring animation.
// ============================================================

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { TrackingStep } from "../../data/orderTrackingData";

interface TrackingProgressProps {
  steps:      TrackingStep[];
  activeStep: string;   // key of the currently active step
}

export default function TrackingProgress({ steps, activeStep }: TrackingProgressProps) {
  const { colors } = useTheme();

  // Find index of active step
  const activeIdx = steps.findIndex(s => s.key === activeStep);

  const pulse = useRef(new Animated.Value(1)).current;

  // Infinite pulse on the active step indicator
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.25, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {steps.map((step, idx) => {
        const isDone   = idx < activeIdx;
        const isActive = idx === activeIdx;
        const isPending= idx > activeIdx;

        const dotColor = isDone  ? "#22C55E"
                       : isActive ? colors.primary
                       : colors.border;

        const lineColor = isDone ? "#22C55E" : colors.border;

        return (
          <View key={step.key} style={styles.row}>
            {/* Left — dot + connector line */}
            <View style={styles.leftCol}>
              {/* Pulse ring — only for active */}
              {isActive && (
                <Animated.View
                  style={[
                    styles.pulseRing,
                    { borderColor: colors.primary, transform: [{ scale: pulse }] },
                  ]}
                />
              )}

              {/* Step dot */}
              <View style={[styles.dot, { backgroundColor: dotColor }]}>
                {isDone
                  ? <Ionicons name="checkmark" size={10} color="#fff" />
                  : <Ionicons name={step.icon as any} size={10} color={isActive ? "#fff" : colors.border} />
                }
              </View>

              {/* Connector line (not shown on last item) */}
              {idx < steps.length - 1 && (
                <View style={[styles.line, { backgroundColor: lineColor }]} />
              )}
            </View>

            {/* Right — labels */}
            <View style={styles.labelCol}>
              <Text style={[styles.stepLabel, {
                color:      isDone ? "#22C55E" : isActive ? colors.text : colors.subText,
                fontFamily: isActive ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                fontSize:   typography.size.sm,
              }]}>
                {step.label}
              </Text>
              <Text style={[styles.stepSub, {
                color:      colors.subText,
                fontFamily: typography.fontFamily.regular,
                fontSize:   typography.size.xs,
              }]}>
                {step.subLabel}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 0 },

  row: {
    flexDirection: "row",
    gap:           14,
    minHeight:     56,
  },

  leftCol: {
    alignItems: "center",
    width:      24,
  },

  // Active pulse ring
  pulseRing: {
    position:     "absolute",
    top:          0,
    width:        24,
    height:       24,
    borderRadius: 12,
    borderWidth:  2,
    zIndex:       0,
  },

  dot: {
    width:          24,
    height:         24,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    zIndex:         1,
  },

  line: {
    flex:  1,
    width: 2,
  },

  labelCol: {
    flex:          1,
    gap:           2,
    paddingTop:    2,
    paddingBottom: 16,
  },
  stepLabel: {},
  stepSub:   {},
});
