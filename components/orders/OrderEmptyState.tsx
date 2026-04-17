// ============================================================
// ORDER EMPTY STATE — Apana Store (Orders Component)
//
// Shown when the filtered order list is empty.
// Different copy for each filter context.
//
// Props:
//   filter — active OrderFilter key (drives copy)
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { OrderFilter } from "../../data/orderHistoryData";

interface OrderEmptyStateProps {
  filter: OrderFilter;
}

const COPY: Record<OrderFilter, { title: string; sub: string; icon: string }> = {
  all:       { title: "No orders yet",         sub: "Your order history will appear here once you place your first order.",   icon: "bag-outline"          },
  active:    { title: "No active orders",       sub: "You don't have any orders in progress right now.",                       icon: "bicycle-outline"      },
  delivered: { title: "No delivered orders",   sub: "Completed orders will show up here.",                                    icon: "bag-check-outline"    },
  cancelled: { title: "No cancelled orders",   sub: "Cancelled orders will appear here.",                                     icon: "close-circle-outline" },
};

export default function OrderEmptyState({ filter }: OrderEmptyStateProps) {
  const { colors } = useTheme();
  const copy       = COPY[filter];

  return (
    <View style={[styles.wrap, {
      backgroundColor: colors.card,
      borderColor:     colors.border,
    }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primary + "12" }]}>
        <Ionicons name={copy.icon as any} size={32} color={colors.primary} />
      </View>

      <Text style={[styles.title, {
        color:      colors.text,
        fontFamily: typography.fontFamily.semiBold,
        fontSize:   typography.size.md,
      }]}>
        {copy.title}
      </Text>

      <Text style={[styles.sub, {
        color:      colors.subText,
        fontFamily: typography.fontFamily.regular,
        fontSize:   typography.size.sm,
      }]}>
        {copy.sub}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems:   "center",
    gap:          12,
    padding:      32,
    borderRadius: 14,
    borderWidth:  1,
    marginTop:    8,
  },
  iconWrap: {
    width:          64,
    height:         64,
    borderRadius:   20,
    alignItems:     "center",
    justifyContent: "center",
  },
  title: { textAlign: "center" },
  sub:   { textAlign: "center", lineHeight: 20 },
});
