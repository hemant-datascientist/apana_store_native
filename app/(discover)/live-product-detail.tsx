// ============================================================
// LIVE PRODUCT DETAIL — SmartConsumer-style detail for a real seller product.
//
// Hero carousel + Made-in-India flag · title/brand/Verified/GTIN · price ·
// tabbed spec cards (Details / Availability / MRP / Company / Regulatory /
// Other, data-driven from the GTIN scrape) · stocking stores · suggestions.
//
// Backend: GET /api/customer/catalog/products/:id
// ============================================================

import React, { useCallback, useEffect, useState } from "react";
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import DetailHero from "../../components/live-products/detail/DetailHero";
import DetailHeader from "../../components/live-products/detail/DetailHeader";
import DetailTabs from "../../components/live-products/detail/DetailTabs";
import DetailMoreRail from "../../components/live-products/detail/DetailMoreRail";
import { buildTabs } from "../../components/live-products/detail/buildTabs";
import { fetchProductDetail, ProductDetail } from "../../services/liveCatalogService";

function rupee(n: number): string {
  return `₹${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}

export default function LiveProductDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) { setError("Missing product."); setLoading(false); return; }
    try {
      setError(null);
      const d = await fetchProductDetail(id);
      if (!d) setError("Product not found.");
      setDetail(d);
    } catch {
      setError("Couldn't load this product.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { setLoading(true); load(); }, [load]);

  const p = detail?.product;
  const isIndia = (detail?.enrichment?.country ?? "").toLowerCase().includes("india");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}
        >
          {p?.name ?? "Product"}
        </Text>
        <View style={styles.back} />
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
      ) : !p ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={44} color={colors.subText} />
          <Text style={[styles.errText, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
            {error ?? "Product not found."}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <DetailHero images={p.images} isIndia={isIndia} />
          <DetailHeader name={p.name} brand={p.brand} verified={detail?.enrichment?.verified ?? false} gtin={detail?.enrichment?.gtin ?? null} />

          {/* ── Price row ── */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
              {rupee(p.price)}
            </Text>
            {p.mrp != null && p.mrp > p.price && (
              <Text style={[styles.mrp, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                {rupee(p.mrp)}
              </Text>
            )}
            <Text style={[styles.unit, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
              /{p.unit}
            </Text>
            {p.isVeg != null && (
              <View style={[styles.vegMark, { borderColor: p.isVeg ? colors.success : colors.danger }]}>
                <View style={[styles.vegDot, { backgroundColor: p.isVeg ? colors.success : colors.danger }]} />
              </View>
            )}
          </View>

          <Text style={[styles.availLine, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
            Available at {detail?.stores.length ?? 0} {(detail?.stores.length ?? 0) === 1 ? "shop" : "shops"} near you
          </Text>

          {/* ── Tabbed spec cards ── */}
          <DetailTabs tabs={buildTabs(detail!)} />

          {/* ── Suggestions ── */}
          <DetailMoreRail excludeId={p.id} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, gap: 4 },
  back: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: typography.size.md },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 10 },
  errText: { fontSize: typography.size.md, textAlign: "center" },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 8, marginTop: 14 },
  price: { fontSize: typography.size.xxl },
  mrp: { fontSize: typography.size.md, textDecorationLine: "line-through" },
  unit: { fontSize: typography.size.sm },
  vegMark: { width: 16, height: 16, borderRadius: 3, borderWidth: 1.5, alignItems: "center", justifyContent: "center", alignSelf: "center" },
  vegDot: { width: 7, height: 7, borderRadius: 4 },
  availLine: { fontSize: typography.size.sm, marginTop: 8 },
});
