// ============================================================
// ONDC ORDERS — orders this customer placed with shops on other ONDC apps.
// Tap one to see its status, cancel it, or check its refund.
// ============================================================

import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { goBackOr } from "../../lib/goBack";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import StateView from "../../components/ui/StateView";
import { listNetworkOrders, type NetworkOrder } from "../../services/ondcNetworkService";

const LABEL: Record<string, string> = {
  selecting: "Getting price", quoted: "Price ready", initializing: "Getting final bill", initialized: "Ready to pay",
  confirming: "Placing order", confirmed: "Placed", cancelling: "Cancelling", cancelled: "Cancelled", failed: "Not placed",
};

export default function OndcOrdersScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [items, setItems] = useState<NetworkOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(() => { setError(null); listNetworkOrders().then((r) => setItems(r.items)).catch((e) => setError((e as Error).message)); }, []);
  useEffect(load, [load]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={["top"]} style={[styles.header, { borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => goBackOr()} style={{ padding: 8 }}><Ionicons name="arrow-back" size={22} color={colors.text} /></TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>ONDC orders</Text>
      </SafeAreaView>
      {error ? <StateView variant="error" message={error} actionLabel="Try again" onAction={load} /> : null}
      {items && items.length === 0 ? <StateView variant="empty" title="No ONDC orders yet" message="Orders you place with shops on other ONDC apps appear here." /> : null}
      <FlatList
        data={items ?? []}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item: o }) => (
          <TouchableOpacity onPress={() => router.push({ pathname: "/ondc-order", params: { id: o.id } })} style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.shop, { color: colors.text }]} numberOfLines={1}>{o.shop_name}</Text>
              <Text style={[styles.meta, { color: colors.subText }]}>
                {LABEL[o.status] ?? o.status}{o.fulfillment_state ? ` · ${o.fulfillment_state}` : ""}{o.refund?.refunded_at ? " · refunded" : ""}
              </Text>
            </View>
            {o.total_paise != null ? <Text style={[styles.shop, { color: colors.text }]}>₹{(o.total_paise / 100).toFixed(2)}</Text> : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingBottom: 10, borderBottomWidth: 1 },
  title: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl },
  row: { borderWidth: 1, borderRadius: 12, padding: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  shop: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md },
  meta: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs, marginTop: 2 },
});
