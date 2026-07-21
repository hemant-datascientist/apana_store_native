// ============================================================
// MY BOOKINGS — the customer's own service bookings (§16.11).
//
// Scoped by the signed-in phone number, the only identity a booking carries.
// A guest sees a sign-in prompt, not an empty list — "you have no bookings"
// would be a lie when the truth is "we don't know who you are".
//
// Backend: GET  /api/customer/services/bookings?phone=
//          POST /api/customer/services/bookings/:id/cancel?phone=
// ============================================================

import React from "react";
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import ScreenHeader from "../../components/shared/ScreenHeader";
import BookingCard from "../../components/booking/BookingCard";
import { useMyBookings } from "../../hooks/useMyBookings";
import { useAuth } from "../../context/AuthContext";
import type { Booking } from "../../services/bookingService";

export default function MyBookingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const phone = user?.phone ?? null;
  const { bookings, loading, error, reload, cancel } = useMyBookings(phone);

  function handleCancel(booking: Booking) {
    Alert.alert(
      "Cancel this booking?",
      `${booking.serviceName} at ${booking.store.name}.`,
      [
        { text: "Keep it", style: "cancel" },
        {
          text: "Cancel booking",
          style: "destructive",
          onPress: () => {
            cancel(booking.id).catch((e: unknown) => {
              // The seller may have moved it (confirmed, completed) since this
              // list was drawn — show the server's reason, then refresh.
              Alert.alert("Couldn't cancel", e instanceof Error ? e.message : "Please try again.");
              reload();
            });
          },
        },
      ],
    );
  }

  // Guest: identity missing, so there is nothing to look up.
  if (phone == null || phone.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
        <ScreenHeader title="My Bookings" />
        <View style={styles.state}>
          <Ionicons name="person-circle-outline" size={48} color={colors.subText} />
          <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
            Sign in to see your bookings
          </Text>
          <Text style={[styles.emptyBody, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
            Bookings are tied to your phone number.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      <ScreenHeader
        title="My Bookings"
        right={
          <Ionicons
            name="add-circle-outline"
            size={22}
            color={colors.primary}
            onPress={() => router.push("/service-stores" as any)}
          />
        }
      />

      <FlatList
        data={bookings}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => <BookingCard booking={item} onCancel={handleCancel} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={reload} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.state}>
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <Ionicons
                  name={error ? "cloud-offline-outline" : "calendar-outline"}
                  size={44}
                  color={colors.subText}
                />
                <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                  {error ? "Couldn't load your bookings" : "No bookings yet"}
                </Text>
                <Text style={[styles.emptyBody, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                  {error ?? "Book a haircut, a repair, a cleaning — it'll show up here."}
                </Text>
              </>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, gap: 12, flexGrow: 1 },
  state: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 32 },
  emptyTitle: { fontSize: typography.size.md, textAlign: "center" },
  emptyBody: { fontSize: typography.size.sm, textAlign: "center", lineHeight: 20 },
});
