// ============================================================
// BHARAT SCREEN — Apana Store (Customer App)
//
// The center hero tab. India Map powered by MapMyIndia (Mappls).
//
// Planned features:
//   - Full-screen India map with store pins by category
//   - LIVE status indicators (green pulse) for synced stores
//   - Store occupancy dots (Quiet / Moderate / Busy)
//   - "Closing Soon" orange glow (stores closing in < 60 min)
//   - Dual-mode toggle overlay: Find Stores ↔ Find Products
//   - Barcode Scanner FAB — Scan & Search local stock
//   - Tap a pin → mini store card with Pickup / Delivery / Ride CTAs
//   - Current location centering + radius slider
//
// Map provider: MapMyIndia (Mappls) JS SDK via WebView
// API Key: stored in data/bharatData.ts (move to .env pre-production)
// Data: GET /stores/nearby?lat=&lng=&radius=&category=
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export default function BharatScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        {/* Hero circle — matches the tab bar Bharat button color */}
        <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
          <Ionicons name="map" size={40} color="#fff" />
        </View>
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl }]}>
          Bharat
        </Text>
        <Text style={[styles.badge, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs, borderColor: colors.primary }]}>
          India Map Discovery
        </Text>
        <Text style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
          Live store pins, LIVE inventory status, occupancy, and barcode scan on India's full map — coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1 },
  center:     { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingHorizontal: 32 },
  iconCircle: { width: 84, height: 84, borderRadius: 28, justifyContent: "center", alignItems: "center" },
  title:      {},
  badge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  sub: { textAlign: "center", lineHeight: 22 },
});
