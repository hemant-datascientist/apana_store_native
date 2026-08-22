// ============================================================
// OFFER ZONE — Apana Store (Customer App)
//
// Real deals from real shops near the customer, grouped by shop because the
// unlock threshold is per shop.
//
// 🔴 This screen used to render data/offerZoneData.ts: fourteen invented
// discounts attributed to named businesses ("20% off fresh vegetables —
// Sharma General Store", "Flat ₹500 off — TechZone Electronics"), plus four
// invented sale "events" with store and deal counts. None of it existed. A
// customer acting on one of those would have arrived at a real counter
// expecting a discount the shopkeeper never offered.
//
// Every price here comes from the stop-loss deal engine, which is the same
// thing checkout charges. Empty is empty (§19.8).
// ============================================================

import React from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { useNearbyDeals, savingOn, type ShopDeals } from "../../hooks/useNearbyDeals";
import StateView from "../../components/ui/StateView";
import { SkeletonList } from "../../components/ui/Skeleton";
import type { LiveProduct } from "../../services/liveCatalogService";

const ACCENT = "#F97316";

export default function OfferZoneScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { shops, dealCount, loading, isEmpty } = useNearbyDeals();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={ACCENT} />

      <SafeAreaView style={[styles.header, { backgroundColor: ACCENT }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
              Offer Zone
            </Text>
            {/* The count is the real number of discounted listings, not a
                round marketing figure. No deals = no subtitle at all. */}
            {dealCount > 0 ? (
              <Text style={[styles.headerSub, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {dealCount} {dealCount === 1 ? "deal" : "deals"} from {shops.length}{" "}
                {shops.length === 1 ? "shop" : "shops"} near you
              </Text>
            ) : null}
          </View>

          <View style={[styles.iconBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Ionicons name="pricetags-outline" size={18} color="#fff" />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {loading ? (
          <View style={styles.section}>
            <SkeletonList count={4} />
          </View>
        ) : isEmpty ? (
          <StateView
            variant="empty"
            title="No deals right now"
            message="No shop near you has set a lower price on anything today. We only show real prices set by real shops, so there is nothing to list."
          />
        ) : (
          shops.map((shop) => (
            <ShopDealGroup
              key={shop.storeId}
              shop={shop}
              onShop={() => router.push(`/store-detail?id=${shop.storeId}` as never)}
              onProduct={(p) => router.push(`/live-product-detail?id=${p.id}` as never)}
            />
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

function ShopDealGroup({
  shop,
  onShop,
  onProduct,
}: {
  shop: ShopDeals;
  onShop: () => void;
  onProduct: (p: LiveProduct) => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.shopHeader} onPress={onShop} activeOpacity={0.7}>
        <Ionicons name="storefront-outline" size={16} color={ACCENT} />
        <Text
          style={[styles.shopName, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}
          numberOfLines={1}
        >
          {shop.storeName}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.subText} />
      </TouchableOpacity>

      {/* The CONDITION, stated before the prices rather than in small print.
          Without it these are not the prices the customer will be charged. */}
      <Text style={[styles.condition, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
        {shop.unlockThreshold != null
          ? `Deal prices apply once your basket from this shop reaches ₹${shop.unlockThreshold}.`
          : "These prices apply to any order from this shop."}
      </Text>

      {shop.products.map((p) => (
        <DealRow key={p.id} product={p} onPress={() => onProduct(p)} />
      ))}
    </View>
  );
}

function DealRow({ product, onPress }: { product: LiveProduct; onPress: () => void }) {
  const { colors } = useTheme();
  const saving = savingOn(product);
  // Percent is DERIVED from the two real prices, never a written "20% OFF".
  const pct = Math.round((saving / product.price) * 100);

  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, save ${saving} rupees`}
    >
      <View style={[styles.pctPill, { backgroundColor: ACCENT + "18" }]}>
        <Text style={[styles.pctText, { color: ACCENT, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          {pct}%
        </Text>
        <Text style={[styles.pctSub, { color: ACCENT, fontFamily: typography.fontFamily.medium, fontSize: typography.size.ss }]}>
          off
        </Text>
      </View>

      <View style={styles.body}>
        <Text
          style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}
          numberOfLines={2}
        >
          {product.name}
        </Text>
        <Text style={[styles.unit, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {product.unit}
        </Text>
      </View>

      <View style={styles.priceCol}>
        <Text style={[styles.deal, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          ₹{product.dealPrice}
        </Text>
        <Text style={[styles.was, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
          ₹{product.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {},
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { flex: 1 },
  headerTitle: { color: "#fff" },
  headerSub: { color: "rgba(255,255,255,0.75)", marginTop: 2 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: { gap: 22, paddingVertical: 20 },
  section: { paddingHorizontal: 16, gap: 8 },

  shopHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  shopName: { flex: 1 },
  condition: { marginBottom: 4, lineHeight: 17 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  pctPill: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pctText: { lineHeight: 18 },
  pctSub: { lineHeight: 12 },
  body: { flex: 1, gap: 2 },
  name: {},
  unit: {},
  priceCol: { alignItems: "flex-end", gap: 1 },
  deal: {},
  was: { textDecorationLine: "line-through" },
});
