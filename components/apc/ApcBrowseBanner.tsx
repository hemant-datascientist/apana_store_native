// ============================================================
// ApcBrowseBanner — Apana Store
//
// Entry tile into the full APC taxonomy browser (§27). Sits atop the
// Category tab so customers can walk every retail domain, not just the
// curated home groups.
// ============================================================

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export default function ApcBrowseBanner() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.8}
      onPress={() => router.push("/(apc)" as any)}
    >
      <View style={[styles.icon, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name="git-network-outline" size={22} color={colors.primary} />
      </View>
      <View style={styles.textCol}>
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
          Browse all categories
        </Text>
        <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]} numberOfLines={1}>
          Full Apana Product Classification — grocery to electronics
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.subText} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  icon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  textCol: { flex: 1, minWidth: 0 },
  title: {},
  sub: { marginTop: 2 },
});
