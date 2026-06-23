// ============================================================
// MAP PRODUCT PICKER — Apana Store (Map View · Find Products)
//
// Dropdown of product matches while typing in Find Products mode. Picking one
// narrows the map to the stores that stock it (parent handles the filtering).
// Renders nothing when there are no results.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { MapProduct } from "../../data/mapProductData";

interface MapProductPickerProps {
  results:  MapProduct[];
  onSelect: (p: MapProduct) => void;
}

export default function MapProductPicker({ results, onSelect }: MapProductPickerProps) {
  const { colors } = useTheme();
  if (results.length === 0) return null;

  return (
    <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 240 }}>
        {results.map((p, i) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.row, i < results.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
            onPress={() => onSelect(p)}
            activeOpacity={0.8}
          >
            <View style={[styles.thumb, { backgroundColor: p.iconBg }]}>
              <Ionicons name={p.icon as any} size={18} color="#0F4C81" />
            </View>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
                {p.name}
              </Text>
              <Text numberOfLines={1} style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {[p.brand, p.variant].filter(Boolean).join(" · ")} · in {p.availableStoreIds.length} store{p.availableStoreIds.length === 1 ? "" : "s"}
              </Text>
            </View>
            <Ionicons name="locate-outline" size={16} color={colors.primary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { marginHorizontal: 14, marginTop: 4, borderRadius: 12, borderWidth: 1, overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 10, elevation: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 10 },
  thumb: { width: 36, height: 36, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  name: {},
  sub: { marginTop: 2 },
});
