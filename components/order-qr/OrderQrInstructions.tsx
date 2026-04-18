// ============================================================
// ORDER QR INSTRUCTIONS — Apana Store
//
// Numbered step-by-step guide for the customer explaining
// exactly what they need to do with their QR code.
// Each mode (pickup / delivery / ride) has different steps.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface OrderQrInstructionsProps {
  instructions: string[];
  modeColor:    string;
  modeIcon:     string;    // Ionicons glyph for the mode
}

export default function OrderQrInstructions({ instructions, modeColor, modeIcon }: OrderQrInstructionsProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* Section header */}
      <View style={styles.header}>
        <Ionicons name="information-circle-outline" size={16} color={modeColor} />
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          How It Works
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Numbered steps */}
      <View style={styles.steps}>
        {instructions.map((text, idx) => {
          const isLast = idx === instructions.length - 1;

          return (
            <View key={idx} style={styles.stepRow}>
              {/* Left: number circle + vertical connector */}
              <View style={styles.stepLeft}>
                <View style={[styles.numberCircle, { backgroundColor: modeColor }]}>
                  <Text style={[styles.number, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
                    {idx + 1}
                  </Text>
                </View>
                {/* Vertical line connecting steps (skip on last) */}
                {!isLast && (
                  <View style={[styles.vLine, { backgroundColor: modeColor + "30" }]} />
                )}
              </View>

              {/* Right: step text */}
              <Text style={[
                styles.stepText,
                {
                  color:      isLast ? modeColor : colors.text,
                  fontFamily: isLast ? typography.fontFamily.semiBold : typography.fontFamily.regular,
                  fontSize:   typography.size.sm,
                },
              ]}>
                {text}
                {isLast && (
                  <Text>  </Text>
                )}
                {isLast && (
                  <Ionicons name="checkmark-circle" size={14} color={modeColor} />
                )}
              </Text>
            </View>
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
    overflow:     "hidden",
  },

  header: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 14,
    paddingVertical:   12,
  },
  title: {},

  divider: { height: 1 },

  steps: {
    padding: 14,
    gap:     0,
  },

  stepRow: {
    flexDirection: "row",
    gap:           12,
    minHeight:     48,
  },

  // Left column: number + vertical line
  stepLeft: {
    alignItems:  "center",
    width:       28,
    paddingTop:  2,
  },
  numberCircle: {
    width:          26,
    height:         26,
    borderRadius:   13,
    alignItems:     "center",
    justifyContent: "center",
  },
  number: { color: "#fff" },

  vLine: {
    flex:      1,
    width:     2,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 1,
  },

  stepText: {
    flex:       1,
    lineHeight: 20,
    paddingTop: 3,
    paddingBottom: 8,
  },
});
