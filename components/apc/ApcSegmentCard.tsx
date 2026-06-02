// ============================================================
// ApcSegmentCard — Apana Store
//
// Top-level APC segment tile for the browser grid (index screen).
// Shows the code, name + an "Apana" badge on India-specific nodes.
// ============================================================

import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { ApcTreeNode } from "../../services/apc";

interface ApcSegmentCardProps {
  node: ApcTreeNode;
}

export default function ApcSegmentCard({ node }: ApcSegmentCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const isApana = node.source === "apana";

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.7}
      onPress={() => router.push(`/(apc)/${node.code}` as any)}
    >
      <Text
        style={[styles.code, { color: colors.primary, fontFamily: typography.fontFamily.medium, fontSize: typography.size.ss }]}
        numberOfLines={1}
      >
        {node.code}
      </Text>
      <Text
        style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}
        numberOfLines={2}
      >
        {node.name}
      </Text>
      {isApana && (
        <View style={[styles.badge, { borderColor: colors.primary }]}>
          <Text style={[styles.badgeText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
            APANA
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 92,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    justifyContent: "flex-start",
    gap: 4,
  },
  code: { letterSpacing: 0.5 },
  name: {},
  badge: {
    alignSelf: "flex-start",
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { letterSpacing: 0.5 },
});
