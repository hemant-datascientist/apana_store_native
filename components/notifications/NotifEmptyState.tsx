// ============================================================
// NOTIF EMPTY STATE — Apana Store (Notifications Component)
//
// Shown when the notification feed is empty (cleared or fresh).
// Bell-off icon + title + subtitle.
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

export default function NotifEmptyState() {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      {/* ── Icon circle ── */}
      <View style={[styles.iconWrap, { backgroundColor: colors.background }]}>
        <Ionicons name="notifications-off-outline" size={40} color={colors.subText} />
      </View>

      {/* ── Title ── */}
      <Text style={[styles.title, {
        color:      colors.text,
        fontFamily: typography.fontFamily.semiBold,
        fontSize:   typography.size.md,
      }]}>
        No notifications yet
      </Text>

      {/* ── Subtitle ── */}
      <Text style={[styles.sub, {
        color:      colors.subText,
        fontFamily: typography.fontFamily.regular,
        fontSize:   typography.size.xs + 1,
      }]}>
        Order updates, offers, and alerts will appear here
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems:    "center",
    paddingTop:    48,
    paddingBottom: 32,
    gap:           12,
  },
  iconWrap: {
    width:          80,
    height:         80,
    borderRadius:   24,
    alignItems:     "center",
    justifyContent: "center",
    marginBottom:   4,
  },
  title: {},
  sub:   { textAlign: "center", lineHeight: 20 },
});
