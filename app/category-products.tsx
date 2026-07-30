// ============================================================
// CATEGORY PRODUCTS — real listings of ONE APC class (§27), customer app.
//
// Reached from the category browser: tapping "Mobile" lands here showing the
// mobiles that sellers have actually listed under APC-12-A7 — not the taxonomy
// tree. Layout is a left family rail + a 2-col product grid + a View-cart bar
// (Blinkit-shaped, our tokens). Honest-empty (§19.8): a class with no live
// product shows an empty state, never invented items.
//
// Data: GET /customer/catalog/products?apc_class=&apc_family= (fetchApcProducts)
// ============================================================

import React, { useEffect, useMemo, useState } from "react";
import {
  View, Text, FlatList, StyleSheet, StatusBar, ActivityIndicator, TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import useTheme from "../theme/useTheme";
import { typography } from "../theme/typography";
import { cartRowId, useCart } from "../context/CartContext";
import { storeTint } from "../lib/storeTint";
import { getClasses, getFamilies, familyImage } from "../services/apc";
import {
  fetchApcProducts, ApcFamilyFacet, LiveProduct,
} from "../services/liveCatalogService";
import ApcFamilyRail from "../components/category/ApcFamilyRail";
import ApcGridCard from "../components/category/ApcGridCard";

const ACCENT = "#0F4C81";

export default function CategoryProducts() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ code: string; title?: string }>();
  const code = String(params.code ?? "");

  const { cart, addItem, updateQty, removeItem, getItemQty } = useCart();

  const [title, setTitle] = useState(params.title ?? "");
  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [families, setFamilies] = useState<ApcFamilyFacet[]>([]);
  const [family, setFamily] = useState<string | null>(null);
  const [familyImages, setFamilyImages] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  // Resolve the class name for the header when the caller didn't pass one.
  useEffect(() => {
    if (title || !code) return;
    getClasses().then((cs) => {
      const c = cs.find((x) => x.code === code);
      if (c) setTitle(c.name);
    }).catch(() => {});
  }, [code, title]);

  useEffect(() => {
    if (!code) return;
    let alive = true;
    setLoading(true);
    setFailed(false);
    fetchApcProducts(code, { limit: 100 })
      .then((res) => { if (!alive) return; setProducts(res.products); setFamilies(res.families); })
      .catch(() => { if (alive) setFailed(true); })
      .finally(() => { if (alive) setLoading(false); });
    // Family tile art for the rail thumbnails (resolved to absolute URLs).
    getFamilies(code)
      .then((fs) => { if (alive) setFamilyImages(Object.fromEntries(fs.map((f) => [f.code, familyImage(f.image_url)]))); })
      .catch(() => {});
    return () => { alive = false; };
  }, [code]);

  // Family filter is client-side over the fetched page (rail comes from the BE
  // facet, so it is complete even when the grid is capped).
  const shown = useMemo(
    () => (family ? products.filter((p) => p.apcFamilyCode === family) : products),
    [products, family],
  );

  const cartCount = cart.reduce((n, s) => n + s.items.reduce((m, i) => m + i.qty, 0), 0);

  function addProduct(p: LiveProduct) {
    const tint = storeTint(p.store.id);
    addItem({
      storeId: p.store.id, storeName: p.store.name, storeType: p.store.type,
      storeTypeColor: tint.color, storeTypeBg: tint.bg, fulfillment: "pickup",
      item: {
        id: cartRowId(p.id, null), productId: p.id, variantId: null,
        maxQty: p.stockQty, image: p.image, name: p.name, unit: p.unit,
        price: p.price, qty: 1, icon: "pricetag-outline", bg: tint.bg,
        floorPrice: p.dealPrice ?? undefined,
      },
    });
  }
  const decProduct = (p: LiveProduct) => {
    const qty = getItemQty(p.store.id, p.id);
    if (qty <= 1) removeItem(p.store.id, p.id);
    else updateQty(p.store.id, p.id, -1);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={ACCENT} />
      <SafeAreaView style={[styles.header, { backgroundColor: ACCENT }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={[styles.hTitle, { fontFamily: typography.fontFamily.bold }]}>
              {title || "Category"}
            </Text>
            {!loading && (
              <Text style={[styles.hSub, { fontFamily: typography.fontFamily.regular }]}>
                {products.length} {products.length === 1 ? "product" : "products"}
              </Text>
            )}
          </View>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/scanner")} activeOpacity={0.7}>
            <Ionicons name="scan-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>
      ) : failed ? (
        <View style={styles.center}>
          <Text style={[styles.note, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>Couldn't load this category. Pull back and retry.</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="cube-outline" size={44} color={colors.subText} />
          <Text style={[styles.note, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>No {title || "products"} near you yet.</Text>
        </View>
      ) : (
        <View style={styles.bodyRow}>
          <ApcFamilyRail families={families} totalCount={products.length} selected={family} onSelect={setFamily} images={familyImages} />
          <FlatList
            style={{ flex: 1 }}
            data={shown}
            keyExtractor={(p) => p.id}
            numColumns={2}
            columnWrapperStyle={styles.col}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.cell}>
                <ApcGridCard
                  product={item}
                  qty={getItemQty(item.store.id, item.id)}
                  onOpen={() => router.push(`/live-product-detail?id=${item.id}` as never)}
                  onAdd={() => addProduct(item)}
                  onInc={() => updateQty(item.store.id, item.id, 1)}
                  onDec={() => decProduct(item)}
                />
              </View>
            )}
            ListEmptyComponent={
              <Text style={[styles.note, { color: colors.subText, fontFamily: typography.fontFamily.medium, padding: 24 }]}>
                Nothing in this sub-category yet.
              </Text>
            }
          />
        </View>
      )}

      {/* View-cart bar */}
      {cartCount > 0 && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push("/cart" as never)}
          style={[styles.cartBar, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="cart" size={20} color="#fff" />
          <Text style={[styles.cartText, { fontFamily: typography.fontFamily.bold }]}>
            View cart · {cartCount} {cartCount === 1 ? "item" : "items"}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {},
  headerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, gap: 10 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  hTitle: { color: "#fff", fontSize: typography.size.lg },
  hSub: { color: "rgba(255,255,255,0.8)", fontSize: typography.size.xs, marginTop: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  note: { textAlign: "center" },
  bodyRow: { flex: 1, flexDirection: "row" },
  grid: { padding: 10, paddingBottom: 96 },
  col: { gap: 10 },
  cell: { flex: 1, marginBottom: 10 },
  cartBar: {
    position: "absolute", left: 16, right: 16, bottom: 20, height: 52, borderRadius: 14,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 5,
  },
  cartText: { color: "#fff", fontSize: typography.size.md },
});
