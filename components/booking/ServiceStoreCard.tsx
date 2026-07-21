// ============================================================
// SERVICE STORE CARD — one shop on the "Book a service" list.
//
// Shows the count of services it actually offers and its cheapest price.
// Both come from the store's real offerings, so a shop that has listed
// nothing never appears here at all.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { ServiceStore } from "../../services/bookingService";

interface ServiceStoreCardProps {
  store: ServiceStore;
  onPress: (id: string) => void;
}

function ServiceStoreCard({ store, onPress }: ServiceStoreCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onPress(store.id)}
      activeOpacity={0.85}
    >
      <View style={[styles.icon, { backgroundColor: colors.primary + "15" }]}>
        <Ionicons name="construct-outline" size={22} color={colors.primary} />
      </View>

      <View style={styles.body}>
        <Text numberOfLines={1} style={[styles.name, {
          color: colors.text,
          fontFamily: typography.fontFamily.semiBold,
          fontSize: typography.size.md,
        }]}>
          {store.name}
        </Text>

        <Text numberOfLines={1} style={[styles.meta, {
          color: colors.subText, fontFamily: typography.fontFamily.regular,
        }]}>
          {store.city} · {store.offeringCount} service{store.offeringCount === 1 ? "" : "s"} · from ₹{store.fromPrice.toFixed(0)}
        </Text>

        {store.atHome && (
          <View style={[styles.badge, { backgroundColor: colors.success + "1A" }]}>
            <Ionicons name="home-outline" size={11} color={colors.success} />
            <Text style={[styles.badgeText, { color: colors.success, fontFamily: typography.fontFamily.semiBold }]}>
              Comes to you
            </Text>
          </View>
        )}
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.subText} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  icon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, gap: 3 },
  name: {},
  meta: { fontSize: typography.size.xs },
  badge: {
    flexDirection: "row", alignItems: "center", gap: 3, alignSelf: "flex-start",
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 20, marginTop: 2,
  },
  badgeText: { fontSize: typography.size.ss },
});

export default React.memo(ServiceStoreCard);
