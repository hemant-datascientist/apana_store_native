// ============================================================
// SERVICE STORE — one shop's bookable services, grouped by ASvC section.
//
// Orchestrator only: sections come from the taxonomy, the card and the
// booking sheet own their own files.
//
// Backend: GET /api/customer/services/stores/:id
//          POST /api/customer/services/bookings
// ============================================================

import React, { useState } from "react";
import {
  View, Text, SectionList, StyleSheet, ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import ScreenHeader from "../../components/shared/ScreenHeader";
import OfferingCard from "../../components/booking/OfferingCard";
import BookingSheet from "../../components/booking/BookingSheet";
import { useServiceStore } from "../../hooks/useServiceStores";
import { useAuth } from "../../context/AuthContext";
import type { Offering } from "../../services/bookingService";

export default function ServiceStoreScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { detail, loading } = useServiceStore(id);
  const { user } = useAuth();

  const [booking, setBooking] = useState<Offering | null>(null);

  const sections = (detail?.sections ?? []).map((s) => ({
    title: s.groupName,
    data: s.items,
  }));

  function handleBooked() {
    setBooking(null);
    Alert.alert(
      "Request sent",
      `${detail?.store.name ?? "The shop"} will confirm your slot. Track it under My Bookings.`,
      [
        { text: "Stay here", style: "cancel" },
        { text: "My Bookings", onPress: () => router.push("/my-bookings" as any) },
      ],
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      <ScreenHeader
        title={detail?.store.name ?? "Services"}
        subtitle={detail != null ? `${detail.store.city} · from ₹${detail.store.fromPrice.toFixed(0)}` : null}
      />

      {loading && detail == null ? (
        <View style={styles.state}><ActivityIndicator color={colors.primary} /></View>
      ) : detail == null ? (
        <View style={styles.state}>
          <Ionicons name="storefront-outline" size={44} color={colors.subText} />
          <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
            Shop not found
          </Text>
          <Text style={[styles.emptyBody, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
            This shop may have closed or stopped taking bookings.
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(o) => o.id}
          contentContainerStyle={styles.content}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text style={[styles.section, {
              color: colors.text,
              fontFamily: typography.fontFamily.bold,
              fontSize: typography.size.sm,
            }]}>
              {section.title}
            </Text>
          )}
          renderItem={({ item }) => <OfferingCard offering={item} onBook={setBooking} />}
          SectionSeparatorComponent={() => <View style={styles.gap} />}
          ItemSeparatorComponent={() => <View style={styles.gap} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.state}>
              <Ionicons name="construct-outline" size={44} color={colors.subText} />
              <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                Nothing bookable right now
              </Text>
              <Text style={[styles.emptyBody, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                This shop has paused its services.
              </Text>
            </View>
          }
        />
      )}

      <BookingSheet
        visible={booking != null}
        offering={booking}
        storeName={detail?.store.name ?? ""}
        defaultName={user?.name ?? ""}
        defaultPhone={user?.phone ?? ""}
        onClose={() => setBooking(null)}
        onBooked={handleBooked}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, flexGrow: 1 },
  section: { marginTop: 8, marginBottom: 8 },
  gap: { height: 10 },
  state: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 32, paddingVertical: 60 },
  emptyTitle: { fontSize: typography.size.md, textAlign: "center" },
  emptyBody: { fontSize: typography.size.sm, textAlign: "center", lineHeight: 20 },
});
