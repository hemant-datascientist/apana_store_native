// The shop's own bill lines, exactly as its app sent them, and the total it quoted.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import type { NetworkOrder } from "../../services/ondcNetworkService";

const rupees = (p: number) => `${p < 0 ? "−" : ""}₹${(Math.abs(p) / 100).toFixed(2)}`;

export default function OrderBill({ order, label }: { order: NetworkOrder; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.head, { color: colors.text }]}>{label}</Text>
      {order.breakup.map((b, i) => (
        <View key={i} style={styles.row}>
          <Text style={[styles.line, { color: colors.subText }]} numberOfLines={1}>{b.title ?? b.type ?? "Charge"}</Text>
          {/* An unreadable amount is shown as such, never as ₹0. */}
          <Text style={[styles.line, { color: colors.text }]}>{b.paise == null ? "—" : rupees(b.paise)}</Text>
        </View>
      ))}
      <View style={[styles.row, styles.total, { borderColor: colors.border }]}>
        <Text style={[styles.totalText, { color: colors.text }]}>Total</Text>
        <Text style={[styles.totalText, { color: colors.text }]}>{order.total_paise == null ? "—" : rupees(order.total_paise)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 6 },
  head: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.md, marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  line: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, flexShrink: 1 },
  total: { borderTopWidth: 1, paddingTop: 8, marginTop: 4 },
  totalText: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.md },
});
