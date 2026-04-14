// ============================================================
// SEARCH SCREEN — Apana Store (Customer App)
//
// Planned features:
//   - Full-text product/store search with filters
//   - Barcode scanner (Scan & Search)
//   - Category browse grid
//   - Recent searches + trending products
//   - OOS Strategy Engine results
//
// Replace placeholder with full implementation.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export default function SearchScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary + "15" }]}>
          <Ionicons name="search-outline" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
          Search
        </Text>
        <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
          Product/store search, barcode scanner, and category browse coming soon
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
