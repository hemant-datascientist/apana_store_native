// The shop's delivery offer, shown under its name: "Free delivery" (or "Free delivery above ₹X")
// and its minimum order for delivery. Both come from the shop's own settings (backend 0162) - nothing
// here is invented, and a shop that set nothing shows nothing.

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface Props {
  /** ₹; 0 = always free, null = the customer always pays. */
  freeAbove: number | null;
  /** ₹; null = delivered at any order size. */
  minOrder: number | null;
}

export default function StoreDeliveryOffer({ freeAbove, minOrder }: Props) {
  const { colors } = useTheme();
  if (freeAbove == null && minOrder == null) return null;
  const free = freeAbove == null ? null : freeAbove === 0 ? "Free delivery" : `Free delivery above ₹${Math.round(freeAbove)}`;
  const min = minOrder == null ? null : `Delivery on orders of ₹${Math.round(minOrder)} or more`;
  return (
    <View style={styles.wrap}>
      {free && (
        <View style={[styles.pill, { backgroundColor: colors.success + "18", borderColor: colors.success + "55" }]}>
          <Ionicons name="bicycle" size={14} color={colors.success} />
          <Text style={{ color: colors.success, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }}>{free}</Text>
        </View>
      )}
      {min && (
        <View style={[styles.pill, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={14} color={colors.subText} />
          <Text style={{ color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }}>{min}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 16, paddingTop: 10 },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },
});
