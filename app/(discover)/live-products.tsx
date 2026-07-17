// ============================================================
// LIVE PRODUCTS SCREEN — "Fresh on Apana" (Customer App)
//
// Shows real products that local shops have scanned/added — pulled live
// from seller_products (approved store + active + in stock, newest first).
// Honest-empty: when nothing is live, it says so rather than faking a grid
// (§19.8). Display-only for now — the goal is proving the seller→customer
// visibility bridge end to end.
//
// Backend: GET /api/customer/catalog/products?q=&limit=
// ============================================================

import React, { useCallback, useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  TouchableOpacity, RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import LiveProductCard from "../../components/live-products/LiveProductCard";
import {
  fetchLiveProducts, LIVE_CATALOG_IS_LIVE, LiveProduct,
} from "../../services/liveCatalogService";

export default function LiveProductsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const items = await fetchLiveProducts(60);
      setProducts(items);
    } catch {
      setError("Couldn't load live products. Pull to retry.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(); };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
            Fresh on Apana
          </Text>
          <Text style={[styles.subtitle, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
            Real stock local shops just added
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p) => p.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <LiveProductCard product={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="basket-outline" size={44} color={colors.subText} />
              <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                {error ?? "No live products yet"}
              </Text>
              {!error && (
                <Text style={[styles.emptyBody, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                  {LIVE_CATALOG_IS_LIVE
                    ? "When a shop scans or adds an item, it shows up here."
                    : "Connect to the backend (local mode) to see real shop inventory."}
                </Text>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  back: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerText: { flex: 1 },
  title: { fontSize: typography.size.xl },
  subtitle: { fontSize: typography.size.xs, marginTop: 1 },
  list: { padding: 12, gap: 12, flexGrow: 1 },
  row: { gap: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 10 },
  emptyTitle: { fontSize: typography.size.md, textAlign: "center" },
  emptyBody: { fontSize: typography.size.sm, textAlign: "center", lineHeight: 20 },
});
