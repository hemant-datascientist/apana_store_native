// ============================================================
// ApcFamilyRail — left vertical sub-category rail (customer app).
//
// Blinkit-style rail: "All" + each family that has live products in the class
// (from the BE facet — honest-empty, no phantom rails). Tapping one filters the
// grid. The selected item shows an accent bar + tint. Theme tokens only.
// ============================================================

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { ApcFamilyFacet } from "../../services/liveCatalogService";

interface Props {
  families: ApcFamilyFacet[];
  totalCount: number;                 // count for the "All" pill
  selected: string | null;           // family code, or null = All
  onSelect: (familyCode: string | null) => void;
}

export default function ApcFamilyRail({ families, totalCount, selected, onSelect }: Props) {
  const { colors } = useTheme();

  const Item = ({ code, label, count }: { code: string | null; label: string; count: number }) => {
    const active = selected === code;
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => onSelect(code)} style={styles.item}>
        <View style={[styles.bar, { backgroundColor: active ? colors.primary : "transparent" }]} />
        <View style={[styles.pill, { backgroundColor: active ? colors.primary + "14" : "transparent" }]}>
          <Text
            numberOfLines={2}
            style={[
              styles.label,
              {
                color: active ? colors.primary : colors.text,
                fontFamily: active ? typography.fontFamily.bold : typography.fontFamily.medium,
              },
            ]}
          >
            {label}
          </Text>
          <Text style={[styles.count, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>{count}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.rail, { backgroundColor: colors.card, borderRightColor: colors.border }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Item code={null} label="All" count={totalCount} />
        {families.map((f) => (
          <Item key={f.code ?? "_none"} code={f.code} label={f.name ?? "More"} count={f.count} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { width: 92, borderRightWidth: StyleSheet.hairlineWidth },
  scroll: { paddingVertical: 8 },
  item: { flexDirection: "row", alignItems: "stretch", minHeight: 68 },
  bar: { width: 3, borderTopRightRadius: 3, borderBottomRightRadius: 3 },
  pill: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, alignItems: "center", gap: 3 },
  label: { fontSize: typography.size.xs, textAlign: "center", lineHeight: 15 },
  count: { fontSize: typography.size.ss },
});
