// ============================================================
// ONDC COMPLAINT — a problem with an order from another ONDC app (IGM 2.0).
// Raise it, answer the shop's questions, accept its proposed fix, close it.
// The shop's app answers asynchronously, so this screen re-reads every few seconds.
// ============================================================

import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { goBackOr } from "../../lib/goBack";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import {
  acceptIssueResolution, closeIssue, getIssue, issueCodes, listOrderIssues, raiseIssue, replyToIssue, type NetworkIssue,
} from "../../services/ondcNetworkService";

const POLL_MS = 4000;
const STATUS: Record<string, string> = {
  OPEN: "Sent to the shop", PROCESSING: "The shop is looking into it", NEED_MORE_INFO: "The shop needs more information",
  INFO_PROVIDED: "Information sent", RESOLVED: "The shop has resolved it", CLOSED: "Closed",
};

export default function OndcIssueScreen() {
  const { colors } = useTheme();
  const { order_id } = useLocalSearchParams<{ order_id: string }>();
  const [issue, setIssue] = useState<NetworkIssue | null>(null);
  const [codes, setCodes] = useState<Array<{ code: string; label: string }>>([]);
  const [code, setCode] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Open the order's latest complaint, or offer a new one.
  useEffect(() => {
    if (!order_id) return;
    listOrderIssues(order_id).then((r) => setIssue(r.items[0] ?? null)).catch((e) => setError((e as Error).message));
    issueCodes().then((r) => setCodes(r.items)).catch(() => setCodes([]));
  }, [order_id]);

  useEffect(() => {
    if (!issue || issue.status === "CLOSED") return;
    const t = setInterval(() => { getIssue(issue.id).then(setIssue).catch(() => undefined); }, POLL_MS);
    return () => clearInterval(t);
  }, [issue?.id, issue?.status]);

  const run = useCallback(async (step: () => Promise<NetworkIssue>) => {
    setBusy(true); setError(null);
    try { setIssue(await step()); setText(""); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }, []);

  const asked = issue && (issue.status === "NEED_MORE_INFO" || issue.actions[issue.actions.length - 1]?.code === "INFO_REQUESTED");
  const btn = (label: string, onPress: () => void, color = colors.primary, disabled = false) => (
    <TouchableOpacity style={[styles.btn, { backgroundColor: color, opacity: busy || disabled ? 0.5 : 1 }]} disabled={busy || disabled} onPress={onPress}>
      {busy ? <ActivityIndicator color={colors.white} /> : <Text style={[styles.btnText, { color: colors.white }]}>{label}</Text>}
    </TouchableOpacity>
  );
  const input = (placeholder: string) => (
    <TextInput value={text} onChangeText={setText} placeholder={placeholder} placeholderTextColor={colors.subText} multiline maxLength={1000}
      style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]} />
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={["top"]} style={[styles.header, { borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => goBackOr()} style={{ padding: 8 }}><Ionicons name="arrow-back" size={22} color={colors.text} /></TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Report a problem</Text>
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.body}>
        {!issue ? (
          <>
            {codes.map((c) => (
              <TouchableOpacity key={c.code} onPress={() => setCode(c.code)} style={[styles.choice, { borderColor: code === c.code ? colors.primary : colors.border, backgroundColor: colors.card }]}>
                <Text style={[styles.text, { color: colors.text }]}>{c.label}</Text>
              </TouchableOpacity>
            ))}
            {input("What went wrong? (at least a sentence)")}
            {btn("Send to the shop", () => order_id && code && void run(() => raiseIssue(order_id, code, text)), colors.primary, !code || text.trim().length < 10)}
          </>
        ) : (
          <>
            <Text style={[styles.head, { color: colors.text }]}>{issue.title}</Text>
            <Text style={[styles.text, { color: colors.subText }]}>{STATUS[issue.status] ?? issue.status}</Text>
            {issue.actions.map((a, i) => (
              <Text key={i} style={[styles.small, { color: colors.subText }]}>• {a.text ?? a.code}</Text>
            ))}
            {asked ? <>{input("Answer the shop")}{btn("Send", () => void run(() => replyToIssue(issue.id, text)), colors.primary, text.trim().length < 3)}</> : null}
            {issue.status !== "CLOSED" && !issue.accepted_resolution_id ? issue.resolutions.map((r) => (
              <View key={r.id} style={[styles.choice, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Text style={[styles.text, { color: colors.text }]}>{r.text ?? r.code}{r.refund_paise ? ` (₹${(r.refund_paise / 100).toFixed(2)})` : ""}</Text>
                {btn("Accept", () => void run(() => acceptIssueResolution(issue.id, r.id)))}
              </View>
            )) : null}
            {issue.status !== "CLOSED" ? (
              <View style={styles.row}>
                <View style={{ flex: 1 }}>{btn("Close: resolved", () => void run(() => closeIssue(issue.id, "THUMBS_UP")), colors.success)}</View>
                <View style={{ flex: 1 }}>{btn("Close: not resolved", () => void run(() => closeIssue(issue.id, "THUMBS_DOWN")), colors.danger)}</View>
              </View>
            ) : <Text style={[styles.text, { color: colors.subText }]}>You rated this {issue.rating === "THUMBS_UP" ? "resolved" : "not resolved"}.</Text>}
          </>
        )}
        {error ? <Text style={[styles.text, { color: colors.danger }]}>{error}</Text> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingBottom: 10, borderBottomWidth: 1 },
  title: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xl },
  body: { padding: 16, gap: 10 },
  head: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.lg },
  text: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm },
  small: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs },
  choice: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 8 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 80, textAlignVertical: "top", fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm },
  btn: { borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  btnText: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.sm },
  row: { flexDirection: "row", gap: 10 },
});
