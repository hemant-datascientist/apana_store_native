// ============================================================
// MENU STORES — kitchens cooking today (§16.12 AMC).
//
// Only shops with at least one dish marked available today appear. A
// restaurant that has switched everything off for the day is closed for food,
// and listing it would send the customer to a dead end (§19.8).
//
// Backend: GET /api/customer/menu/stores?city=&q=
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
import MenuStoreCard from "../../components/menu/MenuStoreCard";
import { useMenuStores } from "../../hooks/useMenuStores";
import { useLocation } from "../../context/LocationContext";
import { useDebounce } from "../../hooks/useDebounce";

export default function MenuStoresScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { selectedAddress, deviceCoords } = useLocation();

  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 350);
  // Coordinates when we have a fix — the backend then scopes by §19.10
  // district instead of an exact city-name match, so a customer one town over
  // still sees the shops they can actually reach. City is the fallback.
  const { stores, loading, error, scope, elsewhere } = useMenuStores({
    city: selectedAddress.city,
    q: debounced,
    lat: deviceCoords?.lat ?? selectedAddress.lat ?? null,
    lng: deviceCoords?.lng ?? selectedAddress.lng ?? null,
  });
  const areaLabel = scope.label ?? selectedAddress.city;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      <ScreenHeader title="Order food" subtitle={areaLabel} />

      <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search" size={17} color={colors.subText} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Biryani, thali, dosa…"
          placeholderTextColor={colors.subText}
          style={[styles.search, { color: colors.text, fontFamily: typography.fontFamily.regular }]}
        />
      </View>

      <FlatList
        data={stores}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <MenuStoreCard
            store={item}
            onPress={(id) => router.push(`/menu-store?id=${encodeURIComponent(id)}` as any)}
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
                  name={error ? "cloud-offline-outline" : "restaurant-outline"}
                  size={44}
                  color={colors.subText}
                />
                <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                  {error ? "Couldn't load kitchens" : "No kitchen is cooking yet"}
                </Text>
                <Text style={[styles.emptyBody, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                  {error ??
                    `No kitchen in ${areaLabel} has a menu up on Apana today.`
                    + (elsewhere > 0
                        ? ` ${elsewhere} kitchens are live elsewhere on Apana — we're expanding.`
                        : " As they join, they'll show here.")}
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
