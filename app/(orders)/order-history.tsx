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
import { useCart, cartRowId } from "../../context/CartContext";
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
import { fetchOrderHistory, fetchReorder, reorderLineReason, ORDERS_LIVE } from "../../services/orderHistoryService";
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
  // Which order is mid-reorder. A tap on a slow connection must not look dead.
  const [reordering, setReordering] = useState<string | null>(null);
  const { addItem } = useCart();

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

  /**
   * Buy that basket again.
   *
   * 🔴 THIS USED TO LIE. It said "Items added to cart. (Backend integration
   * pending)" and added nothing — the customer went to their cart and found it
   * exactly as they left it. A false confirmation is worse than a missing
   * feature, because they stop looking for the thing that would have worked.
   *
   * The server reports what is still available at today's prices; the app adds
   * those lines and NAMES the ones it could not. A basket that comes back one
   * item short without saying so sends somebody to the counter for something
   * that was never coming.
   */
  // The shop name and invoice ride along so the chat header can say which
  // conversation this is before the thread has loaded — a blank header on a
  // slow connection is how a customer messages the wrong shop.
  function handleMessage(order: Order) {
    router.push(
      `/order-chat?orderId=` + encodeURIComponent(order.id) +
      `&invoice=` + encodeURIComponent(order.orderNo) +
      `&store=` + encodeURIComponent(order.storeName) as never,
    );
  }

  async function handleReorder(order: Order) {
    if (!customerId) return;
    setReordering(order.id);
    try {
      const r = await fetchReorder(order.id, customerId);

      const usable = r.lines.filter((l) => l.available);
      const missing = r.lines.filter((l) => !l.available);

      if (usable.length === 0) {
        Alert.alert(
          "Nothing left to reorder",
          missing.length > 0
            ? `${r.seller_name} no longer has any of these:\n\n` +
                missing
                  .map((l) => `• ${l.name} — ${reorderLineReason(l) ?? "unavailable"}`)
                  .join("\n")
            : "This order has no items to add.",
        );
        return;
      }

      for (const line of usable) {
        addItem({
          storeId: r.seller_id,
          storeName: r.seller_name,
          storeType: order.storeCategory,
          storeTypeColor: colors.primary,
          storeTypeBg: colors.primary + "15",
          fulfillment: order.mode === "pickup" ? "pickup" : "delivery",
          item: {
            id: cartRowId(line.product_id, line.variant_id),
            productId: line.product_id,
            variantId: line.variant_id,
            name: line.name,
            unit: "",
            // Paise → rupees, like every other money field crossing this line.
            price: (line.unit_price_cents ?? 0) / 100,
            qty: line.qty,
            maxQty: line.stock_qty ?? undefined,
            icon: "cube-outline",
            bg: colors.primary + "15",
          },
        });
      }

      // ⚠ The shop being SHUT is reported separately from stock. Both stop the
      // order, and the customer's next move is different: wait, or buy
      // elsewhere.
      const closedNote = r.store_is_open
        ? ""
        : `\n\n${r.seller_name} is ${r.store_closed_reason ?? "closed"} — you can order once it opens.`;

      Alert.alert(
        missing.length === 0 ? "Added to cart" : "Added what is still available",
        (missing.length === 0
          ? `${usable.length} item${usable.length === 1 ? "" : "s"} from ${r.seller_name}.`
          : `Added ${usable.length}. Not available:\n\n` +
            missing
              .map((l) => `• ${l.name} — ${reorderLineReason(l) ?? "unavailable"}`)
              .join("\n")) + closedNote,
      );
    } catch {
      // Never a silent failure: the customer is standing at an empty cart
      // wondering whether the tap registered.
      Alert.alert("Could not reorder", "Please check your connection and try again.");
    } finally {
      setReordering(null);
    }
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
                  onMessage={handleMessage}
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
