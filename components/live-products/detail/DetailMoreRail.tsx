// ============================================================
// DetailMoreRail — "More on Apana" suggestions under a product detail.
// Pulls other live products and lets each tap open its own detail. Renders
// nothing when there's nothing else live (honest-empty).
// ============================================================

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import useTheme from "../../../theme/useTheme";
import { typography } from "../../../theme/typography";
import LiveProductCard from "../LiveProductCard";
import { fetchLiveProducts, LiveProduct } from "../../../services/liveCatalogService";

const CARD_WIDTH = 150;

interface DetailMoreRailProps {
  excludeId: string;
}

export default function DetailMoreRail({ excludeId }: DetailMoreRailProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [items, setItems] = useState<LiveProduct[]>([]);

  useEffect(() => {
    let alive = true;
    fetchLiveProducts(14)
      .then((all) => { if (alive) setItems(all.filter((p) => p.id !== excludeId).slice(0, 12)); })
      .catch(() => { if (alive) setItems([]); });
    return () => { alive = false; };
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
        More on Apana
      </Text>
      <FlatList
        data={items}
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 24 },
  title: { fontSize: typography.size.lg, marginBottom: 12 },
  rail: { gap: 12, paddingRight: 4 },
});
