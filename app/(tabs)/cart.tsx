// ============================================================
// CART SCREEN — Apana Store (Customer App)
//
// Planned features:
//   - Multi-store cart (items from up to 5 stores)
//   - Route optimizer (traffic-aware pickup sequence)
//   - OOS item alerts with swap suggestions
//   - Fulfillment mode selection per store (Pickup/Delivery/Ride)
//   - Order summary + checkout
//
// Replace placeholder with full implementation.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export default function CartScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary + "15" }]}>
          <Ionicons name="bag-outline" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
          Cart
        </Text>
        <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
          Multi-store cart, route optimizer, and checkout coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1 },
  center:     { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingHorizontal: 32 },
  iconCircle: { width: 84, height: 84, borderRadius: 24, justifyContent: "center", alignItems: "center" },
  title:      {},
  sub:        { textAlign: "center", lineHeight: 22 },
});
