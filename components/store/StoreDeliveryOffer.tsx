// The shop's free-delivery offer ("Free delivery" / "Free delivery above ₹X"), from the shop's own
// setting (backend 0162). Nothing is invented: a shop that did not offer it shows nothing.

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface Props {
  /** ₹; 0 = always free, null = the customer always pays. */
  freeAbove: number | null | undefined;
  /** Inside a list card: no side padding, smaller pill. */
  compact?: boolean;
}

export default function StoreDeliveryOffer({ freeAbove, compact }: Props) {
  const { colors } = useTheme();
  if (freeAbove == null) return null;
  const label = freeAbove === 0 ? "Free delivery" : `Free delivery above ₹${Math.round(freeAbove)}`;
  return (
    <View style={compact ? styles.compactWrap : styles.wrap}>
      <View style={[styles.pill, compact && styles.pillCompact, { backgroundColor: colors.success + "18", borderColor: colors.success + "55" }]}>
        <Ionicons name="bicycle" size={compact ? 12 : 14} color={colors.success} />
        <Text style={{ color: colors.success, fontFamily: typography.fontFamily.semiBold, fontSize: compact ? 10 : typography.size.xs }}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", paddingHorizontal: 16, paddingTop: 10 },
  compactWrap: { flexDirection: "row", marginTop: 4 },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },
  pillCompact: { gap: 4, paddingHorizontal: 7, paddingVertical: 2 },
});
