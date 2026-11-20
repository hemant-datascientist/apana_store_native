// A placed ONDC order: where it is, cancelling it, and the refund Apana owes.
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { useRouter } from "expo-router";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { cancelReasons, type NetworkOrder } from "../../services/ondcNetworkService";
import OrderReturns from "./OrderReturns";

const rupees = (p: number) => `₹${(p / 100).toFixed(2)}`;
const BY: Record<string, string> = { buyer: "you", seller: "the shop", apana: "Apana (the shop never confirmed)" };

export default function OrderAfterSale({ order, busy, onCancel, onRefresh }: {
  order: NetworkOrder; busy: boolean; onCancel: (reasonId: string) => void; onRefresh: () => void;
}) {
  const { colors } = useTheme();
  const router = useRouter();
  const report = (
    <TouchableOpacity onPress={() => router.push({ pathname: "/ondc-issue", params: { order_id: order.id } })} style={[styles.btn, { borderColor: colors.border }]}>
      <Text style={[styles.btnText, { color: colors.primary }]}>Report a problem</Text>
    </TouchableOpacity>
  );
  const [reasons, setReasons] = useState<Array<{ id: string; label: string }>>([]);
  const [asking, setAsking] = useState(false);
  useEffect(() => { if (asking && reasons.length === 0) cancelReasons().then((r) => setReasons(r.items)).catch(() => setReasons([])); }, [asking]);

  const text = (s: string, color = colors.text, bold = false) => (
    <Text style={[styles.line, { color, fontFamily: bold ? typography.fontFamily.semiBold : typography.fontFamily.regular }]}>{s}</Text>
  );

  if (order.status === "cancelled") {
    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {text(`Cancelled by ${BY[order.cancelled_by ?? ""] ?? "the shop"}.`, colors.text, true)}
        {order.refund
          ? order.refund.due_paise > 0
            ? text(order.refund.refunded_at ? `Refunded ${rupees(order.refund.due_paise)}.` : `Refund of ${rupees(order.refund.due_paise)} is being processed.`, colors.success)
            : text(order.refund.note && order.payment.collected_by === "BPP" ? order.refund.note : "No refund is due for this order.", colors.subText)
          : null}
        {order.refund?.note && order.refund.due_paise !== (order.total_paise ?? 0) ? text(order.refund.note, colors.subText) : null}
        <OrderReturns order={order} canReturn={false} />
        {order.paid ? report : null}
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {text(order.status === "cancelling" ? "Cancelling — waiting for the shop's app." : `Status: ${order.fulfillment_state ?? order.ondc_state ?? "placed"}`, colors.text, true)}
      {order.status === "cancelling" && order.can_force_cancel ? (
        <TouchableOpacity disabled={busy} onPress={() => onCancel(order.cancel_reason_id ?? "052")} style={[styles.btn, { borderColor: colors.border }]}>
          <Text style={[styles.btnText, { color: colors.danger }]}>The shop has not answered — Cancel anyway</Text>
        </TouchableOpacity>
      ) : null}
      {order.status === "confirmed" ? (
        <View style={styles.row}>
          <TouchableOpacity disabled={busy} onPress={onRefresh} style={[styles.btn, { borderColor: colors.border }]}>
            {busy ? <ActivityIndicator color={colors.primary} /> : <Text style={[styles.btnText, { color: colors.primary }]}>Check status</Text>}
          </TouchableOpacity>
          {/* Once delivered the goods are here: a return, not a cancellation. */}
          {!order.delivered_at ? (
            <TouchableOpacity disabled={busy} onPress={() => setAsking((a) => !a)} style={[styles.btn, { borderColor: colors.border }]}>
              <Text style={[styles.btnText, { color: colors.danger }]}>Cancel order</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
      {asking && order.status === "confirmed" ? reasons.map((r) => (
        <TouchableOpacity key={r.id} disabled={busy} onPress={() => { setAsking(false); onCancel(r.id); }} style={[styles.reason, { borderColor: colors.border }]}>
          <Text style={[styles.btnText, { color: colors.text }]}>{r.label}</Text>
        </TouchableOpacity>
      )) : null}
      {/* The shop's app collects: its own payment page, until it reports the order paid. */}
      {order.payment.collected_by === "BPP" && order.payment.status !== "PAID" && order.payment.uri ? (
        <TouchableOpacity onPress={() => void Linking.openURL(order.payment.uri!)} style={[styles.btn, { borderColor: colors.border }]}>
          <Text style={[styles.btnText, { color: colors.primary }]}>Pay the shop</Text>
        </TouchableOpacity>
      ) : null}
      {order.payment.collected_by === "BPP" && !order.payment.uri && order.payment.status !== "PAID" ? text("Pay the shop on delivery.", colors.subText) : null}
      {/* A refund agreed in a complaint, on an order that was delivered rather than cancelled. */}
      {order.refund && order.refund.due_paise > 0
        ? text(order.refund.refunded_at ? `Refunded ${rupees(order.refund.due_paise)} after your complaint.` : `Refund of ${rupees(order.refund.due_paise)} is being processed.`, colors.success)
        : null}
      {order.status === "confirmed" ? <OrderReturns order={order} canReturn={!!order.delivered_at} /> : null}
      {order.status === "confirmed" ? report : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 8 },
  line: { fontSize: typography.size.sm },
  row: { flexDirection: "row", gap: 10 },
  btn: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  btnText: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm },
  reason: { borderWidth: 1, borderRadius: 10, padding: 10 },
});
