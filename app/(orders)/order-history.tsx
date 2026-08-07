// ============================================================
// ORDER HISTORY SCREEN — Apana Store (Customer App)
//
// Sections (top → bottom):
//   Header bar        — back + "Order History" + order count
//   OrderFilterTabs   — All | Active | Delivered | Cancelled
//   OrderCard list    — filtered cards with Track / Reorder CTA
//   OrderEmptyState   — shown when filtered list is empty
//
// State:
//   activeFilter — current tab key
//   orders       — full list (replace with API data)
//
// Filter logic:
//   "active"    → pending | confirmed | preparing | picked_up
//   "delivered" → delivered
//   "cancelled" → cancelled
//
// Backend: GET /customer/orders?status=all|active|delivered|cancelled
// ============================================================

import React, { useState, useMemo, useCallback } from "react";
import {
  View, Text, ScrollView, Alert, StyleSheet, ActivityIndicator,
} from "react-native";
import { SafeAreaView }   from "react-native-safe-area-context";
import { Ionicons }       from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import useTheme           from "../../theme/useTheme";
import { typography }     from "../../theme/typography";
import {
  ORDER_FILTER_TABS,
  ACTIVE_STATUSES,
  Order,
  OrderFilter,
} from "../../data/orderHistoryData";
import OrderFilterTabs  from "../../components/orders/OrderFilterTabs";
import OrderCard        from "../../components/orders/OrderCard";
import OrderEmptyState  from "../../components/orders/OrderEmptyState";
import RateStoreSheet   from "../../components/orders/RateStoreSheet";
import { submitStoreReview } from "../../services/reviewService";
import { fetchOrderHistory, ORDERS_LIVE } from "../../services/orderHistoryService";
import { useAuth } from "../../context/AuthContext";

