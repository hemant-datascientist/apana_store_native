// ============================================================
// PRODUCT DETAIL SCREEN — Apana Store
//
// Slim orchestrator (~150 lines). Composes all product-detail
// components into a single scrollable page with a sticky
// bottom action bar.
//
// Route: /product-detail?id=<productId>
// ============================================================

import React, { useState, useCallback } from "react";
import {
  View, ScrollView, TouchableOpacity, Text, StyleSheet, StatusBar, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";

import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { useCart } from "../../context/CartContext";
import { getProductById } from "../../data/productDetailData";

import ProductImageCarousel  from "../../components/product-detail/ProductImageCarousel";
import ProductPriceBlock     from "../../components/product-detail/ProductPriceBlock";
import ProductRatingBar      from "../../components/product-detail/ProductRatingBar";
import ProductVariants        from "../../components/product-detail/ProductVariants";
import ProductOffers          from "../../components/product-detail/ProductOffers";
import ProductHighlights      from "../../components/product-detail/ProductHighlights";
import ProductSpecifications  from "../../components/product-detail/ProductSpecifications";
import ProductReviews         from "../../components/product-detail/ProductReviews";
import ProductDeliveryInfo    from "../../components/product-detail/ProductDeliveryInfo";
import ProductSimilar         from "../../components/product-detail/ProductSimilar";
import ProductBottomBar       from "../../components/product-detail/ProductBottomBar";

export default function ProductDetailScreen() {
  const { colors }            = useTheme();
  const router                = useRouter();
  const { id }                = useLocalSearchParams<{ id?: string }>();
  const { addItem, getItemQty } = useCart();

  // ── Resolve product ───────────────────────────────────────
  const product = getProductById(id ?? "p1");

  // ── selectedVariants: keyed by group.type ─────────────────
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    product.variantGroups.forEach(g => {
      const first = g.options.find(o => o.inStock);
      if (first) defaults[g.type] = first.id;
    });
    return defaults;
  });

  const [qty,   setQty]   = useState(1);
  const [isFav, setIsFav] = useState(false);

  // ── Variant selection ─────────────────────────────────────
  function handleSelectVariant(groupType: string, optionId: string) {
    setSelectedVariants(prev => ({ ...prev, [groupType]: optionId }));
  }

  // ── Qty stepper ───────────────────────────────────────────
  function handleQtyDec() { setQty(q => Math.max(1, q - 1)); }
  function handleQtyInc() { setQty(q => q + 1); }

  // ── Add to cart ───────────────────────────────────────────
  const handleAddToCart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    for (let i = 0; i < qty; i++) {
      addItem({
        storeId:        product.storeId,
        storeName:      product.storeName,
        storeType:      product.storeType,
        storeTypeColor: product.storeTypeColor,
        storeTypeBg:    product.storeTypeBg,
        fulfillment:    "delivery",
        item: {
          id:    product.id,
          name:  product.name,
          price: product.price,
          qty:   1,
          unit:  product.unit,
          icon:  product.cartIcon,
          bg:    product.cartBg,
        },
      });
    }
  }, [qty, product, addItem]);

  // ── Buy Now ───────────────────────────────────────────────
  function handleBuyNow() {
    handleAddToCart();
    router.push("/checkout?mode=delivery");
  }

  // ── Favourite toggle ──────────────────────────────────────
  function handleFavToggle() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFav(f => !f);
  }

  const cartQty  = getItemQty(product.storeId, product.id);
  const inStock  = product.inStock && product.stockCount > 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── Floating header ─────────────────────────────────── */}
      <SafeAreaView edges={["top"]} style={styles.headerWrap}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.75}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md }]} numberOfLines={1}>
            {product.name}
          </Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push("/cart")} activeOpacity={0.75}>
            <Ionicons name="cart-outline" size={22} color={colors.text} />
            {cartQty > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.badgeText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
                  {cartQty}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ── Scrollable content ───────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProductImageCarousel images={product.images} />

        <ProductPriceBlock
          categoryLabel={product.categoryLabel}
          brand={product.brand}
          name={product.name}
          price={product.price}
          mrp={product.mrp}
          unit={product.unit}
          inStock={inStock}
          stockCount={product.stockCount}
        />

        <ProductRatingBar
          rating={product.rating}
          reviewCount={product.reviewCount}
          breakdown={product.ratingBreakdown}
          onSeeAllReviews={() => {/* TODO: scroll to reviews */}}
        />

        {product.variantGroups.length > 0 && (
          <ProductVariants
            groups={product.variantGroups}
            selectedIds={selectedVariants}
            onSelect={handleSelectVariant}
          />
        )}

        {product.offers.length > 0 && (
          <ProductOffers offers={product.offers} />
        )}

        <ProductHighlights
          description={product.description}
          highlights={product.highlights}
        />

        {product.specifications.length > 0 && (
          <ProductSpecifications specs={product.specifications} />
        )}

        <ProductDeliveryInfo
          deliveryDays={product.deliveryDays}
          freeDeliveryAbove={product.freeDeliveryAbove}
          returnDays={product.returnDays}
          isCodAvailable={product.isCodAvailable}
          storeName={product.storeName}
          storeType={product.storeType}
          storeTypeColor={product.storeTypeColor}
          storeTypeBg={product.storeTypeBg}
        />

        {product.reviews.length > 0 && (
          <ProductReviews
            reviews={product.reviews}
            totalCount={product.reviewCount}
          />
        )}

        {product.similarProducts.length > 0 && (
          <ProductSimilar products={product.similarProducts} />
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── Sticky bottom bar ────────────────────────────────── */}
      <ProductBottomBar
        isFav={isFav}
        onFavToggle={handleFavToggle}
        qty={qty}
        onQtyDec={handleQtyDec}
        onQtyInc={handleQtyInc}
        inStock={inStock}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        cartQty={cartQty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1 },
  headerWrap: { zIndex: 10 },
  header: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 8,
    paddingVertical:   10,
    borderBottomWidth: 1,
    gap:               4,
  },
  iconBtn: {
    width:          40,
    height:         40,
    alignItems:     "center",
    justifyContent: "center",
    position:       "relative",
    flexShrink:     0,
  },
  headerTitle:  { flex: 1, textAlign: "center" },
  badge: {
    position:       "absolute",
    top:            4,
    right:          4,
    width:          15,
    height:         15,
    borderRadius:   8,
    alignItems:     "center",
    justifyContent: "center",
  },
  badgeText:    { color: "#FFFFFF" },
  scroll:       { flex: 1 },
  content: {
    gap:               12,
    paddingVertical:   12,
    paddingHorizontal: 12,
  },
  bottomSpacer: { height: 8 },
});
