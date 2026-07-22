// ============================================================
// VARIANT PICKER — one chip row per axis (Size, Color…).
//
// Values that the shop stocks but has run out of stay visible and disabled,
// struck through. Hiding them would suggest the shop never carried that size;
// showing them enabled would let the customer pick a dead end.
//
// Selection logic lives in lib/variantSelect.ts — this file only draws it.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import { buildAxes } from "../../../lib/variantSelect";
import type { ProductVariant } from "../../../services/liveCatalogService";

interface VariantPickerProps {
  variants: ProductVariant[];
  selection: Record<string, string>;
  onSelect: (axisKey: string, value: string) => void;
}

export default function VariantPicker({ variants, selection, onSelect }: VariantPickerProps) {
  const { colors } = useTheme();
  if (variants.length === 0) return null;

  const axes = buildAxes(variants, selection);

  return (
    <View style={styles.wrap}>
      {axes.map((axis) => (
        <View key={axis.key} style={styles.axis}>
          <Text style={[styles.label, {
            color: colors.subText,
            fontFamily: typography.fontFamily.semiBold,
          }]}>
            {axis.label}
          </Text>

          <View style={styles.chips}>
            {axis.options.map((opt) => {
              const active = selection[axis.key] === opt.value;
              // Not stocked in this combination at all → not a choice.
              // Stocked but sold out → shown, disabled, struck through.
              const selectable = opt.exists && opt.inStock;

              return (
                <TouchableOpacity
                  key={opt.value}
                  disabled={!selectable}
                  onPress={() => onSelect(axis.key, opt.value)}
                  activeOpacity={0.8}
                  style={[styles.chip, {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                    opacity: selectable ? 1 : 0.45,
                  }]}
                >
                  <Text
                    style={[styles.chipText, {
                      color: active ? colors.white : colors.text,
                      fontFamily: typography.fontFamily.medium,
                      textDecorationLine: opt.exists && !opt.inStock ? "line-through" : "none",
                    }]}
                  >
                    {opt.value}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 4, gap: 12 },
  axis: { gap: 7 },
  label: { fontSize: typography.size.xs, letterSpacing: 0.3, textTransform: "uppercase" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 46,
    alignItems: "center",
  },
  chipText: { fontSize: typography.size.sm },
});
