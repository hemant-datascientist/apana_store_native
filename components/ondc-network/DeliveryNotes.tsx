// Before delivery: the code the customer gives the delivery person (when the shop's app set
// one), and instructions for the delivery (ONDC update, target fulfillment).
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { updateNetworkDelivery, type NetworkOrder } from "../../services/ondcNetworkService";

const MAX_LEN = 500;

export default function DeliveryNotes({ order }: { order: NetworkOrder }) {
  const { colors } = useTheme();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ ok: boolean; msg: string } | null>(null);

  const send = async () => {
    setBusy(true); setNote(null);
    try {
      await updateNetworkDelivery(order.id, { instructions: text.trim() });
      setNote({ ok: true, msg: "Sent to the shop." });
      setText("");
    } catch (e) {
      setNote({ ok: false, msg: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      {order.delivery_code ? (
        <Text style={[styles.code, { color: colors.text }]}>Delivery code: <Text style={{ color: colors.primary }}>{order.delivery_code}</Text> — tell this to the delivery person.</Text>
      ) : null}
      <TextInput
        value={text}
        onChangeText={setText}
        maxLength={MAX_LEN}
        placeholder="Delivery instructions (e.g. ring twice, leave with the guard)"
        placeholderTextColor={colors.subText}
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        multiline
      />
      <TouchableOpacity disabled={busy || !text.trim()} onPress={() => void send()}
        style={[styles.btn, { borderColor: colors.border, opacity: busy || !text.trim() ? 0.5 : 1 }]}>
        {busy ? <ActivityIndicator color={colors.primary} /> : <Text style={[styles.btnText, { color: colors.primary }]}>Send to the shop</Text>}
      </TouchableOpacity>
      {note ? <Text style={[styles.small, { color: note.ok ? colors.success : colors.danger }]}>{note.msg}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  code: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, minHeight: 60, textAlignVertical: "top", fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm },
  btn: { borderWidth: 1, borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  btnText: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm },
  small: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs },
});
