// ============================================================
// ApcSegmentCard — Apana Store
//
// Top-level APC segment tile for the browser grid (index screen).
// Emoji thumbnail, name + Hindi, child-count, Apana badge. Animated
// entrance (staggered fade-up) via reanimated.
// ============================================================

import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { nodeEmoji, nodeChildCount, type ApcTreeNode } from "../../services/apc";

interface ApcSegmentCardProps {
  node: ApcTreeNode;
  index?: number;
}

export default function ApcSegmentCard({ node, index = 0 }: ApcSegmentCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const isApana = node.source === "apana";
  const kids = nodeChildCount(node);

  return (
    <Animated.View style={styles.wrap} entering={FadeInDown.delay(index * 40).duration(360)}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        activeOpacity={0.75}
        onPress={() => router.push(`/(apc)/${node.code}` as any)}
      >
        <View style={[styles.emojiWrap, { backgroundColor: colors.primaryLight }]}>
          <Text style={styles.emoji}>{nodeEmoji(node)}</Text>
        </View>

        <Text
          style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}
          numberOfLines={2}
        >
          {node.name}
        </Text>
        {node.name_hi ? (
          <Text style={[styles.hi, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]} numberOfLines={1}>
            {node.name_hi}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <Text style={[styles.meta, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.ss }]}>
            {node.is_leaf ? "Leaf" : `${kids} subcategories`}
          </Text>
          {isApana && (
            <View style={[styles.badge, { borderColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
                APANA
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  card: {
    flex: 1,
    minHeight: 124,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  emojiWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  emoji: { fontSize: 22, lineHeight: 26 },
  name: {},
  hi: {},
  metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: "auto", gap: 6 },
  meta: { flexShrink: 1 },
  badge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 1 },
  badgeText: { letterSpacing: 0.5 },
});
