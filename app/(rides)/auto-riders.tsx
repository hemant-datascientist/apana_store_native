// ============================================================
// AUTO RIDERS — Apana Store (Customer App)
//
// Book a ride from the Apana Partner fleet — for yourself (personal)
// or to carry an order from the cart (?mode=order).
//
// Layout:
//   Map      — live riders around the customer, coloured by class
//   Stepper  — passenger count (drives the smart capacity gating)
//   Tabs     — All · Bike · Auto · Cab (impossible classes locked)
//   List     — riders nearest → farthest, Book per rider
//
// Riders are frontend-first mock (services/ridersService — §19.5
// precedent); booking is a stub until the §8 partner pipeline lands.
// ============================================================

import React, { useEffect, useMemo, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { useLocation } from "../../context/LocationContext";
import { DEFAULT_LAT, DEFAULT_LNG } from "../../config/mapplsConfig";
import { fetchNearbyRiders } from "../../services/ridersService";
import { Rider, NearbyRider, VehicleClass } from "../../data/ridersData";
import { rankRiders, isClassAllowed } from "../../lib/rideLogic";
import RidersMap from "../../components/rides/RidersMap";
import PassengerStepper from "../../components/rides/PassengerStepper";
import VehicleClassTabs, { ClassFilter } from "../../components/rides/VehicleClassTabs";
import RiderCard from "../../components/rides/RiderCard";

export default function AutoRidersScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isOrderMode = mode === "order";

  // Customer position: detected address pin, else the app's default centre.
  const { selectedAddress } = useLocation();
  const lat = selectedAddress.lat ?? DEFAULT_LAT;
  const lng = selectedAddress.lng ?? DEFAULT_LNG;

  const [riders,     setRiders]     = useState<Rider[]>([]);
  const [passengers, setPassengers] = useState(1);
  const [filter,     setFilter]     = useState<ClassFilter>("all");

  useEffect(() => {
    let alive = true;
    fetchNearbyRiders({ lat, lng }).then((r) => alive && setRiders(r));
    return () => { alive = false; };
  }, [lat, lng]);

  // Capacity-gated, class-filtered, nearest-first.
  const ranked = useMemo<NearbyRider[]>(
    () => rankRiders(riders, { lat, lng }, passengers, filter),
    [riders, lat, lng, passengers, filter],
  );

  // Per-class rider counts for the chips (independent of gating/filter).
  const counts = useMemo(() => {
    const c = { two_wheeler: 0, three_wheeler: 0, four_wheeler: 0 } as Record<VehicleClass, number>;
    for (const r of riders) c[r.vehicleClass] += 1;
    return c;
  }, [riders]);

  // Bumping passengers past the active class's capacity resets to All —
  // the filter must never stay on a class the group can't fit in.
  function onPassengersChange(next: number) {
    setPassengers(next);
    if (filter !== "all" && !isClassAllowed(filter, next)) setFilter("all");
  }

  function onBook(rider: NearbyRider) {
    Alert.alert(
      "Request Ride",
      `${rider.name} — ${rider.vehicleNo}\n${passengers} passenger${passengers > 1 ? "s" : ""}${isOrderMode ? " · carrying your order" : ""}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Request", onPress: () => Alert.alert("Requested", "Ride requests go live with the partner pipeline — coming soon.") },
      ],
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
          {isOrderMode ? "Ride for Your Order" : "Auto Riders"}
        </Text>
        <View style={styles.headerBtn} />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Order-mode banner */}
        {isOrderMode && (
          <View style={[styles.orderBanner, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
            <Ionicons name="cube-outline" size={15} color={colors.primary} />
            <Text style={[styles.orderText, { color: colors.text, fontFamily: typography.fontFamily.medium }]}>
              This ride will carry your cart order with you.
            </Text>
          </View>
        )}

        {/* ── Live riders map ── */}
        <RidersMap
          riders={rankRiders(riders, { lat, lng }, 1, filter)}
          userLat={lat}
          userLng={lng}
        />

        {/* ── Passengers + class tabs ── */}
        <PassengerStepper value={passengers} onChange={onPassengersChange} />
        <VehicleClassTabs active={filter} passengers={passengers} counts={counts} onSelect={setFilter} />

        {/* ── Nearest-first rider list ── */}
        <Text style={[styles.sectionLabel, { color: colors.subText, fontFamily: typography.fontFamily.semiBold }]}>
          {ranked.length} RIDER{ranked.length === 1 ? "" : "S"} · NEAREST FIRST
        </Text>

        {ranked.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="car-outline" size={40} color={colors.subText} />
            <Text style={[styles.emptyText, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
              No riders match — try fewer passengers or another vehicle type.
            </Text>
          </View>
        ) : (
          ranked.map((r) => <RiderCard key={r.id} rider={r} onBook={onBook} />)
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 16,
    paddingBottom:     12,
    borderBottomWidth: 1,
  },
  headerBtn:   { width: 36 },
  headerTitle: { flex: 1, textAlign: "center" },
  content:     { paddingBottom: 32 },
  orderBanner: {
    flexDirection:    "row",
    alignItems:       "center",
    gap:               8,
    marginHorizontal: 16,
    marginTop:        10,
    marginBottom:      6,
    paddingHorizontal: 12,
    paddingVertical:    8,
    borderRadius:      10,
    borderWidth:        1,
  },
  orderText: { flex: 1, fontSize: typography.size.xs },
  sectionLabel: {
    fontSize:          typography.size.xs,
    letterSpacing:     0.8,
    paddingHorizontal: 16,
    marginTop:         16,
    marginBottom:      10,
  },
  emptyWrap: {
    alignItems:        "center",
    gap:               10,
    paddingTop:        28,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize:  typography.size.sm,
    textAlign: "center",
  },
});
