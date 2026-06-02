// ============================================================
// ApcBreadcrumb — Apana Store
//
// Horizontal ancestor trail above an APC node: "Browse" › L1 › L2 …
// Every crumb except the current node is tappable. Mirrors the
// registry browser's breadcrumb.
// ============================================================

import React from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { ApcTreeNode } from "../../services/apc";

interface ApcBreadcrumbProps {
  ancestors: ApcTreeNode[]; // root → parent
  current: string; // current node name (not tappable)
}

export default function ApcBreadcrumb({ ancestors, current }: ApcBreadcrumbProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const sep = (key: string) => (
    <Text key={key} style={[styles.sep, { color: colors.subText }]}>
      ›
    </Text>
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/(apc)" as any)}>
        <Text style={[styles.link, { color: colors.primary, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
          Browse
        </Text>
      </TouchableOpacity>

      {ancestors.map((a) => (
        <View key={a.code} style={styles.group}>
          {sep(`s-${a.code}`)}
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push(`/(apc)/${a.code}` as any)}>
            <Text style={[styles.link, { color: colors.primary, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
              {a.name}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {sep("s-current")}
      <Text style={[styles.current, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
        {current}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingRight: 16 },
  group: { flexDirection: "row", alignItems: "center" },
  link: {},
  current: {},
  sep: { marginHorizontal: 7, fontSize: 14 },
});
