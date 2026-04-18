// ============================================================
// CART CHECKOUT BAR — Apana Store
//
// Sticky bottom bar showing total + store/item summary
// and the "Proceed to Checkout" CTA button.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface CartCheckoutBarProps {
  total:       number;
  cartLength:  number;
  totalItems:  number;
  onCheckout:  () => void;
}

export default function CartCheckoutBar({ total, cartLength, totalItems, onCheckout }: CartCheckoutBarProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.bar, { backgroundColor: colors.card, borderTopColor: colors.border }]}
      edges={["bottom"]}
    >
      <View style={styles.content}>
        {/* Total summary */}
        <View>
          <Text style={[styles.total, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
            ₹{total}
          </Text>
          <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: 10.5 }]}>
            {cartLength} store{cartLength > 1 ? "s" : ""} · {totalItems} item{totalItems > 1 ? "s" : ""}
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={onCheckout}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            Proceed to Checkout
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bar: {
    position:        "absolute",
    bottom:          0,
    left:            0,
    right:           0,
    borderTopWidth:  1,
  },
  content: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    paddingVertical:   12,
    gap:               12,
  },
  total: {},
  sub:   {},
  btn: {
    flex:              1,
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "center",
    gap:               8,
    paddingVertical:   13,
    borderRadius:      14,
  },
  btnText: { color: "#fff" },
});
