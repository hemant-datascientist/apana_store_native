// ============================================================
// APC CLASSES — Level 2 of the nested classification browser.
//
// Shows the CLASSES inside one department (e.g. Grocery → Fruits, Vegetables,
// Dairy…). Reached from the department grid (Level 1). Tapping a class opens
// its products with the family rail (Level 3, category-products). Single-class
// departments skip this screen — the grid goes straight to products.
// ============================================================

import React from "react";
import { View, Text, StyleSheet, StatusBar, ActivityIndicator, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme from "../theme/useTheme";
import { typography } from "../theme/typography";
import { useApcBrowser } from "../hooks/useApcBrowser";
import ApcTileCard, { ApcTile } from "../components/tabs/category/ApcTileCard";

const ACCENT = "#0F4C81";
const SCREEN_WIDTH = Dimensions.get("window").width;
const H_PADDING = 12;
const COLS = 3;
const COL_GAP = 8;
const CARD_WIDTH = Math.floor((SCREEN_WIDTH - H_PADDING * 2 - COL_GAP * (COLS - 1)) / COLS);
const TILE_COLORS = ["#DCFCE7", "#DBEAFE", "#FEF3C7", "#FCE7F3", "#EDE9FE", "#FFEDD5", "#FEE2E2", "#ECFDF5", "#E0F2FE", "#F3F4F6"];

export default function ApcClassesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ code: string; title?: string }>();
  const deptCode = String(params.code ?? "");

  const { groups, loading } = useApcBrowser();
  const group = groups.find((g) => g.code === deptCode);

  const tiles: ApcTile[] = (group?.classes ?? []).map((c, i) => ({
    key: c.code,
    label: c.name,
    emoji: c.icon_emoji,
    imageUrl: null,
    color: TILE_COLORS[i % TILE_COLORS.length],
  }));

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={ACCENT} />
      <SafeAreaView style={[styles.header, { backgroundColor: ACCENT }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text numberOfLines={1} style={[styles.hTitle, { fontFamily: typography.fontFamily.bold }]}>
            {params.title ?? group?.title ?? "Category"}
          </Text>
        </View>
      </SafeAreaView>

      {loading && !group ? (
        <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
      ) : tiles.length === 0 ? (
        <View style={styles.center}>
          <Text style={[styles.note, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>No categories here yet.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {tiles.map((t) => (
            <ApcTileCard
              key={t.key}
              item={t}
              width={CARD_WIDTH}
              onPress={(x) => router.push(`/category-products?code=${encodeURIComponent(x.key)}` as never)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {},
  headerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, gap: 10 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  hTitle: { color: "#fff", fontSize: typography.size.lg, flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  note: { textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: COL_GAP, paddingHorizontal: H_PADDING, paddingVertical: 12, paddingBottom: 32 },
});
