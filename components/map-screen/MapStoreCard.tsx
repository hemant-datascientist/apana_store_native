// ============================================================
// MAP STORE CARD — Apana Store (Map View)
//
// Floating bottom card for one store. Matches the design:
//   • storefront photo (falls back to the category icon tile) with a coloured
//     category tag pill at the bottom-left,
//   • two stacked status badges top-right — inventory (LIVE / OFFLINE) and
//     trading state (OPEN / CLOSING SOON / CLOSED / OPENING SOON),
//   • name + rating · reviews · distance,
//   • three outlined actions (Get Directions / View Stock / Book a Ride).
//
// One card per store; the parent renders a horizontal pager of these to swipe
// between nearby stores. Actions route to the store page for now (product call).
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { StoreMapPin, StoreOpenState } from "../../data/nearbyMapData";
import { getStoreHeroImage } from "../../data/storeHeroImages";

interface BadgeCfg { label: string; bg: string; fg: string; dot: string; }

const INVENTORY: Record<"live" | "offline", BadgeCfg> = {
  live:    { label: "LIVE INVENTORY",    bg: "#166534", fg: "#FFFFFF", dot: "#4ADE80" },
  offline: { label: "OFFLINE INVENTORY", bg: "#7F1D1D", fg: "#FFFFFF", dot: "#F87171" },
};

const OPEN_STATE: Record<StoreOpenState, BadgeCfg> = {
  open:         { label: "OPEN",         bg: "#DCFCE7", fg: "#15803D", dot: "#16A34A" },
  closing_soon: { label: "CLOSING SOON", bg: "#FEE2E2", fg: "#B91C1C", dot: "#DC2626" },
  closed:       { label: "CLOSED",       bg: "#DC2626", fg: "#FFFFFF", dot: "#FFFFFF" },
  opening_soon: { label: "OPENING SOON", bg: "#D1FAE5", fg: "#047857", dot: "#10B981" },
};

interface MapStoreCardProps {
  pin:             StoreMapPin;
  width:           number;   // fixed width so the pager can snap
  onGetDirections: () => void;
  onViewStock:     () => void;
  onBookRide:      () => void;
}

export default function MapStoreCard({ pin, width, onGetDirections, onViewStock, onBookRide }: MapStoreCardProps) {
  const { colors } = useTheme();

  const img       = getStoreHeroImage(pin.id);
  const inventory = pin.isLive ? INVENTORY.live : INVENTORY.offline;
  const openCfg   = OPEN_STATE[pin.openState ?? (pin.isOpen ? "open" : "closed")];
  const tagLabel  = pin.categoryLabel ?? "Apana Store";

  return (
    <View style={[styles.card, { width, backgroundColor: colors.card, borderColor: colors.primary }]}>
      <View style={styles.row}>

        {/* Thumbnail + category tag */}
        <View style={styles.thumbCol}>
          {img ? (
            <Image source={img} style={styles.thumbImg} resizeMode="cover" />
          ) : (
            <View style={[styles.thumbImg, styles.thumbFallback, { backgroundColor: pin.iconBg }]}>
              <Ionicons name={pin.icon as any} size={30} color={pin.accentColor} />
            </View>
          )}
          <View style={[styles.catTag, { backgroundColor: pin.accentColor }]}>
            <Ionicons name={pin.icon as any} size={9} color="#fff" />
            <Text numberOfLines={1} style={[styles.catText, { fontFamily: typography.fontFamily.semiBold }]}>
              {tagLabel}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Name + stacked status badges */}
          <View style={styles.headRow}>
            <Text numberOfLines={1} style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
              {pin.name}
            </Text>
            <View style={styles.badges}>
              <Badge cfg={inventory} />
              <Badge cfg={openCfg} />
            </View>
          </View>

          {/* Rating · reviews · distance */}
          <View style={styles.meta}>
            <Ionicons name="star" size={13} color="#F59E0B" />
            <Text style={[styles.rating, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              {pin.rating}
            </Text>
            {pin.reviews != null && (
              <Text style={[styles.dim, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
                {"  ·  "}{pin.reviews.toLocaleString("en-IN")} reviews
              </Text>
            )}
            <Text style={[styles.dim, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
              {"  ·  "}{pin.distanceKm} km
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Action icon="navigate"      label="Get Directions" onPress={onGetDirections} primary={colors.primary} />
            <Action icon="cube-outline"  label="View Stock"     onPress={onViewStock}     primary={colors.primary} />
            <Action icon="car-outline"   label="Book a Ride"    onPress={onBookRide}      primary={colors.primary} />
          </View>
        </View>
      </View>
    </View>
  );
}

function Badge({ cfg }: { cfg: BadgeCfg }) {
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <View style={[styles.badgeDot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.badgeText, { color: cfg.fg, fontFamily: typography.fontFamily.bold }]}>{cfg.label}</Text>
    </View>
  );
}

function Action({ icon, label, onPress, primary }: {
  icon: string; label: string; onPress: () => void; primary: string;
}) {
  return (
    <TouchableOpacity style={[styles.action, { borderColor: primary }]} onPress={onPress} activeOpacity={0.85}>
      <Ionicons name={icon as any} size={14} color={primary} />
      <Text numberOfLines={1} style={[styles.actionText, { color: primary, fontFamily: typography.fontFamily.semiBold }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18, borderWidth: 2, padding: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.16, shadowRadius: 16, elevation: 8,
  },
  row: { flexDirection: "row", gap: 12, alignItems: "stretch" },

  // Thumbnail column (stretches to the content height)
  thumbCol: { width: 92, borderRadius: 12, overflow: "hidden", position: "relative" },
  thumbImg: { flex: 1, width: "100%", minHeight: 92 },
  thumbFallback: { alignItems: "center", justifyContent: "center" },
  catTag: {
    position: "absolute", left: 6, right: 6, bottom: 6,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 3,
    paddingVertical: 4, paddingHorizontal: 6, borderRadius: 8,
  },
  catText: { color: "#fff", fontSize: 9 },

  // Content column
  content: { flex: 1, justifyContent: "space-between", gap: 8 },
  headRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  name: { flex: 1, marginTop: 1 },
  badges: { gap: 5, alignItems: "flex-end", flexShrink: 0 },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeDot: { width: 5, height: 5, borderRadius: 3 },
  badgeText: { fontSize: 9, letterSpacing: 0.2 },

  meta: { flexDirection: "row", alignItems: "center" },
  rating: {},
  dim: {},

  actions: { flexDirection: "row", gap: 8 },
  action: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5,
    paddingVertical: 10, borderRadius: 10, borderWidth: 1.5,
  },
  actionText: { fontSize: 11 },
});
