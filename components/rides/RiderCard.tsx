// ============================================================
// RIDER CARD — Apana Store (Auto Riders)
//
// One rider row in the nearest-first list: class-tinted vehicle icon,
// name + vehicle number, rating + rides, distance + ETA, Book button.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { NearbyRider, VEHICLE_INFO } from "../../data/ridersData";
import { formatDistance } from "../../lib/rideLogic";

interface RiderCardProps {
  rider:  NearbyRider;
  onBook: (rider: NearbyRider) => void;
}

function RiderCard({ rider, onBook }: RiderCardProps) {
  const { colors } = useTheme();
  const info = VEHICLE_INFO[rider.vehicleClass];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* Vehicle icon, class-tinted */}
      <View style={[styles.iconWrap, { backgroundColor: info.color + "16" }]}>
        <Ionicons name={info.icon as keyof typeof Ionicons.glyphMap} size={22} color={info.color} />
      </View>

      {/* Identity + meta */}
      <View style={styles.body}>
        <Text numberOfLines={1} style={[styles.name, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
          {rider.name}
        </Text>
        <Text numberOfLines={1} style={[styles.sub, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
          {info.fullLabel} · {rider.vehicleNo}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="star" size={11} color="#F59E0B" />
          <Text style={[styles.meta, { color: colors.subText, fontFamily: typography.fontFamily.medium }]}>
            {rider.rating.toFixed(1)} · {rider.ridesDone.toLocaleString("en-IN")} rides
          </Text>
        </View>
      </View>

      {/* Distance + ETA + book */}
      <View style={styles.right}>
        <Text style={[styles.distance, { color: colors.text, fontFamily: typography.fontFamily.bold }]}>
          {formatDistance(rider.distanceM)}
        </Text>
        <Text style={[styles.eta, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
          ~{rider.etaMin} min away
        </Text>
        <TouchableOpacity
          onPress={() => onBook(rider)}
          activeOpacity={0.8}
          style={[styles.bookBtn, { backgroundColor: info.color }]}
        >
          <Text style={[styles.bookText, { fontFamily: typography.fontFamily.semiBold }]}>
            Book
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection:    "row",
    alignItems:       "center",
    gap:              12,
    marginHorizontal: 16,
    marginBottom:     10,
    padding:          12,
    borderRadius:     14,
    borderWidth:      1,
  },
  iconWrap: {
    width:          44,
    height:         44,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  body: { flex: 1, gap: 2 },
  name: { fontSize: typography.size.sm },
  sub:  { fontSize: typography.size.xs },
  metaRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           4,
  },
  meta: { fontSize: typography.size.ss },
  right: {
    alignItems: "flex-end",
    gap:        2,
  },
  distance: { fontSize: typography.size.sm },
  eta:      { fontSize: typography.size.ss },
  bookBtn: {
    paddingHorizontal: 16,
    paddingVertical:    6,
    borderRadius:      14,
    marginTop:          3,
  },
  bookText: {
    color:    "#fff",
    fontSize: typography.size.xs,
  },
});

// Memoised — the list re-renders on every passenger/class/filter change;
// unchanged rider rows skip their subtree.
export default React.memo(RiderCard);
