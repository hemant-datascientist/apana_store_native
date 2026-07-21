// ============================================================
// ApcTileCard — one tile in the APC category grid. Same shape as the old
// SubCategoryCard (coloured square + label under it), but the glyph comes
// from the taxonomy: family tile art when it exists, else the class/family
// emoji. No Ionicons guessing — what the canvas defines is what shows.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";

export interface ApcTile {
  key: string;    // APC code
  label: string;
  emoji: string | null;
  imageUrl: string | null;
  color: string;  // tile background
}

interface ApcTileCardProps {
  item: ApcTile;
  width: number;
  onPress: (item: ApcTile) => void;
}

function ApcTileCard({ item, width, onPress }: ApcTileCardProps) {
  const { colors } = useTheme();
  const tileSize = width - 16;

  return (
    <TouchableOpacity
      style={[styles.card, { width, backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onPress(item)}
      activeOpacity={0.75}
    >
      <View style={[styles.tile, { backgroundColor: item.color, width: tileSize, height: tileSize }]}>
        {/* Emoji sits behind — becomes the visible glyph when there's no art */}
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.center}>
            <Text style={styles.emoji}>{item.emoji ?? "▦"}</Text>
          </View>
        </View>

        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={300}
            recyclingKey={item.key}
            cachePolicy="memory-disk"
          />
        ) : null}
      </View>

      <Text
        numberOfLines={2}
        style={[styles.label, {
          color: colors.text,
          fontFamily: typography.fontFamily.medium,
          fontSize: typography.size.xs,
        }]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    alignItems: "center",
    gap: 7,
  },
  tile: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 34 },
  label: { textAlign: "center", lineHeight: 17 },
});

export default React.memo(ApcTileCard);
