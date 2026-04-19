// ============================================================
// PRODUCT SPECIFICATIONS — Apana Store
//
// Alternating-row table of label → value specifications.
// Collapsible after 6 rows to save screen space.
// ============================================================

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { ProductSpec } from "../../data/productDetailData";

interface ProductSpecificationsProps {
  specs: ProductSpec[];
}

const COLLAPSED_COUNT = 6;

export default function ProductSpecifications({ specs }: ProductSpecificationsProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  if (specs.length === 0) return null;

  const visible = expanded ? specs : specs.slice(0, COLLAPSED_COUNT);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Header ── */}
      <View style={styles.titleRow}>
        <Ionicons name="list-outline" size={16} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          Specifications
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Spec table ── */}
      {visible.map((spec, i) => (
        <View
          key={i}
          style={[
            styles.row,
            { backgroundColor: i % 2 === 0 ? colors.background : colors.card },
          ]}
        >
          <Text style={[styles.label, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
            {spec.label}
          </Text>
          <Text style={[styles.value, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
            {spec.value}
          </Text>
        </View>
      ))}

      {/* ── Expand/collapse toggle ── */}
      {specs.length > COLLAPSED_COUNT && (
        <TouchableOpacity
          style={[styles.toggleBtn, { borderTopColor: colors.border }]}
          onPress={() => setExpanded(e => !e)}
          activeOpacity={0.75}
        >
          <Text style={[styles.toggleText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            {expanded ? "Show less" : `Show all ${specs.length} specifications`}
          </Text>
          <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={14} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth:  1,
    overflow:     "hidden",
  },
  titleRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  title:   {},
  divider: { height: 1 },
  row: {
    flexDirection:     "row",
    paddingHorizontal: 16,
    paddingVertical:   11,
    gap:               12,
  },
  label: { flex: 1 },
  value: { flex: 1.5, textAlign: "right" },
  toggleBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             4,
    paddingVertical: 12,
    borderTopWidth:  1,
  },
  toggleText: {},
});