export default function OrderHistoryScreen() {
  const { colors } = useTheme();
  const router     = useRouter();

  const [activeFilter, setActiveFilter] = useState<OrderFilter>("all");
  // REAL orders for THIS customer. Rendered MOCK_ORDERS before, so a tester
  // placed a real order and saw four invented ones from shops that do not
  // exist — the worst possible answer to "did my order go through?".
  const { user } = useAuth();
  const customerId = user?.phone ?? "";
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(ORDERS_LIVE);
  const [error,   setError]   = useState<string | null>(null);

  const loadOrders = useCallback(() => {
    if (!ORDERS_LIVE || !customerId) { setOrders([]); setLoading(false); return; }
    setLoading(true);
    setError(null);
    fetchOrderHistory(customerId)
      .then(setOrders)
      .catch((e) => {
        // Keep the list empty AND say why. A silent empty list reads as "you
        // have never ordered", which is a lie when the network simply failed.
        setOrders([]);
        setError(e instanceof Error ? e.message : "Could not load your orders.");
      })
      .finally(() => setLoading(false));
  }, [customerId]);

  // Refetch on focus: coming back from checkout, the new order is on the server.
  useFocusEffect(loadOrders);
  const [rateOrder, setRateOrder]       = useState<Order | null>(null);
  const [rating,    setRating]          = useState(false);

  // ── Filter orders by tab ──────────────────────────────────────
  const filtered = useMemo(() => {
    switch (activeFilter) {
      case "active":    return orders.filter(o => ACTIVE_STATUSES.includes(o.status));
      case "delivered": return orders.filter(o => o.status === "delivered");
      case "cancelled": return orders.filter(o => o.status === "cancelled");
      default:          return orders;
    }
  }, [activeFilter, orders]);

  // ── Actions ───────────────────────────────────────────────────
  function handleTrack(order: Order) {
    // Build a minimal StoreOrderResult so order-tracking can render
    // the store list / QR flow. Real data comes from backend later.
    const storeOrders = [{
      storeOrderId:   order.id,
      storeId:        order.storeId,
      storeName:      order.storeName,
      subtotal:       order.total,
      estimatedMins:  15,
    }];
    const so = encodeURIComponent(JSON.stringify(storeOrders));
    router.push(
      `/order-tracking?mode=${order.mode}&orderId=${order.id}&total=${order.total}&storeOrdersJson=${so}` as any,
    );
  }

  function handleReorder(order: Order) {
    Alert.alert(
      "Reorder",
      `Add items from ${order.storeName} to your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reorder", onPress: () =>
            Alert.alert("Added", "Items added to cart. (Backend integration pending)") },
      ],
    );
  }

  // Rate store — opens the sheet; submit posts to the review service. The BE
  // gate (a delivered order from this store) keeps ratings honest; here the
  // order is already delivered so the buyer qualifies.
  async function handleSubmitRating(stars: number, comment: string) {
    if (!rateOrder) return;
    setRating(true);
    try {
      await submitStoreReview(rateOrder.storeId, stars, comment || undefined, rateOrder.id);
      setRateOrder(null);
      Alert.alert("Thanks!", "Your rating helps other shoppers.");
    } catch {
      Alert.alert("Couldn't submit", "Please try again in a moment.");
    } finally {
      setRating(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>

      {/* ── Header ── */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, {
            color:      colors.text,
            fontFamily: typography.fontFamily.bold,
            fontSize:   typography.size.lg,
          }]}>
            Order History
          </Text>
          {orders.length > 0 && (
            <Text style={[styles.headerCount, {
              color:      colors.subText,
              fontFamily: typography.fontFamily.regular,
              fontSize:   typography.size.xs,
            }]}>
              {orders.length} orders
            </Text>
          )}
        </View>

        {/* Spacer keeps title left-of-center */}
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* ── Filter tabs ── */}
        <OrderFilterTabs
          tabs={ORDER_FILTER_TABS}
          active={activeFilter}
          onChange={setActiveFilter}
        />

        {/* ── Order cards ── */}
        {/* Four distinct states. "Signed out", "loading", "failed" and "you
            have no orders" are different facts, and collapsing them into one
            empty card is how a tester reports "my order vanished" when they
            were simply logged out or offline. */}
        {loading && <ActivityIndicator color={colors.primary} style={styles.notice} />}

        {!loading && error && (
          <View style={styles.notice}>
            <Text style={[styles.noticeText, { color: colors.danger, fontFamily: typography.fontFamily.medium }]}>
              {error}
            </Text>
            <TouchableOpacity onPress={loadOrders} activeOpacity={0.8}>
              <Text style={[styles.retry, { color: colors.primary, fontFamily: typography.fontFamily.semiBold }]}>
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && !customerId && (
          <Text style={[styles.notice, styles.noticeText, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
            Sign in to see your orders.
          </Text>
        )}

        {!loading && !error && customerId && (
          filtered.length > 0
            ? filtered.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onTrack={handleTrack}
                  onReorder={handleReorder}
                  onRate={setRateOrder}
                />
              ))
            : <OrderEmptyState filter={activeFilter} />
        )}

      </ScrollView>

      {/* Rate-store bottom sheet */}
      <RateStoreSheet
        visible={rateOrder !== null}
        storeName={rateOrder?.storeName ?? ""}
        submitting={rating}
        onClose={() => setRateOrder(null)}
        onSubmit={handleSubmitRating}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // ── Header ──
  header: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 16,
    paddingVertical:   14,
    borderBottomWidth: 1,
  },
  backBtn:      { width: 36 },
  headerCenter: { flex: 1, alignItems: "center", gap: 1 },
  headerTitle:  {},
  headerCount:  {},

  // ── Scroll ──
  content: {
    paddingHorizontal: 16,
    paddingTop:        16,
    paddingBottom:     40,
    gap:               12,
  },

  notice: {
    alignItems:     "center",
    marginVertical: 28,
    paddingHorizontal: 24,
    gap:            10,
  },
  noticeText: {
    fontSize:   13,
    lineHeight: 20,
    textAlign:  "center",
  },
  retry: {
    fontSize: 14,
  },
});
