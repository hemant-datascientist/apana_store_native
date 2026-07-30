// ============================================================
// ApcFamilyRail — left vertical sub-category rail (customer app).
//
// Blinkit-style rail: "All" + each family that has live products in the class
// (from the BE facet — honest-empty, no phantom rails). Each shows a thumbnail
// (the family's tile art when it has one, else an icon) + name + count. Tapping
// filters the grid; the selected item gets an accent bar + tint. Theme tokens.
// ============================================================

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { ApcFamilyFacet } from "../../services/liveCatalogService";

interface Props {
  families: ApcFamilyFacet[];
  totalCount: number;                 // count for the "All" pill
  selected: string | null;           // family code, or null = All
  onSelect: (familyCode: string | null) => void;
  images?: Record<string, string | null>; // family code → resolved tile art
}

export default function ApcFamilyRail({ families, totalCount, selected, onSelect, images }: Props) {
  const { colors } = useTheme();

  const Item = ({ code, label, count, icon }: { code: string | null; label: string; count: number; icon?: string }) => {
    const active = selected === code;
    const img = code ? images?.[code] : null;
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => onSelect(code)} style={styles.item}>
        <View style={[styles.bar, { backgroundColor: active ? colors.primary : "transparent" }]} />
        <View style={styles.pill}>
          <View style={[styles.thumb, { backgroundColor: active ? colors.primary + "14" : colors.background, borderColor: active ? colors.primary : colors.border }]}>
            {img ? (
              <Image source={{ uri: img }} style={styles.thumbImg} resizeMode="contain" />
            ) : (
              <Ionicons name={(icon ?? "pricetag-outline") as keyof typeof Ionicons.glyphMap} size={20} color={active ? colors.primary : colors.subText} />
            )}
          </View>
          <Text
            numberOfLines={2}
            style={[
              styles.label,
              { color: active ? colors.primary : colors.text, fontFamily: active ? typography.fontFamily.bold : typography.fontFamily.medium },
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
        <Item code={null} label="All" count={totalCount} icon="grid-outline" />
        {families.map((f) => (
          <Item key={f.code ?? "_none"} code={f.code} label={f.name ?? "More"} count={f.count} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { width: 96, borderRightWidth: StyleSheet.hairlineWidth },
  scroll: { paddingVertical: 8 },
  item: { flexDirection: "row", alignItems: "stretch", minHeight: 92 },
  bar: { width: 3, borderTopRightRadius: 3, borderBottomRightRadius: 3 },
  pill: { flex: 1, paddingVertical: 10, paddingHorizontal: 6, alignItems: "center", gap: 5 },
  thumb: { width: 46, height: 46, borderRadius: 23, borderWidth: 1, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  thumbImg: { width: "82%", height: "82%" },
  label: { fontSize: typography.size.xs, textAlign: "center", lineHeight: 14 },
  count: { fontSize: typography.size.ss },
});
