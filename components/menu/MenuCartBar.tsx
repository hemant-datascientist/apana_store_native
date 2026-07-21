// ============================================================
// MENU CART BAR — the sticky basket at the foot of a kitchen's menu.
//
// The total shown is the EVERYDAY total. A dish deal only unlocks once the
// basket crosses the shop's threshold, and that decision is the backend's
// (modules/orders/src/pricing.ts) — so the bar promises the honest upper
// bound and the order confirmation shows what was actually charged.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface MenuCartBarProps {
  itemCount: number;
  total: number; // rupees
  placing: boolean;
  onPlace: () => void;
}

export default function MenuCartBar({ itemCount, total, placing, onPlace }: MenuCartBarProps) {
  const { colors } = useTheme();
  if (itemCount === 0) return null;

  return (
    <View style={[styles.bar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <View style={styles.info}>
        <Text style={[styles.count, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
          {itemCount} item{itemCount === 1 ? "" : "s"}
        </Text>
        <Text style={[styles.total, {
          color: colors.text,
          fontFamily: typography.fontFamily.bold,
          fontSize: typography.size.lg,
        }]}>
          ₹{total.toFixed(0)}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.cta, { backgroundColor: colors.primary }]}
        onPress={onPlace}
        disabled={placing}
        activeOpacity={0.85}
      >
        {placing ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            <Text style={[styles.ctaText, { color: colors.white, fontFamily: typography.fontFamily.semiBold }]}>
              Place order
            </Text>
            <Ionicons name="arrow-forward" size={17} color={colors.white} />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  info: { flex: 1 },
  count: { fontSize: typography.size.xs },
  total: {},
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },
  ctaText: { fontSize: typography.size.md },
});
