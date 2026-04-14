// ============================================================
// CATEGORY SCREEN — Apana Store (Customer App)
//
// Planned features:
//   - Category grid: Grocery, Pharmacy, Electronics, Fashion,
//     Food & Beverage, Beauty, Sports, Home & Kitchen, and more
//   - Tapping a category → filtered store list for that type
//   - Sub-category drill-down (e.g. Grocery → Fruits, Dairy…)
//   - Category-level deals and offers banner
//   - Search bar at top for quick category jump
//
// Data: GET /categories — category tree with store counts
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export default function CategoryScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary + "15" }]}>
          <Ionicons name="grid-outline" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
          Categories
        </Text>
        <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
          Grocery, Pharmacy, Electronics, Fashion, Food, Beauty, Sports, Home & more — coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1 },
  center:     { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingHorizontal: 32 },
  iconCircle: { width: 84, height: 84, borderRadius: 24, justifyContent: "center", alignItems: "center" },
  title:      {},
  sub:        { textAlign: "center", lineHeight: 22 },
});
