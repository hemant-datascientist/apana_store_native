// ============================================================
// MENU STORE — one kitchen's live menu, grouped by AMC section, with a
// per-kitchen basket that checks out through the §13 order engine.
//
// A guest cannot order: the order needs a customer identity (the phone) to be
// findable afterwards, so an unsigned tap goes to login rather than creating
// an order nobody can look up.
//
// Backend: GET  /api/customer/menu/stores/:id
//          POST /api/customer/orders/menu-checkout
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
import DishCard from "../../components/menu/DishCard";
import MenuCartBar from "../../components/menu/MenuCartBar";
import { useMenuStore } from "../../hooks/useMenuStores";
import { useDishBasket } from "../../hooks/useDishBasket";
import { useAuth } from "../../context/AuthContext";
import { placeMenuOrder } from "../../services/menuService";

export default function MenuStoreScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { detail, loading, reload } = useMenuStore(id);
  const { user } = useAuth();
  const basket = useDishBasket();

  const [placing, setPlacing] = useState(false);

  const sections = (detail?.sections ?? []).map((s) => ({ title: s.groupName, data: s.items }));

  async function handlePlace() {
    const customerId = user?.phone ?? "";
    if (customerId.length === 0) {
      Alert.alert("Sign in to order", "We need your number so you can track the order.", [
        { text: "Not now", style: "cancel" },
        { text: "Sign in", onPress: () => router.push("/login" as any) },
      ]);
      return;
    }

    setPlacing(true);
    try {
      const orders = await placeMenuOrder({
        customerId,
        items: basket.lines.map((l) => ({ menuItemId: l.dish.id, qty: l.qty })),
        paymentMode: "cod",
        fulfillment: "pickup",
      });
      setPlacing(false);
      basket.clear();
      const first = orders[0];
      Alert.alert(
        "Order placed",
        `${detail?.store.name ?? "The kitchen"} has your order.\n${first?.invoiceDisplay ?? ""}\nPay ₹${first?.total.toFixed(0) ?? "0"} on pickup.`,
        [{ text: "OK" }],
      );
    } catch (e: unknown) {
      setPlacing(false);
      // The kitchen may have sold out or paused a dish since this menu loaded —
      // say exactly which, then refresh so the screen matches reality.
      Alert.alert("Couldn't place the order", e instanceof Error ? e.message : "Please try again.");
      reload();
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      <ScreenHeader
        title={detail?.store.name ?? "Menu"}
        subtitle={detail != null ? `${detail.store.city} · ${detail.store.dishCount} dishes today` : null}
      />

      {loading && detail == null ? (
        <View style={styles.state}><ActivityIndicator color={colors.primary} /></View>
      ) : detail == null ? (
        <View style={styles.state}>
          <Ionicons name="restaurant-outline" size={44} color={colors.subText} />
          <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
            Kitchen not found
          </Text>
          <Text style={[styles.emptyBody, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
            This shop may have closed or taken its menu down.
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(d) => d.id}
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
          renderItem={({ item }) => (
            <DishCard
              dish={item}
              qty={basket.qtyOf(item.id)}
              onAdd={basket.add}
              onRemove={basket.remove}
            />
          )}
          SectionSeparatorComponent={() => <View style={styles.gap} />}
          ItemSeparatorComponent={() => <View style={styles.gap} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.state}>
              <Ionicons name="restaurant-outline" size={44} color={colors.subText} />
              <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.semiBold }]}>
                Nothing on today
              </Text>
              <Text style={[styles.emptyBody, { color: colors.subText, fontFamily: typography.fontFamily.regular }]}>
                This kitchen hasn't marked any dish available today.
              </Text>
            </View>
          }
        />
      )}

      <MenuCartBar
        itemCount={basket.itemCount}
        total={basket.total}
        placing={placing}
        onPlace={handlePlace}
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
