// ============================================================
// PRODUCT VARIANTS — Apana Store
//
// Renders chip-style selectors for each variant group.
// e.g. Weight: [500g] [1kg] [2kg]  |  Color: [Black] [White]
// Out-of-stock variants are greyed out and struck through.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { ProductVariantGroup, ProductVariantOption } from "../../data/productDetailData";

interface ProductVariantsProps {
  groups:          ProductVariantGroup[];
  selectedIds:     Record<string, string>;   // { "Weight": "v1b", "Color": "v2a" }
  onSelect:        (groupType: string, optionId: string) => void;
}

export default function ProductVariants({ groups, selectedIds, onSelect }: ProductVariantsProps) {
  const { colors } = useTheme();

  if (groups.length === 0) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {groups.map((group, gi) => {
        const selectedId = selectedIds[group.type];
        const selected   = group.options.find(o => o.id === selectedId);

        return (
          <View key={group.type} style={[gi > 0 && styles.groupGap]}>

            {/* ── Group label + selected value ── */}
            <View style={styles.labelRow}>
              <Text style={[styles.groupLabel, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
                {group.type}:
              </Text>
              {selected && (
                <Text style={[styles.selectedLabel, { color: colors.primary, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
                  {selected.label}
                </Text>
              )}
            </View>

            {/* ── Chip row ── */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {group.options.map(option => {
                const isSelected = option.id === selectedId;
                const isOOS      = !option.inStock;

                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.chip,
                      {
                        borderColor: isSelected
                          ? colors.primary
                          : isOOS ? colors.border : colors.border,
                        backgroundColor: isSelected
                          ? colors.primary + "15"
                          : isOOS ? colors.background : colors.background,
                      },
                    ]}
                    onPress={() => !isOOS && onSelect(group.type, option.id)}
                    activeOpacity={isOOS ? 1 : 0.75}
                  >
                    <Text style={[styles.chipText, {
                      color: isSelected
                        ? colors.primary
                        : isOOS ? colors.border : colors.text,
                      fontFamily: isSelected
                        ? typography.fontFamily.semiBold
                        : typography.fontFamily.regular,
                      fontSize:      typography.size.sm,
                      textDecorationLine: isOOS ? "line-through" : "none",
                    }]}>
                      {option.label}
                    </Text>
                    {/* Price delta if different from base ── */}
                    {option.price > 0 && !isSelected && (
                      <Text style={[styles.chipPrice, {
                        color:      isOOS ? colors.border : colors.subText,
                        fontFamily: typography.fontFamily.regular,
                        fontSize:   typography.size.ss,
                      }]}>
                        ₹{option.price}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {gi < groups.length - 1 && (
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth:  1,
    padding:      16,
    gap:          12,
  },
  groupGap: { marginTop: 4 },
  labelRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
    marginBottom:  8,
  },
  groupLabel:    {},
  selectedLabel: {},
  chips: {
    flexDirection: "row",
    gap:           8,
    paddingBottom: 2,
  },
  chip: {
    borderWidth:       1.5,
    borderRadius:      10,
    paddingHorizontal: 14,
    paddingVertical:   8,
    alignItems:        "center",
    gap:               2,
  },
  chipText:  {},
  chipPrice: {},
  divider:   { height: 1, marginTop: 8 },
});
