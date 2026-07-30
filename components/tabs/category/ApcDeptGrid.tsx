// ============================================================
// ApcDeptGrid — Level 1 of the nested APC browser: the 34 DEPARTMENTS as a
// 3-col tile grid (Grocery, Beverages, Fashion…). Tapping a department drills
// to its classes (or straight to products for a single-class department). The
// tree is Department → Class → Family → Product, one level per screen; this is
// the top. Reuses ApcTileCard so it matches the loved category look.
// ============================================================

import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import ApcTileCard, { ApcTile } from "./ApcTileCard";
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

interface Props {
  groups: ApcBrowseGroup[];
  onSelect: (group: ApcBrowseGroup) => void;
}

export default function ApcDeptGrid({ groups, onSelect }: Props) {
  const byCode = new Map(groups.map((g) => [g.code, g]));

  const tiles: ApcTile[] = groups.map((g, i) => ({
    key: g.code,
    label: g.title,
    emoji: g.icon,
    imageUrl: null,
    color: TILE_COLORS[i % TILE_COLORS.length],
  }));

  return (
    <View style={styles.grid}>
      {tiles.map((t) => (
        <ApcTileCard
          key={t.key}
          item={t}
          width={CARD_WIDTH}
          onPress={(x) => {
            const g = byCode.get(x.key);
            if (g) onSelect(g);
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: COL_GAP,
    paddingHorizontal: H_PADDING,
    paddingBottom: 24,
  },
});
