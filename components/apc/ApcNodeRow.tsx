// ============================================================
// ApcNodeRow — Apana Store
//
// A sub-category row inside an APC node screen. Leaf nodes show a
// "leaf" marker (products classify directly there); branch nodes show
// a chevron and drill deeper.
// ============================================================

import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { ApcTreeNode } from "../../services/apc";

interface ApcNodeRowProps {
  node: ApcTreeNode;
}

export default function ApcNodeRow({ node }: ApcNodeRowProps) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.7}
      onPress={() => router.push(`/(apc)/${node.code}` as any)}
    >
      <View style={styles.textCol}>
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

      {node.is_leaf ? (
        <Text style={[styles.leaf, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
          leaf
        </Text>
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.subText} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  textCol: { flex: 1, minWidth: 0 },
  name: {},
  tag: { letterSpacing: 0.5, marginTop: 2 },
  leaf: { textTransform: "uppercase", letterSpacing: 0.5 },
});
