// ============================================================
// WEIGHT PICKER — choose how much of a loose item to buy.
//
// A packaged line is a count ("2 packets"); a loose line is an AMOUNT the shop
// weighs out. The picker only ever offers amounts the counter can actually
// serve — at or above `min_measure`, and on the shop's own `step_measure` — so
// the customer cannot build a 175 g order that checkout would refuse after they
// have entered an address.
//
// The running total is computed with the SAME formula the server charges with
// (lib/measure), so the number here is the number on the bill.
// ============================================================

import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import {
  formatMeasure, formatRate, measureLineTotalCents, measurePresets, type MeasureKind,
} from "../../../lib/measure";

interface Props {
  visible: boolean;
  name: string;
  measureKind: MeasureKind;
  pricePerMeasureCents: number | null;
  minMeasure: number | null;
  stepMeasure: number | null;
  stock: number;
  unit: string | null;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

export default function WeightPicker({
  visible, name, measureKind, pricePerMeasureCents,
  minMeasure, stepMeasure, stock, unit, onClose, onConfirm,
}: Props) {
  const { colors } = useTheme();

  const step = Math.max(1, stepMeasure ?? 1);
  const min = Math.max(step, minMeasure ?? step);
  const [amount, setAmount] = useState(min);

  // Re-seed at the minimum each time the sheet opens: the previous item's
  // amount is meaningless for this one (500 g of atta ≠ 500 of anything else).
  React.useEffect(() => { if (visible) setAmount(min); }, [visible, min]);

  const presets = measurePresets(measureKind, { min, step, max: stock });
  const total = measureLineTotalCents(measureKind, amount, pricePerMeasureCents);
  const atCeiling = amount + step > stock;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.background }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.grabber} />

          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{name}</Text>
          <Text style={[styles.rate, { color: colors.subText }]}>
            {formatRate(measureKind, pricePerMeasureCents, unit)} · {formatMeasure(measureKind, stock, unit)} available
          </Text>

          {/* One-tap amounts — only those the shop can serve. */}
          {presets.length > 0 && (
            <View style={styles.presets}>
              {presets.map((p) => {
                const active = p === amount;
                return (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setAmount(p)}
                    style={[
                      styles.preset,
                      { borderColor: active ? colors.primary : colors.border,
                        backgroundColor: active ? colors.primary + "14" : colors.card },
                    ]}
                  >
                    <Text style={[styles.presetText, { color: active ? colors.primary : colors.text }]}>
                      {formatMeasure(measureKind, p, unit)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Fine adjust, in the shop's own increment. */}
          <View style={[styles.stepper, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <TouchableOpacity
              onPress={() => setAmount((a) => Math.max(min, a - step))}
              disabled={amount <= min}
              style={styles.stepBtn}
              hitSlop={8}
            >
              <Ionicons name="remove" size={20} color={amount <= min ? colors.subText : colors.text} />
            </TouchableOpacity>

            <View style={styles.amountBox}>
              <Text style={[styles.amount, { color: colors.text }]}>
                {formatMeasure(measureKind, amount, unit)}
              </Text>
              <Text style={[styles.stepHint, { color: colors.subText }]}>
                steps of {formatMeasure(measureKind, step, unit)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setAmount((a) => Math.min(stock, a + step))}
              disabled={atCeiling}
              style={styles.stepBtn}
              hitSlop={8}
            >
              <Ionicons name="add" size={20} color={atCeiling ? colors.subText : colors.text} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.cta, { backgroundColor: colors.primary }]}
            onPress={() => onConfirm(amount)}
            activeOpacity={0.85}
          >
            <Text style={[styles.ctaText, { color: colors.white }]}>
              Add {formatMeasure(measureKind, amount, unit)} · ₹{(total / 100).toFixed(2)}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "#00000066", justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  grabber: {
    alignSelf: "center", width: 40, height: 4, borderRadius: 2,
    backgroundColor: "#00000022", marginBottom: 14,
  },
  name: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg },
  rate: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs, marginTop: 2 },
  presets: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
  preset: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  presetText: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm },
  stepper: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderWidth: 1, borderRadius: 14, paddingHorizontal: 8, paddingVertical: 10, marginTop: 16,
  },
  stepBtn: { paddingHorizontal: 14, paddingVertical: 6 },
  amountBox: { alignItems: "center" },
  amount: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg },
  stepHint: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss, marginTop: 1 },
  cta: { borderRadius: 14, paddingVertical: 15, alignItems: "center", marginTop: 18 },
  ctaText: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md },
});
