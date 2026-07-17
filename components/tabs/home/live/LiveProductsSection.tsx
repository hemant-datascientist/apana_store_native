// ============================================================
// LiveProductsSection — home rail of real, just-added shop inventory.
//
// Self-fetches the newest live seller products and shows them as a
// horizontal rail with a "See all" door to the full screen. Renders
// nothing when there's no live inventory (mock mode, or genuinely empty)
// so the home feed never shows an empty shell (§19.8).
// ============================================================

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../../../theme/useTheme";
import { typography } from "../../../../theme/typography";
import LiveProductCard from "../../../live-products/LiveProductCard";
import { fetchLiveProducts, LiveProduct } from "../../../../services/liveCatalogService";

const CARD_WIDTH = 150;

export default function LiveProductsSection() {
  const { colors } = useTheme();
  const router = useRouter();
  const [products, setProducts] = useState<LiveProduct[]>([]);

  useEffect(() => {
    let alive = true;
    fetchLiveProducts(12)
      .then((items) => { if (alive) setProducts(items); })
      .catch(() => { if (alive) setProducts([]); });
    return () => { alive = false; };
  }, []);

  if (products.length === 0) return null; // honest-empty — no shell

  return (
    <View style={styles.wrap}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
            Fresh on Apana
          </Text>
          <Text style={[styles.subtitle, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
            Just added by local shops
          </Text>
        </View>
        <TouchableOpacity
          style={styles.seeAll}
          onPress={() => router.push("/live-products")}
          activeOpacity={0.7}
        >
          <Text style={[styles.seeAllText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold }]}>
            See all
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* ── Rail ── */}
      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
        renderItem={({ item }) => (
          <View style={{ width: CARD_WIDTH }}>
            <LiveProductCard product={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 8, marginBottom: 4 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  headerText: { flex: 1 },
  title: { fontSize: typography.size.lg },
  subtitle: { fontSize: typography.size.xs, marginTop: 1 },
  seeAll: { flexDirection: "row", alignItems: "center", gap: 2 },
  seeAllText: { fontSize: typography.size.sm },
  rail: { paddingHorizontal: 16, gap: 12 },
});
