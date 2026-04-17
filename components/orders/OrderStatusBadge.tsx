// ============================================================
// ORDER STATUS BADGE — Apana Store (Orders Component)
//
// Pill-shaped badge showing the current order status.
// Color is driven by ORDER_STATUS_META colorKey → theme token.
//
// Props:
//   status — OrderStatus
//   small  — (optional) reduced padding for compact contexts
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { OrderStatus, ORDER_STATUS_META } from "../../data/orderHistoryData";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  small?: boolean;
}

export default function OrderStatusBadge({ status, small }: OrderStatusBadgeProps) {
  const { colors } = useTheme();
  const meta       = ORDER_STATUS_META[status];

  // Map colorKey to a real color from theme
  const colorMap: Record<string, string> = {
    success:  colors.success,
    primary:  colors.primary,
    warning:  "#F59E0B",   // amber — no warning token yet in theme
    danger:   colors.danger,
    subText:  colors.subText,
  };
  const color = colorMap[meta.colorKey] ?? colors.subText;

  return (
    <View style={[
      styles.badge,
      small && styles.badgeSmall,
      { backgroundColor: color + "18", borderColor: color + "40" },
    ]}>
      <Ionicons name={meta.icon as any} size={small ? 11 : 12} color={color} />
      <Text style={[styles.label, small && styles.labelSmall, {
        color,
        fontFamily: typography.fontFamily.semiBold,
        fontSize:   small ? typography.size.xs - 1 : typography.size.xs,
      }]}>
        {meta.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
    borderWidth:       1,
    alignSelf:         "flex-start",
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical:   3,
  },
  label:      {},
  labelSmall: {},
});
