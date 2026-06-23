// ============================================================
// MAP STORE CARD — Apana Store (Map View)
//
// Floating bottom card for one store:
//   • square icon tile (category colour) with a short category tag pill,
//   • store name on top, then rating · reviews · distance,
//   • two stacked status badges top-right — inventory (LIVE / OFFLINE) and
//     trading state (OPEN / CLOSING SOON / CLOSED / OPENING SOON),
//   • a full-width action row (Get Directions / View Stock / Book a Ride).
//
// The card owns a FIXED height (MAP_CARD_HEIGHT) so the horizontal pager that
// renders a row of these can never stretch it. Actions route to the store page
// for now (product call).
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { StoreMapPin, StoreOpenState } from "../../data/nearbyMapData";

// Single source for the card height — the pager imports this to size its row.
export const MAP_CARD_HEIGHT = 138;

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
  onGetDirections: () => void;
  onViewStock:     () => void;
  onBookRide:      () => void;
}

export default function MapStoreCard({ pin, onGetDirections, onViewStock, onBookRide }: MapStoreCardProps) {
  const { colors } = useTheme();

  const inventory = pin.isLive ? INVENTORY.live : INVENTORY.offline;
  const openCfg   = OPEN_STATE[pin.openState ?? (pin.isOpen ? "open" : "closed")];
  const tagLabel  = pin.categoryLabel ?? "Apana";

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.primary }]}>

      {/* Top: square icon tile + info */}
      <View style={styles.topRow}>
        <View style={[styles.thumb, { backgroundColor: pin.iconBg }]}>
          <Ionicons name={pin.icon as any} size={28} color={pin.accentColor} />
          <View style={[styles.catTag, { backgroundColor: pin.accentColor }]}>
            <Ionicons name={pin.icon as any} size={9} color="#fff" />
            <Text numberOfLines={1} style={[styles.catText, { fontFamily: typography.fontFamily.semiBold }]}>
              {tagLabel}
            </Text>
          </View>
        </View>

        <View style={styles.info}>
          {/* Name + rating stacked tight on the left */}
          <View style={styles.infoLeft}>
            <Text numberOfLines={1} style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
              {pin.name}
            </Text>
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
          </View>

          {/* Stacked status badges on the right */}
          <View style={styles.badges}>
            <Badge cfg={inventory} />
            <Badge cfg={openCfg} />
          </View>
        </View>
      </View>

      {/* Full-width action row */}
      <View style={styles.actions}>
        <Action icon="navigate"      label="Get Directions" onPress={onGetDirections} tint={colors.primary} />
        <Action icon="cube-outline"  label="View Stock"     onPress={onViewStock}     tint={colors.primary} />
        <Action icon="car-outline"   label="Book a Ride"    onPress={onBookRide}      tint={colors.primary} />
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

function Action({ icon, label, onPress, tint }: {
  icon: string; label: string; onPress: () => void; tint: string;
}) {
  return (
    <TouchableOpacity style={[styles.action, { borderColor: tint }]} onPress={onPress} activeOpacity={0.85}>
      <Ionicons name={icon as any} size={13} color={tint} />
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
        style={[styles.actionText, { color: tint, fontFamily: typography.fontFamily.semiBold }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: MAP_CARD_HEIGHT,            // fixed — the pager can never stretch it
    borderRadius: 18, borderWidth: 2, padding: 10, justifyContent: "space-between",
    shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.16, shadowRadius: 16, elevation: 8,
  },

  // Top row: square tile + info
  topRow: { flexDirection: "row", gap: 10 },
  thumb: {
    width: 66, height: 66, borderRadius: 12,         // 1:1 square
    alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
  },
  catTag: {
    position: "absolute", left: 4, right: 4, bottom: 4,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 3,
    paddingVertical: 3, paddingHorizontal: 4, borderRadius: 7,
  },
  catText: { color: "#fff", fontSize: 8.5 },

  info: { flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 8 },
  infoLeft: { flex: 1, gap: 5 },
  name: {},
  meta: { flexDirection: "row", alignItems: "center" },
  rating: {},
  dim: {},
  badges: { gap: 5, alignItems: "flex-end", flexShrink: 0 },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeDot: { width: 5, height: 5, borderRadius: 3 },
  badgeText: { fontSize: 9, letterSpacing: 0.2 },

  // Full-width actions
  actions: { flexDirection: "row", gap: 8 },
  action: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4,
    paddingVertical: 9, borderRadius: 10, borderWidth: 1.5,
  },
  actionText: { fontSize: 11 },
});
