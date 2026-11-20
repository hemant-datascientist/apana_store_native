// ============================================================
// CART TRUST INFO — Apana Store
//
// Three-line trust card shown below the price breakdown:
// verified stores, estimated time, and secure payment note.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export default function CartTrustInfo() {
  const { colors } = useTheme();

  const TIPS = [
    // Only what is true for every order: shops are not KYC-verified yet, and how you can pay
    // depends on the shop (shown at payment), so neither "verified" nor "UPI, Card" is claimed.
    { icon: "storefront-outline",       color: "#16A34A",     text: "Ordered straight from shops near you" },
    { icon: "time-outline",             color: colors.primary, text: "Time shown at checkout when the shop's is known" },
    { icon: "wallet-outline",           color: "#F59E0B",     text: "How you can pay is shown at payment" },
  ] as const;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {TIPS.map(tip => (
        <View key={tip.icon} style={styles.row}>
          <Ionicons name={tip.icon} size={15} color={tip.color} />
          <Text style={[styles.text, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {tip.text}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth:  1,
    padding:      14,
    gap:          10,
  },
  row: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
  },
  text: { flex: 1, lineHeight: 17 },
});
