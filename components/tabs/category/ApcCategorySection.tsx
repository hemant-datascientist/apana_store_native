// ============================================================
// ApcCategorySection — one APC department block, old browser look:
// coloured section header + 3-column tile grid.
//
// What the tiles are depends on the taxonomy shape, so every department has
// real sub-categories:
//   department with several classes (Food & Fresh) -> its classes
//   department with one class (Fashion)            -> that class's families
// Families are fetched lazily per section, so FlatList windowing means only
// on-screen departments hit the network.
// ============================================================

import React from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import ApcTileCard, { ApcTile } from "./ApcTileCard";
import { useApcFamilies } from "../../../hooks/useApcFamilies";
import { familyImage } from "../../../services/apc";
import type { ApcBrowseGroup } from "../../../hooks/useApcBrowser";

const SCREEN_WIDTH = Dimensions.get("window").width;
const H_PADDING = 12;
const COLS = 3;
const COL_GAP = 8;
const CARD_WIDTH = Math.floor((SCREEN_WIDTH - H_PADDING * 2 - COL_GAP * (COLS - 1)) / COLS);

// Soft tile backgrounds, rotated (APC carries no colours of its own).
const TILE_COLORS = [
  "#DCFCE7", "#DBEAFE", "#FEF3C7", "#FCE7F3", "#EDE9FE",
  "#FFEDD5", "#FEE2E2", "#ECFDF5", "#E0F2FE", "#F3F4F6",
];

interface ApcCategorySectionProps {
  group: ApcBrowseGroup;
  accent: string;
  onPress: (code: string) => void;
}

function ApcCategorySection({ group, accent, onPress }: ApcCategorySectionProps) {
  const { colors } = useTheme();

  // Single-class department -> drill one tier down to its families.
  const drillClass = group.classes.length === 1 ? group.classes[0].code : null;
  const { families, loading } = useApcFamilies(drillClass);

  const tiles: ApcTile[] =
    drillClass && families.length > 0
      ? families.map((f, i) => ({
          key: f.code,
          label: f.name,
          emoji: f.icon_emoji,
          imageUrl: familyImage(f.image_url),
          color: TILE_COLORS[i % TILE_COLORS.length],
        }))
      : group.classes.map((c, i) => ({
          key: c.code,
          label: c.name,
          emoji: c.icon_emoji,
          imageUrl: null,
          color: TILE_COLORS[i % TILE_COLORS.length],
        }));

  return (
    <View style={styles.section}>
      <View style={[styles.header, { borderLeftColor: accent }]}>
        <Text style={[styles.title, {
          color: colors.text,
          fontFamily: typography.fontFamily.bold,
          fontSize: typography.size.md,
        }]}>
          {group.title}
        </Text>
        <Text style={[styles.count, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
          {tiles.length}
        </Text>
      </View>

      {loading && tiles.length === 0 ? (
        <View style={styles.loading}><ActivityIndicator color={accent} /></View>
      ) : (
        <View style={styles.grid}>
          {tiles.map((t) => (
            <ApcTileCard key={t.key} item={t} width={CARD_WIDTH} onPress={(x) => onPress(x.key)} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: H_PADDING,
    paddingVertical: 12,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  title: { flex: 1 },
  count: { fontSize: typography.size.xs },
  loading: { paddingVertical: 24, alignItems: "center" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: COL_GAP,
    paddingHorizontal: H_PADDING,
  },
});

export default React.memo(ApcCategorySection);
