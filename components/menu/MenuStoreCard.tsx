// ============================================================
// MENU STORE CARD — one kitchen on the "Order food" list.
//
// The veg / non-veg dots are the Indian standard and often the first thing
// scanned, so they sit with the name, not buried in a filter.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { MenuStore } from "../../services/menuService";

const VEG_GREEN = "#16A34A";
const NONVEG_RED = "#DC2626";

interface MenuStoreCardProps {
  store: MenuStore;
  onPress: (id: string) => void;
}

function DietDot({ color }: { color: string }) {
  return (
    <View style={[styles.dietBox, { borderColor: color }]}>
      <View style={[styles.dietDot, { backgroundColor: color }]} />
    </View>
  );
}

function MenuStoreCard({ store, onPress }: MenuStoreCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onPress(store.id)}
      activeOpacity={0.85}
    >
      <View style={[styles.icon, { backgroundColor: colors.warning + "1F" }]}>
        <Ionicons name="restaurant-outline" size={22} color={colors.warning} />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={[styles.name, {
            color: colors.text,
            fontFamily: typography.fontFamily.semiBold,
            fontSize: typography.size.md,
          }]}>
            {store.name}
          </Text>
          {store.hasVeg && <DietDot color={VEG_GREEN} />}
          {store.hasNonveg && <DietDot color={NONVEG_RED} />}
        </View>

        <Text numberOfLines={1} style={[styles.meta, {
          color: colors.subText, fontFamily: typography.fontFamily.regular,
        }]}>
          {store.city} · {store.dishCount} dish{store.dishCount === 1 ? "" : "es"} today · from ₹{store.fromPrice.toFixed(0)}
        </Text>
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
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { flexShrink: 1 },
  meta: { fontSize: typography.size.xs },
  dietBox: {
    width: 13, height: 13, borderWidth: 1.5, borderRadius: 2,
    alignItems: "center", justifyContent: "center",
  },
  dietDot: { width: 6, height: 6, borderRadius: 3 },
});

export default React.memo(MenuStoreCard);
