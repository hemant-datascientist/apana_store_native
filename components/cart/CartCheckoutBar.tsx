// ============================================================
// CART CHECKOUT BAR — Apana Store
//
// Sticky bottom bar with ONE button per fulfillment mode group.
// A customer can't simultaneously do a pickup, wait for delivery,
// and ride — so each mode produces a separate checkout flow.
//
// Each button shows:
//   mode icon + label · N store(s) · total → Checkout
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { FulfillmentMode, FULFILLMENT_CONFIG } from "../../data/cartData";

// ── One group = all stores sharing the same fulfillment mode ──

export interface FulfillmentGroup {
  mode:       FulfillmentMode;
  storeCount: number;
  itemCount:  number;
  total:      number;
}

interface CartCheckoutBarProps {
  groups:     FulfillmentGroup[];
  onCheckout: (mode: FulfillmentMode) => void;
}

export default function CartCheckoutBar({ groups, onCheckout }: CartCheckoutBarProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.bar, { backgroundColor: colors.card, borderTopColor: colors.border }]}
      edges={["bottom"]}
    >
      <View style={styles.inner}>
        {groups.map((group, idx) => {
          const cfg = FULFILLMENT_CONFIG[group.mode];

          return (
            <TouchableOpacity
              key={group.mode}
              style={[
                styles.btn,
                { backgroundColor: cfg.color },
                // subtle top separator between stacked buttons
                idx > 0 && { marginTop: 8 },
              ]}
              onPress={() => onCheckout(group.mode)}
              activeOpacity={0.85}
            >
              {/* Left: mode icon + label + meta */}
              <View style={styles.btnLeft}>
                <View style={[styles.modeIcon, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                  <Ionicons name={cfg.icon as any} size={16} color="#fff" />
                </View>
                <View>
                  <Text style={[styles.modeLabel, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
                    {cfg.label} Order
                  </Text>
                  <Text style={[styles.modeMeta, { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                    {group.storeCount} store{group.storeCount > 1 ? "s" : ""} · {group.itemCount} item{group.itemCount > 1 ? "s" : ""}
                  </Text>
                </View>
              </View>

              {/* Right: total + arrow */}
              <View style={styles.btnRight}>
                <Text style={[styles.btnTotal, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
                  ₹{group.total}
                </Text>
                <Ionicons name="arrow-forward-circle" size={22} color="#fff" />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bar: {
    position:       "absolute",
    bottom:         0,
    left:           0,
    right:          0,
    borderTopWidth: 1,
  },
  inner: {
    paddingHorizontal: 16,
    paddingVertical:   12,
  },

  btn: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 14,
    paddingVertical:   12,
    borderRadius:      14,
  },

  btnLeft: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           10,
  },
  modeIcon: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },
  modeLabel: { color: "#fff" },
  modeMeta:  { color: "rgba(255,255,255,0.8)", marginTop: 1 },

  btnRight: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
  },
  btnTotal: { color: "#fff" },
});
