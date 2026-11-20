// Returns on a delivered ONDC order: what is being returned and its refund, and a form
// to return an item. The shop's app decides each step, so this re-reads while one is open.
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { listReturns, requestReturn, returnReasons, type NetworkOrder, type NetworkReturn } from "../../services/ondcNetworkService";

const POLL_MS = 5000;
const rupees = (p: number) => `₹${(p / 100).toFixed(2)}`;
const DONE = new Set(["Return_Delivered", "Liquidated", "Return_Rejected", "Return_Failed", "failed", "Order-delivered"]);
const STATE: Record<string, string> = {
  requested: "Sent to the shop", Return_Initiated: "The shop is reviewing it", Return_Approved: "Approved — pickup coming",
  Return_Rejected: "The shop refused the return", Return_Picked: "Picked up", Return_Delivered: "Back at the shop",
  Liquidated: "Accepted (no pickup needed)", Return_Failed: "Return failed", failed: "Could not be sent",
  // A replacement: the shop's app moves the new item's delivery on this same leg.
  Packed: "Replacement packed", "Order-picked-up": "Replacement on its way", "Out-for-delivery": "Replacement out for delivery", "Order-delivered": "Replacement delivered",
};

interface OrderReturnsProps { order: NetworkOrder; canReturn: boolean }

export default function OrderReturns({ order, canReturn }: OrderReturnsProps) {
  const { colors } = useTheme();
  const [returns, setReturns] = useState<NetworkReturn[]>([]);
  const [reasons, setReasons] = useState<Array<{ id: string; label: string }>>([]);
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [reasonId, setReasonId] = useState<string | null>(null);
  const [replace, setReplace] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => listReturns(order.id).then((r) => setReturns(r.items)).catch(() => undefined), [order.id]);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!returns.some((r) => !DONE.has(r.state))) return;
    const t = setInterval(() => void load(), POLL_MS);
    return () => clearInterval(t);
  }, [returns, load]);
  useEffect(() => { if (open && reasons.length === 0) returnReasons().then((r) => setReasons(r.items)).catch(() => setReasons([])); }, [open]);

  // Only what the shop's app said can be returned; the server checks the window and quantity too.
  const returnable = order.items.filter((i) => i.returnable === true);
  const item = returnable.find((i) => i.id === itemId);

  const submit = async () => {
    if (!item || !reasonId) return;
    setBusy(true); setError(null);
    try {
      await requestReturn(order.id, { item_id: item.id, qty, reason_id: reasonId, replace });
      setOpen(false); setItemId(null); setReasonId(null); setQty(1); setReplace(false);
      await load();
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };

  const chip = (label: string, on: boolean, onPress: () => void) => (
    <TouchableOpacity key={label} onPress={onPress} style={[styles.chip, { borderColor: on ? colors.primary : colors.border }]}>
      <Text style={[styles.small, { color: on ? colors.primary : colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrap}>
      {returns.map((r) => {
        const name = order.items.find((i) => i.id === r.item_id)?.name ?? r.item_id;
        return (
          <View key={r.id} style={[styles.ret, { borderColor: colors.border }]}>
            <Text style={[styles.line, { color: colors.text }]}>{r.kind === "part_cancel" ? "Cancelled by the shop" : r.replace ? "Replacement" : "Return"}: {r.qty} × {name}</Text>
            {r.kind === "return" ? (
              <Text style={[styles.small, { color: r.state === "failed" || r.state === "Return_Rejected" ? colors.danger : colors.subText }]}>
                {STATE[r.state] ?? r.state}{r.error ? ` — ${r.error}` : ""}
              </Text>
            ) : null}
            {r.refund && r.replace && r.refund.paise === 0 ? (
              <Text style={[styles.small, { color: colors.subText }]}>A new one is on its way, so there is no refund</Text>
            ) : r.refund ? (
              <Text style={[styles.small, { color: colors.success }]}>
                {r.refund.refunded_at ? `Refunded ${rupees(r.refund.paise)}` : r.refund.note?.includes("shop's app") ? `${rupees(r.refund.paise)} refund from the shop's app` : `Refund of ${rupees(r.refund.paise)} is being processed`}
              </Text>
            ) : null}
          </View>
        );
      })}

      {!canReturn ? null : returnable.length === 0 ? (
        <Text style={[styles.small, { color: colors.subText }]}>The shop does not accept returns on these items. Use Report a problem if something arrived damaged or wrong.</Text>
      ) : !open ? (
        <TouchableOpacity onPress={() => setOpen(true)} style={[styles.btn, { borderColor: colors.border }]}>
          <Text style={[styles.btnText, { color: colors.primary }]}>Return an item</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.form}>
          <View style={styles.chips}>{returnable.map((i) => chip(i.name, i.id === itemId, () => { setItemId(i.id); setQty(1); }))}</View>
          {item && item.qty > 1 ? (
            <View style={styles.qty}>
              {chip("−", false, () => setQty((q) => Math.max(1, q - 1)))}
              <Text style={[styles.line, { color: colors.text }]}>{qty} of {item.qty}</Text>
              {chip("+", false, () => setQty((q) => Math.min(item.qty, q + 1)))}
            </View>
          ) : null}
          <View style={styles.chips}>{reasons.map((r) => chip(r.label, r.id === reasonId, () => setReasonId(r.id)))}</View>
          <View style={styles.chips}>
            {chip("Money back", !replace, () => setReplace(false))}
            {chip("Send a replacement", replace, () => setReplace(true))}
          </View>
          <TouchableOpacity disabled={busy || !item || !reasonId} onPress={() => void submit()}
            style={[styles.btn, { borderColor: colors.border, opacity: busy || !item || !reasonId ? 0.5 : 1 }]}>
            {busy ? <ActivityIndicator color={colors.primary} /> : <Text style={[styles.btnText, { color: colors.primary }]}>{replace ? "Ask for a replacement" : "Send return request"}</Text>}
          </TouchableOpacity>
        </View>
      )}
      {error ? <Text style={[styles.small, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  ret: { borderWidth: 1, borderRadius: 10, padding: 10, gap: 2 },
  form: { gap: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  qty: { flexDirection: "row", alignItems: "center", gap: 10 },
  line: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm },
  small: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs },
  btn: { borderWidth: 1, borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  btnText: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm },
});
