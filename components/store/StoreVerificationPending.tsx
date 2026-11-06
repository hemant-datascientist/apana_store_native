// ============================================================
// STORE VERIFICATION PENDING — the shop is live but not yet verified
// (founder, 2026-11-06). Says so plainly; it takes cash only until then.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface Props {
  pending: boolean | undefined;
  /** Smaller, for a list card. */
  compact?: boolean;
}

export default function StoreVerificationPending({ pending, compact }: Props) {
  const { colors } = useTheme();
  if (!pending) return null;
  return (
    <View style={compact ? styles.compactWrap : styles.wrap}>
      <View style={[styles.pill, compact && styles.pillCompact, { backgroundColor: colors.warning + "18", borderColor: colors.warning + "50" }]}>
        <Ionicons name="time-outline" size={compact ? 12 : 14} color={colors.warning} />
        <Text style={{ color: colors.warning, fontFamily: typography.fontFamily.semiBold, fontSize: compact ? typography.size.ss : typography.size.xs }}>
          Verification pending
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", paddingHorizontal: 16, paddingTop: 10 },
  compactWrap: { flexDirection: "row", marginTop: 4 },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
  pillCompact: { gap: 4, paddingHorizontal: 7, paddingVertical: 2 },
});
