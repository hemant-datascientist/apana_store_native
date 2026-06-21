// ============================================================
// CART DISCOUNT BAR — Apana Store
//
// Per-store "stop-loss" discount strip in the cart:
//   • basket unlocked → green "you saved ₹X with bulk price"
//   • not yet         → amber "add ₹Y more to save ₹Z" + progress bar
//   • no deal on this store → renders nothing
//
// Driven by lib/discount.resolveStoreDiscount(store).
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { StoreDiscount } from "../../lib/discount";

interface CartDiscountBarProps {
  disc: StoreDiscount;
}

export default function CartDiscountBar({ disc }: CartDiscountBarProps) {
  const { colors } = useTheme();

  // No threshold / no discountable item → nothing to show.
  if (disc.threshold == null) return null;

  // ── Unlocked: celebrate the saving ──────────────────────────
  if (disc.unlocked && disc.savings > 0) {
    return (
      <View style={[styles.bar, { backgroundColor: "#DCFCE7", borderColor: "#86EFAC" }]}>
        <Ionicons name="pricetags" size={15} color="#15803D" />
        <Text style={[styles.text, { color: "#15803D", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
          Bulk price unlocked — you saved ₹{disc.savings} on this shop
        </Text>
      </View>
    );
  }

  // ── Not yet: nudge toward the threshold ─────────────────────
  if (disc.remaining > 0 && disc.potential > 0) {
    const pct = disc.threshold > 0 ? Math.min(1, disc.subtotal / disc.threshold) : 0;
    return (
      <View style={[styles.bar, styles.barColumn, { backgroundColor: colors.warning + "14", borderColor: colors.warning + "44" }]}>
        <View style={styles.nudgeRow}>
          <Ionicons name="rocket-outline" size={15} color={colors.warning} />
          <Text style={[styles.text, { color: colors.text, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
            Add ₹{disc.remaining} more to save ₹{disc.potential}
          </Text>
        </View>
        {/* progress */}
        <View style={[styles.track, { backgroundColor: colors.warning + "26" }]}>
          <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: colors.warning }]} />
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  bar: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    marginHorizontal:  12,
    marginBottom:      4,
    paddingHorizontal: 10,
    paddingVertical:   8,
    borderRadius:      10,
    borderWidth:       1,
  },
  barColumn: {
    flexDirection: "column",
    alignItems:    "stretch",
    gap:           7,
  },
  nudgeRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           7,
  },
  text: { flex: 1 },
  track: {
    height:       5,
    borderRadius: 3,
    overflow:     "hidden",
  },
  fill: {
    height:       "100%",
    borderRadius: 3,
  },
});
