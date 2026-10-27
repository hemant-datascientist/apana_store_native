// ============================================================
// ACCEPT COUNTDOWN — the customer's view of the shop's 2-minute window.
//
// Counts down to the server's stored accept_deadline, never created_at + 2m:
// the server enforces that column, so it is the only deadline worth showing.
// At zero it says "expired" rather than vanishing — the server refuses a late
// accept, and a silent timer would leave the shop tapping a dead button.
// ============================================================

import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

const URGENT_MS = 30 * 1000;

export default function AcceptCountdown({ deadline }: { deadline: string }) {
  const { colors } = useTheme();
  const end = new Date(deadline).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (Number.isNaN(end) || now >= end) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [end, now >= end]);

  if (Number.isNaN(end)) return null;
  const left = Math.max(0, end - now);
  const secs = Math.ceil(left / 1000);
  const label = left === 0
    ? "The shop did not respond in time — this order was cancelled"
    : `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")} for the shop to accept`;
  const tone = left <= URGENT_MS ? colors.danger : colors.warning;

  return (
    <View style={[styles.wrap, { backgroundColor: tone + "18" }]}>
      <Ionicons name="timer-outline" size={14} color={tone} />
      <Text style={[styles.text, { color: tone }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row", alignItems: "center", gap: 6,
    alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, marginTop: 8,
  },
  text: { fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs },
});
