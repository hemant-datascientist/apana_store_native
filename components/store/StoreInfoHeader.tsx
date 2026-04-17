// ============================================================
// STORE INFO HEADER — Apana Store (Store Detail Component)
//
// Store name, tagline, address, and open/closed status.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { StoreDetail } from "../../data/storeDetailData";

interface StoreInfoHeaderProps {
  store: StoreDetail;
}

export default function StoreInfoHeader({ store }: StoreInfoHeaderProps) {
  const { colors } = useTheme();

  const statusColor = store.isOpen ? colors.success : colors.danger;
  const statusText  = store.isOpen
    ? `Open Now  ·  Closes at ${store.closesAt}`
    : `Closed  ·  Opens at ${store.opensAt}`;

  return (
    <View style={styles.wrap}>
      {/* Name */}
      <Text style={[styles.name, {
        color:      colors.text,
        fontFamily: typography.fontFamily.bold,
        fontSize:   typography.size.xl,
      }]}>
        {store.name}
      </Text>

      {/* Tagline */}
      <Text style={[styles.tagline, {
        color:      colors.subText,
        fontFamily: typography.fontFamily.regular,
        fontSize:   typography.size.sm,
      }]}>
        {store.tagline}
      </Text>

      {/* Address */}
      <View style={styles.addressRow}>
        <Ionicons name="location-outline" size={14} color={colors.subText} />
        <Text style={[styles.address, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.sm,
        }]}>
          {store.address}, {store.city}, {store.state} – {store.pincode}
        </Text>
      </View>

      {/* Open/Closed status */}
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={[styles.statusText, {
          color:      statusColor,
          fontFamily: typography.fontFamily.semiBold,
          fontSize:   typography.size.sm,
        }]}>
          {statusText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 16, gap: 6 },

  name:    {},
  tagline: {},

  addressRow: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           4,
    marginTop:     2,
  },
  address: { flex: 1, lineHeight: 20 },

  statusRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
    marginTop:     2,
  },
  statusDot: {
    width:        8,
    height:       8,
    borderRadius: 4,
  },
  statusText: {},
});
