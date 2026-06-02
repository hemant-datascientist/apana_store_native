// ============================================================
// ApcNodeRow — Apana Store
//
// A sub-category row inside an APC node screen (and search results).
// Emoji + name + Hindi + child-count; leaf nodes show a "leaf" marker,
// branches show a chevron. Animated staggered entrance via reanimated.
// ============================================================

import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { nodeChildCount, type ApcTreeNode } from "../../services/apc";
import ApcThumb from "./ApcThumb";

interface ApcNodeRowProps {
  node: ApcTreeNode;
  index?: number;
}

export default function ApcNodeRow({ node, index = 0 }: ApcNodeRowProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const kids = nodeChildCount(node);

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 12) * 35).duration(320)}>
      <TouchableOpacity
        style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
        activeOpacity={0.75}
        onPress={() => router.push(`/(apc)/${node.code}` as any)}
      >
        <ApcThumb node={node} size={38} radius={10} emojiSize={20} />

        <View style={styles.textCol}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm }]}
              numberOfLines={1}
            >
              {node.name}
            </Text>
            {node.source === "apana" && (
              <Text style={[styles.tag, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
                APANA
              </Text>
            )}
          </View>
          <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]} numberOfLines={1}>
            {node.name_hi ? `${node.name_hi} · ` : ""}{node.is_leaf ? "Leaf" : `${kids} subcategories`}
          </Text>
        </View>

        {node.is_leaf ? (
          <Text style={[styles.leaf, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
            leaf
          </Text>
        ) : (
          <Ionicons name="chevron-forward" size={18} color={colors.subText} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  textCol: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { flexShrink: 1 },
  tag: { letterSpacing: 0.5 },
  sub: { marginTop: 1 },
  leaf: { textTransform: "uppercase", letterSpacing: 0.5 },
});
