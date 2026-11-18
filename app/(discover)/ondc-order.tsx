// ============================================================
// ONDC ORDER — ordering from one shop on another ONDC app.
//   1. choose quantities      -> the shop's price (select)
//   2. your saved address     -> the shop's final bill (init)
//   3. pay (Apana collects)   -> the shop confirms (confirm)
// Every amount shown is the shop's own figure; nothing is estimated here.
// ============================================================

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { goBackOr } from "../../lib/goBack";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { useLocation } from "../../context/LocationContext";
import { networkResults, type NetworkShop } from "../../services/ondcNetworkService";
import { useNetworkOrder } from "../../hooks/useNetworkOrder";
import OrderBill from "../../components/ondc-network/OrderBill";

export default function OndcOrderScreen() {
  const { colors } = useTheme();
  const { txn, bpp_id, provider_id } = useLocalSearchParams<{ txn: string; bpp_id: string; provider_id: string }>();
  const { addresses, deviceCoords, selectedAddress } = useLocation();
  const [shop, setShop] = useState<NetworkShop | null>(null);
  const [qty, setQty] = useState<Record<string, number>>({});
  const { order, busy, error, getPrice, getFinalBill, payAndConfirm, stop } = useNetworkOrder();
  const address = addresses.find((a) => a.isDefault) ?? addresses[0];
  const point = deviceCoords ?? (selectedAddress.lat != null && selectedAddress.lng != null ? { lat: selectedAddress.lat, lng: selectedAddress.lng } : null);

  useEffect(() => {
    if (txn) networkResults(txn).then((r) => setShop(r.shops.find((s) => s.bpp_id === bpp_id && s.provider_id === provider_id) ?? null)).catch(() => setShop(null));
    return stop;
  }, [txn, bpp_id, provider_id]);

  const chosen = Object.entries(qty).filter(([, n]) => n > 0).map(([id, n]) => ({ id, qty: n }));
  const step = order?.status ?? "choose";
  const btn = (label: string, onPress: () => void, disabled = false) => (
    <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary, opacity: busy || disabled ? 0.5 : 1 }]} disabled={busy || disabled} onPress={onPress}>
      {busy ? <ActivityIndicator color={colors.white} /> : <Text style={[styles.btnText, { color: colors.white }]}>{label}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={["top"]} style={[styles.header, { borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => goBackOr()} style={{ padding: 8 }}><Ionicons name="arrow-back" size={22} color={colors.text} /></TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{shop?.name ?? "ONDC shop"}</Text>
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.body}>
        {!shop ? <Text style={[styles.note, { color: colors.subText }]}>This shop's results have expired — go back and search again.</Text> : null}
        {shop && step === "choose" ? shop.items.filter((i) => i.in_stock).map((i) => (
          <View key={i.id} style={[styles.item, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>{i.name} · ₹{(i.price_paise / 100).toFixed(2)}</Text>
            <View style={styles.stepper}>
              <TouchableOpacity onPress={() => setQty((q) => ({ ...q, [i.id]: Math.max(0, (q[i.id] ?? 0) - 1) }))}><Ionicons name="remove-circle-outline" size={26} color={colors.primary} /></TouchableOpacity>
              <Text style={[styles.qty, { color: colors.text }]}>{qty[i.id] ?? 0}</Text>
              <TouchableOpacity onPress={() => setQty((q) => ({ ...q, [i.id]: Math.min(50, (q[i.id] ?? 0) + 1) }))}><Ionicons name="add-circle-outline" size={26} color={colors.primary} /></TouchableOpacity>
            </View>
          </View>
        )) : null}
        {shop && step === "choose" ? btn("Get the shop's price", () => point && txn && void getPrice({ search_txn: txn, bpp_id: shop.bpp_id, provider_id: shop.provider_id, items: chosen, ...point }), chosen.length === 0 || !point) : null}

        {order && ["quoted", "initialized", "confirmed"].includes(order.status) ? (
          <OrderBill order={order} label={order.status === "quoted" ? "The shop's price" : "The shop's final bill"} />
        ) : null}
        {order?.status === "quoted" ? (
          address
            ? <>
                <Text style={[styles.note, { color: colors.subText }]}>Deliver to: {address.label} · {address.line1}, {address.city}</Text>
                {btn("Get the final bill", () => void getFinalBill(address.id))}
              </>
            : <Text style={[styles.note, { color: colors.danger }]}>Add a pinned delivery address first.</Text>
        ) : null}
        {order?.status === "initialized" && order.total_paise ? btn(`Pay ₹${(order.total_paise / 100).toFixed(2)}`, () => void payAndConfirm()) : null}
        {order?.status === "confirmed" ? (
          <Text style={[styles.done, { color: colors.success }]}>Order placed with {order.shop_name}. Order id {order.ondc_order_id}.</Text>
        ) : null}
        {error ? <Text style={[styles.note, { color: colors.danger }]}>{error}</Text> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingBottom: 10, borderBottomWidth: 1 },
  title: { flex: 1, fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl },
  body: { padding: 16, gap: 12 },
  item: { borderWidth: 1, borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  itemName: { flex: 1, fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm },
  stepper: { flexDirection: "row", alignItems: "center", gap: 8 },
  qty: { minWidth: 20, textAlign: "center", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md },
  btn: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  btnText: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md },
  note: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm },
  done: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md },
});
