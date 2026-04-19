// ============================================================
// HANDSHAKE DETAILS — Apana Store
//
// Card showing:
//   • Agent avatar + name + role + rating
//   • Handshake timestamp + date
//   • Order ID + mode
//   • "Digital signature" verified pill
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { HandshakeAgent, formatHandshakeTime, formatHandshakeDate } from "../../data/orderCollectedData";

interface HandshakeDetailsProps {
  agent:      HandshakeAgent;
  agentLabel: string;
  orderId:    string;
  modeLabel:  string;
  modeColor:  string;
  scannedAt:  Date;
}

export default function HandshakeDetails({
  agent, agentLabel, orderId, modeLabel, modeColor, scannedAt,
}: HandshakeDetailsProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

      {/* ── Section title ── */}
      <View style={styles.titleRow}>
        <Ionicons name="shield-checkmark-outline" size={15} color={modeColor} />
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
          Handshake Confirmed
        </Text>
        {/* Digital signature pill */}
        <View style={[styles.sigPill, { backgroundColor: modeColor + "18", borderColor: modeColor + "40" }]}>
          <Ionicons name="lock-closed-outline" size={10} color={modeColor} />
          <Text style={[styles.sigText, { color: modeColor, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
            Signed
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Agent row ── */}
      <View style={styles.agentRow}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: agent.avatarColor }]}>
          <Text style={[styles.initials, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            {agent.initials}
          </Text>
        </View>

        {/* Name + role */}
        <View style={styles.agentInfo}>
          <Text style={[styles.agentLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {agentLabel}
          </Text>
          <Text style={[styles.agentName, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            {agent.name}
          </Text>
          <Text style={[styles.agentRole, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {agent.role}
          </Text>
        </View>

        {/* Agent rating */}
        <View style={styles.ratingCol}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color="#F59E0B" />
            <Text style={[styles.ratingVal, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.sm }]}>
              {agent.rating}
            </Text>
          </View>
          <Text style={[styles.ratingOrders, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
            {agent.totalOrders.toLocaleString("en-IN")} orders
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* ── Metadata rows ── */}
      <View style={styles.metaGrid}>

        <View style={styles.metaItem}>
          <Ionicons name="receipt-outline" size={14} color={colors.subText} />
          <View style={styles.metaText}>
            <Text style={[styles.metaLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
              Order ID
            </Text>
            <Text style={[styles.metaValue, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
              {orderId}
            </Text>
          </View>
        </View>

        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color={colors.subText} />
          <View style={styles.metaText}>
            <Text style={[styles.metaLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
              Confirmed at
            </Text>
            <Text style={[styles.metaValue, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
              {formatHandshakeTime(scannedAt)}
            </Text>
          </View>
        </View>

        <View style={styles.metaItem}>
          <Ionicons name="swap-horizontal-outline" size={14} color={colors.subText} />
          <View style={styles.metaText}>
            <Text style={[styles.metaLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
              Mode
            </Text>
            <Text style={[styles.metaValue, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
              {modeLabel}
            </Text>
          </View>
        </View>

        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.subText} />
          <View style={styles.metaText}>
            <Text style={[styles.metaLabel, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
              Date
            </Text>
            <Text style={[styles.metaValue, { color: colors.text, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
              {formatHandshakeDate(scannedAt)}
            </Text>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth:  1,
    overflow:     "hidden",
  },
  titleRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               7,
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  sectionTitle: { flex: 1 },
  sigPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
    borderWidth:       1,
  },
  sigText:  {},
  divider:  { height: 1 },

  agentRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 16,
    paddingVertical:   14,
    gap:               12,
  },
  avatar: {
    width:          52,
    height:         52,
    borderRadius:   26,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  initials:    {},
  agentInfo:   { flex: 1, gap: 2 },
  agentLabel:  {},
  agentName:   {},
  agentRole:   {},
  ratingCol: {
    alignItems: "flex-end",
    gap:        3,
    flexShrink: 0,
  },
  ratingRow:   { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingVal:   {},
  ratingOrders:{},

  metaGrid: {
    flexDirection:     "row",
    flexWrap:          "wrap",
    paddingHorizontal: 12,
    paddingVertical:   12,
    gap:               12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           7,
    width:         "46%",         // 2-column grid
  },
  metaText:  { flex: 1, gap: 2 },
  metaLabel: {},
  metaValue: {},
});
