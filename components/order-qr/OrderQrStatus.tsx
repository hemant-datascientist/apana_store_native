// ============================================================
// ORDER QR STATUS — Apana Store
//
// Horizontal timeline showing where the order currently stands.
// Completed steps: filled circle with checkmark.
// Active step: mode-coloured circle with pulsing opacity animation.
// Pending steps: empty outlined circle.
// ============================================================

import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { QrStatusStep } from "../../data/orderQrData";

interface OrderQrStatusProps {
  steps:      QrStatusStep[];
  activeStep: number;    // index of the current step
  modeColor:  string;
}

export default function OrderQrStatus({ steps, activeStep, modeColor }: OrderQrStatusProps) {
  const { colors } = useTheme();

  // ── Pulse animation on the active step dot ────────────────
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.25, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.cardTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
        Order Status
      </Text>

      <View style={styles.timeline}>
        {steps.map((step, idx) => {
          const isDone   = idx < activeStep;
          const isActive = idx === activeStep;
          const isPending = idx > activeStep;

          return (
            <React.Fragment key={step.key}>
              {/* Step node */}
              <View style={styles.stepNode}>

                {/* Circle */}
                {isActive ? (
                  // Active: solid mode-color circle with pulse
                  <Animated.View style={[styles.circle, styles.activeCircle, { backgroundColor: modeColor, opacity: pulse }]}>
                    <Ionicons name={step.icon as any} size={12} color="#fff" />
                  </Animated.View>
                ) : isDone ? (
                  // Done: green filled circle
                  <View style={[styles.circle, { backgroundColor: "#22C55E" }]}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                ) : (
                  // Pending: outlined circle
                  <View style={[styles.circle, styles.pendingCircle, { borderColor: colors.border }]}>
                    <Ionicons name={step.icon as any} size={11} color={colors.subText} />
                  </View>
                )}

                {/* Step label */}
                <Text
                  numberOfLines={2}
                  style={[styles.stepLabel, {
                    color:      isActive ? modeColor : isDone ? "#22C55E" : colors.subText,
                    fontFamily: isActive ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                    fontSize:   typography.size.ss,
                  }]}
                >
                  {step.label}
                </Text>
              </View>

              {/* Connector line (skip after last step) */}
              {idx < steps.length - 1 && (
                <View style={[
                  styles.connector,
                  { backgroundColor: isDone ? "#22C55E" : colors.border },
                ]} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth:  1,
    padding:      14,
    gap:          14,
  },
  cardTitle: { textTransform: "uppercase", letterSpacing: 0.8 },

  timeline: {
    flexDirection: "row",
    alignItems:    "flex-start",
  },

  // Step node (circle + label stacked)
  stepNode: {
    alignItems: "center",
    gap:        6,
    width:      64,
  },

  circle: {
    width:          30,
    height:         30,
    borderRadius:   15,
    alignItems:     "center",
    justifyContent: "center",
  },
  activeCircle:  { },
  pendingCircle: {
    backgroundColor: "transparent",
    borderWidth:     1.5,
  },

  stepLabel: {
    textAlign:  "center",
    lineHeight: 14,
  },

  // Connecting horizontal line
  connector: {
    flex:      1,
    height:    1.5,
    marginTop: 14,   // align with circle center
  },
});
