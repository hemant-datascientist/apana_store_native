// ============================================================
// CHECKOUT ADDRESS CARD — Apana Store
//
// Shows the currently selected delivery address with a
// "Change" button that opens the address picker modal.
// Pickup-only orders show a note instead of address.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { UserAddress } from "../../data/addressData";

interface CheckoutAddressCardProps {
  address:    UserAddress;
  onChangePress: () => void;
}

export default function CheckoutAddressCard({ address, onChangePress }: CheckoutAddressCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Section title row ── */}
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Ionicons name="location-outline" size={16} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
            Delivery Address
          </Text>
        </View>
        <TouchableOpacity onPress={onChangePress} activeOpacity={0.7} style={styles.changeBtn}>
          <Text style={[styles.changeText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
            Change
          </Text>
          <Ionicons name="chevron-forward" size={13} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* ── Divider ── */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Address body ── */}
      <View style={styles.addressBody}>

        {/* Label pill (Home / Work / etc.) */}
        <View style={[styles.labelPill, { backgroundColor: colors.primary + "14" }]}>
          <Ionicons name={address.icon as any} size={12} color={colors.primary} />
          <Text style={[styles.labelText, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
            {address.label}
          </Text>
        </View>

        {/* Recipient name */}
        {address.name && (
          <Text style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm }]}>
            {address.name}
          </Text>
        )}

        {/* Address lines */}
        <Text style={[styles.line, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {address.line1}, {address.line2}
        </Text>
        <Text style={[styles.line, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {address.city}, {address.state} — {address.pincode}
        </Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth:  1,
    overflow:     "hidden",
  },

  // Title row
  titleRow: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 14,
    paddingVertical:   12,
  },
  titleLeft: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           7,
  },
  title: {},
  changeBtn: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           2,
  },
  changeText: {},

  divider: { height: 1 },

  // Address body
  addressBody: {
    padding: 14,
    gap:     6,
  },
  labelPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    alignSelf:         "flex-start",
    paddingHorizontal: 9,
    paddingVertical:   3,
    borderRadius:      20,
    marginBottom:      2,
  },
  labelText: {},
  name:      {},
  line:      { lineHeight: 18 },
});
