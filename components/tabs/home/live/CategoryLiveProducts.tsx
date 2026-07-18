// ============================================================
// CategoryLiveProducts — the real-inventory section that replaces a feed's
// mock product grids. Same section shell (header + horizontal cards) the
// mock sections used, but every item is a real seller product for this
// category. When a shop hasn't added anything here yet, it shows an honest
// empty line instead of mock fillers (§19.8) — the section header stays so
// the layout is unchanged.
// ============================================================

import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../../../theme/useTheme";
import { typography } from "../../../../theme/typography";
import LiveProductCard from "../../../live-products/LiveProductCard";
import { useLiveProducts } from "../../../../hooks/useLiveProducts";
import { productsForCategory } from "../../../../lib/categoryLiveMatch";

const CARD_WIDTH = 150;

interface CategoryLiveProductsProps {
  categoryKey: string;
  title?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  accentColor?: string;
}

export default function CategoryLiveProducts({
  categoryKey,
  title = "Available now",
  icon = "storefront-outline",
  accentColor,
}: CategoryLiveProductsProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const { products, loading } = useLiveProducts();
  const accent = accentColor ?? colors.primary;
  const matched = productsForCategory(products, categoryKey);

  return (
    <View style={styles.wrap}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={[styles.iconDot, { backgroundColor: accent + "1A" }]}>
          <Ionicons name={icon} size={16} color={accent} />
        </View>
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
          {title}
        </Text>
        {matched.length > 0 && (
          <Text style={[styles.count, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
            {matched.length}
          </Text>
        )}
      </View>

      {/* ── Body ── */}
      {loading ? (
        <View style={styles.state}><ActivityIndicator color={accent} /></View>
      ) : matched.length === 0 ? (
        <Text style={[styles.empty, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
          No shop has added items here yet — check back soon.
        </Text>
      ) : (
        <FlatList
          data={matched}
          keyExtractor={(p) => p.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rail}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ width: CARD_WIDTH }}
              activeOpacity={0.85}
              onPress={() => router.push(`/live-product-detail?id=${item.id}`)}
            >
              <LiveProductCard product={item} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 20 },
  header: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  iconDot: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  title: { fontSize: typography.size.lg },
  count: { fontSize: typography.size.sm },
  state: { paddingVertical: 24, alignItems: "center" },
  empty: { fontSize: typography.size.sm, paddingHorizontal: 16, paddingVertical: 6 },
  rail: { paddingHorizontal: 16, gap: 12 },
});
