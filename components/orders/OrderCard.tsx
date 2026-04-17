// ============================================================
// ORDER CARD — Apana Store (Orders Component)
//
// Full-width card showing one order summary:
//   • Store icon + name + category + date
//   • Status badge
//   • Item summary (first item name + overflow count)
//   • Total + payment method
//   • Divider + action row: "Track Order" (active) or "Reorder"
//
// Props:
//   order     — Order
//   onTrack   — called for active orders
//   onReorder — called for completed/cancelled orders
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons }       from "@expo/vector-icons";
import useTheme           from "../../theme/useTheme";
import { typography }     from "../../theme/typography";
import { Order, ACTIVE_STATUSES } from "../../data/orderHistoryData";
import OrderStatusBadge   from "./OrderStatusBadge";

interface OrderCardProps {
  order:     Order;
  onTrack:   (order: Order) => void;
  onReorder: (order: Order) => void;
}

export default function OrderCard({ order, onTrack, onReorder }: OrderCardProps) {
  const { colors } = useTheme();
  const isActive   = ACTIVE_STATUSES.includes(order.status);

  // Build item summary: "Tata Salt 1 kg +2 more"
  const firstItem     = order.items[0];
  const overflowCount = order.items.length - 1;
  const itemSummary   = overflowCount > 0
    ? `${firstItem.name}  +${overflowCount} more`
    : firstItem.name;

  return (
    <View style={[styles.card, {
      backgroundColor: colors.card,
      borderColor:     colors.border,
    }]}>

      {/* ── Top row: icon + store info + status badge ── */}
      <View style={styles.topRow}>
        <View style={[styles.storeIcon, { backgroundColor: colors.primary + "15" }]}>
          <Ionicons name={order.storeIcon as any} size={20} color={colors.primary} />
        </View>

        <View style={styles.storeInfo}>
          <Text style={[styles.storeName, {
            color:      colors.text,
            fontFamily: typography.fontFamily.semiBold,
            fontSize:   typography.size.sm,
          }]} numberOfLines={1}>
            {order.storeName}
          </Text>
          <Text style={[styles.storeMeta, {
            color:      colors.subText,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.xs,
          }]}>
            {order.storeCategory}  ·  {order.date}
          </Text>
        </View>

        <OrderStatusBadge status={order.status} small />
      </View>

      {/* ── Divider ── */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Order detail row ── */}
      <View style={styles.detailRow}>
        {/* Order number */}
        <Text style={[styles.orderNo, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.xs,
        }]}>
          {order.orderNo}
        </Text>

        {/* Items summary */}
        <Text style={[styles.items, {
          color:      colors.text,
          fontFamily: typography.fontFamily.medium,
          fontSize:   typography.size.sm,
        }]} numberOfLines={1}>
          {itemSummary}
        </Text>

        {/* Total + payment */}
        <View style={styles.totalRow}>
          <Text style={[styles.total, {
            color:      colors.text,
            fontFamily: typography.fontFamily.bold,
            fontSize:   typography.size.sm,
          }]}>
            ₹{order.total.toLocaleString("en-IN")}
          </Text>
          <Text style={[styles.payment, {
            color:      colors.subText,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.xs,
          }]}>
            {order.paymentMethod}
          </Text>
        </View>
      </View>

      {/* ── Action row ── */}
      <View style={[styles.actionRow, { borderTopColor: colors.border }]}>
        {/* Address chip */}
        <View style={styles.addressChip}>
          <Ionicons name="location-outline" size={12} color={colors.subText} />
          <Text style={[styles.addressText, {
            color:      colors.subText,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.xs,
          }]} numberOfLines={1}>
            {order.deliveryAddress}
          </Text>
        </View>

        {/* CTA button */}
        {isActive
          ? (
            <TouchableOpacity
              style={[styles.cta, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
              onPress={() => onTrack(order)}
            >
              <Ionicons name="navigate-outline" size={14} color={colors.white} />
              <Text style={[styles.ctaLabel, {
                color:      colors.white,
                fontFamily: typography.fontFamily.semiBold,
                fontSize:   typography.size.xs,
              }]}>
                Track
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.cta, {
                backgroundColor: "transparent",
                borderWidth:     1,
                borderColor:     colors.primary,
              }]}
              activeOpacity={0.8}
              onPress={() => onReorder(order)}
            >
              <Ionicons name="refresh-outline" size={14} color={colors.primary} />
              <Text style={[styles.ctaLabel, {
                color:      colors.primary,
                fontFamily: typography.fontFamily.semiBold,
                fontSize:   typography.size.xs,
              }]}>
                Reorder
              </Text>
            </TouchableOpacity>
          )
        }
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth:  1,
    overflow:     "hidden",
  },

  // ── Top row ──
  topRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    padding:           14,
    paddingBottom:     12,
  },
  storeIcon: {
    width:          40,
    height:         40,
    borderRadius:   11,
    alignItems:     "center",
    justifyContent: "center",
  },
  storeInfo:  { flex: 1 },
  storeName:  {},
  storeMeta:  { marginTop: 2 },

  divider: { height: 1, marginHorizontal: 14 },

  // ── Detail row ──
  detailRow: {
    paddingHorizontal: 14,
    paddingVertical:   12,
    gap:               4,
  },
  orderNo:   {},
  items:     {},
  totalRow:  { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  total:     {},
  payment:   {},

  // ── Action row ──
  actionRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 14,
    paddingVertical:   10,
    borderTopWidth:    1,
    gap:               8,
  },
  addressChip: {
    flex:          1,
    flexDirection: "row",
    alignItems:    "center",
    gap:           4,
  },
  addressText: { flex: 1 },
  cta: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    paddingHorizontal: 12,
    paddingVertical:   7,
    borderRadius:      8,
  },
  ctaLabel: {},
});
