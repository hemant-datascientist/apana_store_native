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
    { icon: "shield-checkmark-outline", color: "#16A34A",     text: "All stores are verified & LIVE" },
    { icon: "time-outline",             color: colors.primary, text: "Estimated time shown at checkout" },
    { icon: "lock-closed-outline",      color: "#F59E0B",     text: "Secure payment — UPI, Card, COD" },
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
