// ============================================================
// AscCategorySection — one ASC store class: header (icon + name + the
// class's real tagline) and the original 2-column store-card grid.
//
// Cards keep the old Stores-mode look; a type shows its photo when one
// exists, else the class emoji.
// ============================================================

import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import AscStoreCard, { AscStoreItem } from "./AscStoreCard";
import { ascStoreImage } from "../../../data/ascStoreImages";
import type { AscBrowseGroup } from "../../../hooks/useAscBrowser";

const SCREEN_WIDTH = Dimensions.get("window").width;
const H_PADDING = 12;
const GAP = 10;
const CARD_WIDTH = Math.floor((SCREEN_WIDTH - H_PADDING * 2 - GAP) / 2);

// Soft tile backgrounds, rotated (ASC carries no colours of its own).
const TILE_COLORS = [
  "#DCFCE7", "#DBEAFE", "#FEF3C7", "#FCE7F3", "#EDE9FE",
  "#FFEDD5", "#FEE2E2", "#ECFDF5", "#E0F2FE", "#F3F4F6",
];

interface AscCategorySectionProps {
  group: AscBrowseGroup;
  accent: string;
  onPress: (code: string) => void;
}

function AscCategorySection({ group, accent, onPress }: AscCategorySectionProps) {
  const { colors } = useTheme();
  const { cls, types } = group;

  const items: AscStoreItem[] = types.map((t, i) => ({
    code: t.code,
    label: t.name,
    sub:
      t.short ??
      (t.subcategories.length > 0 ? t.subcategories.slice(0, 2).join(" · ") : cls.name),
    emoji: cls.icon,
    color: TILE_COLORS[i % TILE_COLORS.length],
    imageUrl: ascStoreImage(t.code),
  }));

  return (
    <View style={styles.section}>
      {/* Class header — name + the taxonomy's own tagline */}
      <View style={[styles.header, { borderLeftColor: accent }]}>
        <Text style={styles.icon}>{cls.icon}</Text>
        <View style={styles.headText}>
          <Text style={[styles.title, {
            color: colors.text,
            fontFamily: typography.fontFamily.bold,
            fontSize: typography.size.md,
          }]}>
            {cls.name}
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.tagline, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}
          >
            {cls.tagline}
          </Text>
        </View>
        <Text style={[styles.count, { color: accent, fontFamily: typography.fontFamily.bold }]}>
          {types.length}
        </Text>
      </View>

      <View style={styles.grid}>
        {items.map((it) => (
          <AscStoreCard key={it.code} item={it} width={CARD_WIDTH} onPress={onPress} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 10 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: H_PADDING,
    paddingVertical: 12,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  icon: { fontSize: 22 },
  headText: { flex: 1 },
  title: {},
  tagline: { fontSize: typography.size.xs, marginTop: 2, lineHeight: 15 },
  count: { fontSize: typography.size.md },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
    paddingHorizontal: H_PADDING,
  },
});

export default React.memo(AscCategorySection);
