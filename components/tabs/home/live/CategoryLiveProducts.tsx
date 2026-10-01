// ============================================================
// CategoryLiveProducts — the real-inventory section that replaces a feed's
// mock product grids. Same section shell (header + horizontal cards) the
// mock sections used, but every item is a real seller product for this
// category. When a shop hasn't added anything here yet, it shows an honest
// empty line instead of mock fillers (§19.8) — the section header stays so
// the layout is unchanged.
//
// Card is ApcGridCard — the same real image + ADD/stepper/Options card the
// category-products drill-down already uses, wired to the one CartContext
// (addItem/updateQty/removeItem) the same way category-products.tsx does.
// This used to render the display-only LiveProductCard, so Home's "Available
// now" rails had no add-to-cart path at all.
// ============================================================

import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../../../theme/useTheme";
import { typography } from "../../../../theme/typography";
import ApcGridCard from "../../../category/ApcGridCard";
import { useLiveProducts } from "../../../../hooks/useLiveProducts";
import { productsForCategory } from "../../../../lib/categoryLiveMatch";
import { useCart, cartRowId } from "../../../../context/CartContext";
import { storeTint } from "../../../../lib/storeTint";
import type { LiveProduct } from "../../../../services/liveCatalogService";

const CARD_WIDTH = 160;

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
  const { addItem, updateQty, removeItem, getItemQty } = useCart();
  const accent = accentColor ?? colors.primary;
  const matched = productsForCategory(products, categoryKey);

  // Same add/decrement shape as app/category-products.tsx — one listing (no
  // variant picker) adds straight in; a variant listing routes to detail.
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
  function decProduct(p: LiveProduct) {
    const qty = getItemQty(p.store.id, p.id);
    if (qty <= 1) removeItem(p.store.id, p.id);
    else updateQty(p.store.id, p.id, -1);
  }

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
            <View style={{ width: CARD_WIDTH }}>
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
