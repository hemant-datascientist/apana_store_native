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
import * as Haptics from "expo-haptics";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import DetailHero from "../../components/live-products/detail/DetailHero";
import DetailHeader from "../../components/live-products/detail/DetailHeader";
import DetailTabs from "../../components/live-products/detail/DetailTabs";
import DetailMoreRail from "../../components/live-products/detail/DetailMoreRail";
import { buildTabs } from "../../components/live-products/detail/buildTabs";
import VariantPicker from "../../components/live-products/detail/VariantPicker";
import DetailBuyBar from "../../components/live-products/detail/DetailBuyBar";
import { cartRowId, useCart } from "../../context/CartContext";
import { storeTint } from "../../lib/storeTint";
import {
  initialSelection, resolveVariant, variantMrp, variantPrice, variantStock,
} from "../../lib/variantSelect";
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
  // §23 — which SKU the customer is looking at. Seeded to something the shop
  // can actually sell so the price block is never blank on arrival.
  const [selection, setSelection] = useState<Record<string, string>>({});
  const { cart, addItem } = useCart();

  const load = useCallback(async () => {
    if (!id) { setError("Missing product."); setLoading(false); return; }
    try {
      setError(null);
      const d = await fetchProductDetail(id);
      if (!d) setError("Product not found.");
      setDetail(d);
      setSelection(d ? initialSelection(d.product.variants) : {});
    } catch {
      setError("Couldn't load this product.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { setLoading(true); load(); }, [load]);

  const p = detail?.product;
  const isIndia = (detail?.enrichment?.country ?? "").toLowerCase().includes("india");

  // Everything money- and stock-related follows the chosen SKU, falling back to
  // the parent when the listing has no variants at all.
  const variants = p?.variants ?? [];
  const chosen = resolveVariant(variants, selection);
  const shownPrice = variantPrice(chosen, p?.price ?? 0);
  const shownMrp = variantMrp(chosen, p?.mrp ?? null);
  const shownStock = variantStock(chosen, variants, p?.stockQty ?? 0);
  // A variant listing with nothing resolved yet is not orderable — the
  // customer has an axis left to pick, or picked a combination nobody stocks.
  const needsChoice = variants.length > 0 && chosen == null;

  const rowId = p != null ? cartRowId(p.id, chosen?.id ?? null) : "";
  const inCartQty =
    cart.find((s) => s.id === p?.store.id)?.items.find((i) => i.id === rowId)?.qty ?? 0;

  function handleAdd() {
    if (p == null || needsChoice || shownStock <= 0) return;
    const tint = storeTint(p.store.id);
    addItem({
      storeId: p.store.id,
      storeName: p.store.name,
      storeType: p.store.type,
      storeTypeColor: tint.color,
      storeTypeBg: tint.bg,
      // Real fulfilment selection happens in the cart; pickup is the only mode
      // that needs no address, so it is the honest default.
      fulfillment: "pickup",
      item: {
        id: rowId,
        productId: p.id,
        variantId: chosen?.id ?? null,
        variantLabel: chosen != null ? Object.values(chosen.axes).join(" / ") : null,
        maxQty: shownStock,
        image: p.image,
        name: p.name,
        unit: p.unit,
        price: shownPrice,
        qty: 1,
        icon: "pricetag-outline",
        bg: tint.bg,
        // Stop-loss floor travels with the line so the cart can show the
        // unlock nudge; the server still decides what is actually charged.
        floorPrice: chosen?.dealPrice ?? p.dealPrice ?? undefined,
      },
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }

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

          {/* ── Price row — follows the selected SKU ── */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
              {rupee(shownPrice)}
            </Text>
            {shownMrp != null && shownMrp > shownPrice && (
              <Text style={[styles.mrp, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                {rupee(shownMrp)}
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

          {/* ── §23 size / colour picker ── */}
          <View style={styles.pickerWrap}>
            <VariantPicker
              variants={variants}
              selection={selection}
              onSelect={(axisKey, value) =>
                setSelection((prev) => ({ ...prev, [axisKey]: value }))
              }
            />
          </View>

          {/* Stock line is about the CHOSEN size, not the product overall — a
              shop with 40 shirts and no Large must say so plainly. */}
          {variants.length > 0 && (
            <Text
              style={[styles.stockLine, {
                color: shownStock > 0 ? colors.success : colors.danger,
                fontFamily: typography.fontFamily.semiBold,
              }]}
            >
              {shownStock > 0
                ? `${shownStock} left in this option`
                : "This option is out of stock"}
            </Text>
          )}

          <Text style={[styles.availLine, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
            Available at {detail?.stores.length ?? 0} {(detail?.stores.length ?? 0) === 1 ? "shop" : "shops"} near you
          </Text>

          {/* ── Tabbed spec cards ── */}
          <DetailTabs tabs={buildTabs(detail!)} />

          {/* ── Suggestions ── */}
          <DetailMoreRail excludeId={p.id} />
        </ScrollView>
      )}

      {p != null && (
        <DetailBuyBar
          price={shownPrice}
          mrp={shownMrp}
          needsChoice={needsChoice}
          stock={shownStock}
          inCartQty={inCartQty}
          onAdd={handleAdd}
          onGoToCart={() => router.push("/cart")}
        />
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
  // Picker draws its own horizontal padding, so cancel the screen's.
  pickerWrap: { marginHorizontal: -16, marginTop: 14 },
  stockLine: { fontSize: typography.size.sm, marginTop: 12 },
});
