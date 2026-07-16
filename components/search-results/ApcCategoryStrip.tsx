// ============================================================
// APC CATEGORY STRIP — Apana Store (Customer App)
//
// Blinkit-style: when a search matches a CATEGORY (not just products), show the
// tappable category tiles ABOVE the product grid. Typing "Biscuits" surfaces
// 🍪 Biscuits & Cookies — tap it and you land on the whole category, browsed by
// the real §27 classification, instead of scrolling a flat product list.
//
// Data: services/apc.ts searchApcCategories() -> /apc/search (class + family
// hits, in that order). image_url wins; the family's icon_emoji is the fallback,
// so a tile is never blank. Tap -> /(apc)/<code> (the same node the browser opens).
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { hitImage, hitGlyph, type ApcSearchHit } from "../../services/apc";

interface ApcCategoryStripProps {
  hits: ApcSearchHit[];
}

const TILE = 64;

function CategoryTile({ hit }: { hit: ApcSearchHit }) {
  const { colors } = useTheme();
  const router = useRouter();
  const uri = hitImage(hit);

  return (
    <TouchableOpacity
      style={styles.tile}
      activeOpacity={0.7}
      onPress={() => router.push(`/(apc)/${hit.code}` as never)}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.thumb, { backgroundColor: colors.primaryLight }]}
          contentFit="cover"
          transition={150}
          cachePolicy="memory-disk"
        />
      ) : (
        <View style={[styles.thumb, styles.center, { backgroundColor: colors.primaryLight }]}>
          <Text style={styles.glyph}>{hitGlyph(hit)}</Text>
        </View>
      )}
      <Text
        numberOfLines={2}
        style={[
          styles.label,
          { color: colors.text, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs },
        ]}
      >
        {hit.name}
      </Text>
    </TouchableOpacity>
  );
}

export default function ApcCategoryStrip({ hits }: ApcCategoryStripProps) {
  const { colors } = useTheme();
  if (hits.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text
        style={[
          styles.heading,
          { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs },
        ]}
      >
        CATEGORIES
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {hits.map((h) => (
          <CategoryTile key={h.code} hit={h} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 12, paddingBottom: 4 },
  heading: { paddingHorizontal: 16, marginBottom: 10, letterSpacing: 0.6 },
  row: { paddingHorizontal: 16, gap: 14 },
  tile: { width: TILE, alignItems: "center", gap: 6 },
  thumb: { width: TILE, height: TILE, borderRadius: 16 },
  center: { alignItems: "center", justifyContent: "center" },
  glyph: { fontSize: 30, lineHeight: 34 },
  label: { textAlign: "center", lineHeight: 14 },
});
