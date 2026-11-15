// ============================================================
// KindChips — "All · Alphonso 3 · Kesar 1" above a family's products (0192).
//
// Only kinds that have live products nearby (the server's facet), so a chip
// never leads to an empty grid. Hidden when the family has no listed kinds.
// Theme + typography tokens only.
// ============================================================

import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { ApcKindFacet } from "../../services/liveCatalogService";

interface Props {
  kinds: ApcKindFacet[];
  selected: string | null;
  onSelect: (code: string | null) => void;
}

export default function KindChips({ kinds, selected, onSelect }: Props) {
  const { colors } = useTheme();
  if (kinds.length === 0) return null;
  const chip = (code: string | null, label: string) => {
    const on = selected === code;
    return (
      <TouchableOpacity
        key={code ?? "all"}
        onPress={() => onSelect(code)}
        activeOpacity={0.75}
        style={[styles.chip, { borderColor: on ? colors.primary : colors.border, backgroundColor: on ? colors.primary : colors.card }]}
      >
        <Text style={[styles.text, { color: on ? colors.white : colors.text }]}>{label}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row} contentContainerStyle={styles.content}>
      {chip(null, "All kinds")}
      {kinds.map((k) => chip(k.code, `${k.name} · ${k.count}`))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexGrow: 0, marginBottom: 10 },
  content: { gap: 8, paddingRight: 8 },
  chip: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  text: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs },
});
