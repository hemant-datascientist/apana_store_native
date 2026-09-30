// ============================================================
// STORE INFO HEADER — Apana Store (Store Detail Component)
//
// Store name, tagline, address, and open/closed status.
// ============================================================

import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { StoreDetail } from "../../data/storeDetailData";

interface OpenStatus {
  isOpen: boolean;
  label:  string | null; // e.g. "Closed · opens 09:00" — server-computed, null when open
}

interface StoreInfoHeaderProps {
  store: StoreDetail;
  /** null = no real signal for this shop (no products yet) — the status row
   *  is omitted rather than guessed (§19.8). */
  openStatus: OpenStatus | null;
}

export default function StoreInfoHeader({ store, openStatus }: StoreInfoHeaderProps) {
  const { colors } = useTheme();

  const statusColor = openStatus?.isOpen ? colors.success : colors.danger;
  const statusText  = openStatus
    ? (openStatus.isOpen ? "Open now" : (openStatus.label ?? "Closed"))
    : null;

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

      {/* Open/Closed status — omitted entirely when there's no real signal */}
      {statusText && (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 16, gap: 6, marginTop: -16 },

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
