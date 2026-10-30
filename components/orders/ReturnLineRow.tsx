// One line of a delivered order on the Return screen: how many to send back.
// A loose line (sold by weight/volume) comes back whole or not at all — the
// server refuses a part-weight, so the control is a toggle, not a stepper.

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { ReturnLine } from "../../services/returnService";

interface Props {
  line: ReturnLine;
  qty: number;
  onChange: (qty: number) => void;
}

export default function ReturnLineRow({ line, qty, onChange }: Props) {
  const { colors } = useTheme();
  const loose = line.measure_kind !== "count";
  const label = { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: colors.text };
  const sub = { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs, color: colors.subText };
  const btn = (icon: "remove" | "add", next: number, disabled: boolean) => (
    <TouchableOpacity
      onPress={() => onChange(next)} disabled={disabled} hitSlop={8}
      style={[styles.step, { borderColor: colors.border, opacity: disabled ? 0.4 : 1 }]}
    >
      <Ionicons name={icon} size={16} color={colors.text} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.row, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <View style={styles.info}>
        <Text style={label} numberOfLines={2}>{line.name}</Text>
        <Text style={sub}>{loose ? "Sold by weight — returns whole" : `Bought ${line.qty}`}</Text>
      </View>
      {loose ? (
        <TouchableOpacity onPress={() => onChange(qty ? 0 : line.qty)} hitSlop={8}>
          <Ionicons name={qty ? "checkbox" : "square-outline"} size={24} color={colors.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.stepper}>
          {btn("remove", qty - 1, qty === 0)}
          <Text style={[label, styles.qty]}>{qty}</Text>
          {btn("add", qty + 1, qty >= line.qty)}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderWidth: 1, borderRadius: 12 },
  info: { flex: 1, gap: 2 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 10 },
  step: { width: 30, height: 30, borderRadius: 8, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  qty: { minWidth: 18, textAlign: "center" },
});
