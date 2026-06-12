// ============================================================
// PASSENGER STEPPER — Apana Store (Auto Riders)
//
// "Passengers  −  N  +" row. Driving input for the smart capacity
// gating: bumping past a class's capacity disables that class
// everywhere (chips, cards, map list). 1..MAX_PASSENGERS.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { MAX_PASSENGERS } from "../../data/ridersData";

interface PassengerStepperProps {
  value:    number;
  onChange: (next: number) => void;
}

export default function PassengerStepper({ value, onChange }: PassengerStepperProps) {
  const { colors } = useTheme();
  const canDec = value > 1;
  const canInc = value < MAX_PASSENGERS;

  return (
    <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.labelWrap}>
        <Ionicons name="people-outline" size={17} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
          Passengers
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => canDec && onChange(value - 1)}
          disabled={!canDec}
          accessibilityRole="button"
          accessibilityLabel="Fewer passengers"
          style={[styles.btn, {
            backgroundColor: canDec ? colors.primary : colors.border,
          }]}
        >
          <Ionicons name="remove" size={16} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.count, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
          {value}
        </Text>

        <TouchableOpacity
          onPress={() => canInc && onChange(value + 1)}
          disabled={!canInc}
          accessibilityRole="button"
          accessibilityLabel="More passengers"
          style={[styles.btn, {
            backgroundColor: canInc ? colors.primary : colors.border,
          }]}
        >
          <Ionicons name="add" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:    "row",
    alignItems:       "center",
    justifyContent:   "space-between",
    marginHorizontal: 16,
    marginTop:        12,
    paddingHorizontal: 14,
    paddingVertical:    10,
    borderRadius:      14,
    borderWidth:        1,
  },
  labelWrap: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
  },
  label: {
    fontSize: typography.size.sm,
  },
  controls: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           14,
  },
  btn: {
    width:          28,
    height:         28,
    borderRadius:   14,
    alignItems:     "center",
    justifyContent: "center",
  },
  count: {
    fontSize:  typography.size.md,
    minWidth:  20,
    textAlign: "center",
  },
});
