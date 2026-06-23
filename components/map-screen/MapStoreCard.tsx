// ============================================================
// MAP STORE CARD — Apana Store (Map View)
//
// Floating bottom card for the selected store: thumbnail (+ "Apana Stores"
// tag), name, rating · reviews · distance, a live-inventory badge, and the
// three actions. All three route to the store page for now (per product call).
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { StoreMapPin } from "../../data/nearbyMapData";

interface MapStoreCardProps {
  pin:             StoreMapPin;
  onGetDirections: () => void;
  onViewStock:     () => void;
  onBookRide:      () => void;
}

export default function MapStoreCard({ pin, onGetDirections, onViewStock, onBookRide }: MapStoreCardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.top}>
        {/* Thumbnail + Apana Stores tag */}
        <View style={[styles.thumb, { backgroundColor: pin.iconBg }]}>
          <Ionicons name={pin.icon as any} size={28} color={pin.accentColor} />
          <View style={styles.tag}>
            <Ionicons name="storefront" size={8} color="#fff" />
            <Text style={[styles.tagText, { fontFamily: typography.fontFamily.semiBold }]}>Apana Stores</Text>
          </View>
        </View>

        {/* Name + meta */}
        <View style={styles.body}>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
              {pin.name}
            </Text>
            {pin.isLive && (
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={[styles.liveText, { fontFamily: typography.fontFamily.bold }]}>Live inventory</Text>
              </View>
            )}
          </View>
          <View style={styles.meta}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={[styles.metaStrong, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>{pin.rating}</Text>
            {pin.reviews != null && (
              <Text style={[styles.metaDim, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                · {pin.reviews.toLocaleString("en-IN")} reviews
              </Text>
            )}
            <Text style={[styles.metaDim, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              · {pin.distanceKm} km
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Action icon="navigate-outline"  label="Get Directions" onPress={onGetDirections} colors={colors} />
        <Action icon="cube-outline"      label="View Stock"     onPress={onViewStock}     colors={colors} primary />
        <Action icon="car-outline"       label="Book a Ride"    onPress={onBookRide}      colors={colors} />
      </View>
    </View>
  );
}

function Action({ icon, label, onPress, colors, primary }: {
  icon: string; label: string; onPress: () => void; colors: any; primary?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.action, primary ? { backgroundColor: colors.primary } : { backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1 }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Ionicons name={icon as any} size={14} color={primary ? "#fff" : colors.primary} />
      <Text numberOfLines={1} style={[styles.actionText, { color: primary ? "#fff" : colors.text, fontFamily: typography.fontFamily.semiBold }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18, borderWidth: 1, padding: 12, gap: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.16, shadowRadius: 16, elevation: 8,
  },
  top: { flexDirection: "row", gap: 12, alignItems: "center" },
  thumb: { width: 64, height: 64, borderRadius: 14, alignItems: "center", justifyContent: "center", position: "relative" },
  tag: { position: "absolute", bottom: 4, left: 4, right: 4, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 2, backgroundColor: "#166534", borderRadius: 6, paddingVertical: 2 },
  tagText: { color: "#fff", fontSize: 7 },

  body: { flex: 1, gap: 5 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { flexShrink: 1 },
  liveBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#DCFCE7", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 20, flexShrink: 0 },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#16A34A" },
  liveText: { color: "#15803D", fontSize: 9 },
  meta: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaStrong: {},
  metaDim: {},

  actions: { flexDirection: "row", gap: 8 },
  action: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 10, borderRadius: 10 },
  actionText: { fontSize: 11 },
});
