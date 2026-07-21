// ============================================================
// SERVICE STORES — shops the customer can book a service with (§16.11).
//
// Scoped to the customer's city by default, because a salon three states away
// is not a booking. The search box matches the shop name OR any service it
// offers, so "haircut" finds the salon.
//
// Backend: GET /api/customer/services/stores?city=&q=
// ============================================================

import React, { useState } from "react";
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import ScreenHeader from "../../components/shared/ScreenHeader";
import ServiceStoreCard from "../../components/booking/ServiceStoreCard";
import { useServiceStores } from "../../hooks/useServiceStores";
import { useLocation } from "../../context/LocationContext";
import { useDebounce } from "../../hooks/useDebounce";

export default function ServiceStoresScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { selectedAddress } = useLocation();

  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 350);
  const { stores, loading, error } = useServiceStores({
    city: selectedAddress.city,
    q: debounced,
  });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      <ScreenHeader title="Book a service" subtitle={selectedAddress.city} />

      <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search" size={17} color={colors.subText} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Salon, plumber, AC repair…"
          placeholderTextColor={colors.subText}
          style={[styles.search, { color: colors.text, fontFamily: typography.fontFamily.regular }]}
        />
      </View>

      <FlatList
        data={stores}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <ServiceStoreCard
            store={item}
            onPress={(id) => router.push(`/service-store?id=${encodeURIComponent(id)}` as any)}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.state}>
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <Ionicons
                  name={error ? "cloud-offline-outline" : "construct-outline"}
                  size={44}
                  color={colors.subText}
                />
                <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                  {error ? "Couldn't load service stores" : "No service stores yet"}
                </Text>
                <Text style={[styles.emptyBody, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                  {error ??
                    `No shop in ${selectedAddress.city} is taking bookings on Apana yet. As they join, they'll show here.`}
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
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  search: { flex: 1, fontSize: typography.size.sm, padding: 0 },
  content: { padding: 16, gap: 10, flexGrow: 1 },
  state: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 32 },
  emptyTitle: { fontSize: typography.size.md, textAlign: "center" },
  emptyBody: { fontSize: typography.size.sm, textAlign: "center", lineHeight: 20 },
});
