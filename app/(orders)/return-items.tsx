// ============================================================
// RETURN ITEMS — ask the shop to take goods back from a delivered order.
//
// Inside the shop's own return window only (the server decides and says why
// not). The customer picks quantities; the shop accepts once the goods are
// back with it. Delivery and platform fees are not refunded — the trip happened.
// ============================================================

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { goBackOr } from "../../lib/goBack";
import { useAuth } from "../../context/AuthContext";
import ReturnLineRow from "../../components/orders/ReturnLineRow";
import { fetchReturnInfo, requestReturn, type ReturnInfo } from "../../services/returnService";

const STATUS_TEXT = {
  requested: "Return requested. Take the items back to the shop — it accepts once it has them.",
  accepted: "Return accepted.",
  rejected: "The shop did not accept this return.",
} as const;

export default function ReturnItemsScreen() {
  const { colors } = useTheme();
  const { orderId = "", invoice = "" } = useLocalSearchParams<{ orderId: string; invoice: string }>();
  const { user } = useAuth();
  const customerId = user?.phone ?? "";
  const [info, setInfo] = useState<ReturnInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [reason, setReason] = useState("");
  const [sending, setSending] = useState(false);

  const load = () => {
    setError(null);
    fetchReturnInfo(orderId, customerId).then(setInfo).catch((e) => setError(e instanceof Error ? e.message : "Could not load this order."));
  };
  useEffect(load, [orderId, customerId]);

  const picked = Object.entries(qty).filter(([, n]) => n > 0).map(([order_item_id, n]) => ({ order_item_id, qty: n }));
  // No refund preview: a coupon changes it, and the shop's acceptance states the real figure.
  const T = (size: keyof typeof typography.size, weight: keyof typeof typography.fontFamily = "regular", color = colors.text) =>
    ({ fontFamily: typography.fontFamily[weight], fontSize: typography.size[size], color });

  async function submit() {
    setSending(true);
    try {
      await requestReturn(orderId, customerId, picked, reason);
      load();
    } catch (e) {
      Alert.alert("Could not request the return", e instanceof Error ? e.message : "Try again.");
    } finally {
      setSending(false);
    }
  }

  const r = info?.return;
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={[styles.header, { borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => goBackOr("/order-history")} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={T("lg", "semiBold")}>Return items{invoice ? ` · ${invoice}` : ""}</Text>
      </View>

      {!info && !error && <ActivityIndicator style={styles.center} color={colors.primary} />}
      {error && (
        <TouchableOpacity style={styles.center} onPress={load}>
          <Text style={T("sm", "regular", colors.danger)}>{error}</Text>
          <Text style={T("sm", "semiBold", colors.primary)}>Tap to retry</Text>
        </TouchableOpacity>
      )}

      {info && (
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
          {r ? (
            <View style={[styles.note, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={T("md", "semiBold")}>{STATUS_TEXT[r.status]}</Text>
              {r.status === "accepted" && r.refund_cents != null && (
                <Text style={T("sm")}>
                  ₹{(r.refund_cents / 100).toFixed(2)} {info.payment_mode === "cod" ? "paid back by the shop in cash." : r.refund_done ? "refunded to how you paid." : "refund is being sent."}
                </Text>
              )}
              {r.note ? <Text style={T("sm", "regular", colors.subText)}>{r.note}</Text> : null}
            </View>
          ) : !info.eligible ? (
            <Text style={T("md", "medium", colors.subText)}>{info.why_not}</Text>
          ) : (
            <>
              <Text style={T("sm", "regular", colors.subText)}>
                Returns until {new Date(info.until!).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}. Delivery and platform fees are not refunded.
              </Text>
              {info.lines.map((l) => (
                <ReturnLineRow key={l.order_item_id} line={l} qty={qty[l.order_item_id] ?? 0}
                  onChange={(n) => setQty((q) => ({ ...q, [l.order_item_id]: n }))} />
              ))}
              <TextInput
                value={reason} onChangeText={setReason} placeholder="Why? (optional)" placeholderTextColor={colors.subText}
                maxLength={500} multiline
                style={[styles.input, T("sm"), { borderColor: colors.border, backgroundColor: colors.card }]}
              />
              <TouchableOpacity
                onPress={submit} disabled={picked.length === 0 || sending}
                style={[styles.cta, { backgroundColor: colors.primary, opacity: picked.length === 0 || sending ? 0.5 : 1 }]}
              >
                <Text style={T("md", "semiBold", colors.white)}>
                  {sending ? "Sending…" : picked.length ? `Request return (${picked.length} item${picked.length === 1 ? "" : "s"})` : "Pick items to return"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  center: { marginTop: 40, alignItems: "center", gap: 6 },
  body: { padding: 16, gap: 12, paddingBottom: 48 },
  note: { padding: 14, borderRadius: 12, borderWidth: 1, gap: 6 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 70, textAlignVertical: "top" },
  cta: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
});
