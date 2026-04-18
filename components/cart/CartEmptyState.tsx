// ============================================================
// CART EMPTY STATE — Apana Store
//
// Shown when the cart has no items.
// Icon + headline + subtitle + 3 feature tips.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

const TIPS = [
  { icon: "storefront-outline",       text: "Shop from multiple stores" },
  { icon: "bicycle-outline",          text: "Choose Pickup, Delivery or Ride" },
  { icon: "shield-checkmark-outline", text: "Safe & verified local stores" },
] as const;

export default function CartEmptyState() {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: colors.primary + "12" }]}>
        <Ionicons name="bag-outline" size={56} color={colors.primary} />
      </View>

      {/* Copy */}
      <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
        Your cart is empty
      </Text>
      <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
        Browse stores and add items to get started. Your multi-store cart will appear here.
      </Text>

      {/* Feature tips */}
      <View style={styles.tips}>
        {TIPS.map(tip => (
          <View key={tip.icon} style={styles.tip}>
            <Ionicons name={tip.icon} size={16} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {tip.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex:              1,
    alignItems:        "center",
    justifyContent:    "center",
    paddingHorizontal: 32,
    gap:               14,
  },
  iconWrap: {
    width:          110,
    height:         110,
    borderRadius:   32,
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   8,
  },
  title: { textAlign: "center" },
  sub:   { textAlign: "center", lineHeight: 22 },
  tips:  { gap: 10, marginTop: 6, alignSelf: "stretch" },
  tip:   { flexDirection: "row", alignItems: "center", gap: 10 },
  tipText: { flex: 1, lineHeight: 18 },
});
