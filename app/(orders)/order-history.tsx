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

import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, Alert, StyleSheet,
} from "react-native";
import { SafeAreaView }   from "react-native-safe-area-context";
import { Ionicons }       from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter }      from "expo-router";
import useTheme           from "../../theme/useTheme";
import { typography }     from "../../theme/typography";
import {
  MOCK_ORDERS,
  ORDER_FILTER_TABS,
  ACTIVE_STATUSES,
  Order,
  OrderFilter,
} from "../../data/orderHistoryData";
import OrderFilterTabs  from "../../components/orders/OrderFilterTabs";
import OrderCard        from "../../components/orders/OrderCard";
import OrderEmptyState  from "../../components/orders/OrderEmptyState";

export default function OrderHistoryScreen() {
  const { colors } = useTheme();
  const router     = useRouter();

  const [activeFilter, setActiveFilter] = useState<OrderFilter>("all");
  const [orders]                        = useState<Order[]>(MOCK_ORDERS);

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
    Alert.alert("Track Order", `Live tracking for ${order.orderNo} coming soon.`);
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
        {filtered.length > 0
          ? filtered.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onTrack={handleTrack}
                onReorder={handleReorder}
              />
            ))
          : <OrderEmptyState filter={activeFilter} />
        }

      </ScrollView>
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
});
