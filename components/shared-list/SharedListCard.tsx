// ============================================================
// SHARED LIST CARD — Apana Store
//
// Summary card for one shared list on the overview screen.
// Shows: list name, contact avatar + name, status badge,
// item progress (X/Y checked), and created time.
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import { SharedList, STATUS_CONFIG } from "../../data/sharedListData";

interface SharedListCardProps {
  list:    SharedList;
  onPress: () => void;
}

export default function SharedListCard({ list, onPress }: SharedListCardProps) {
  const { colors } = useTheme();

  const checkedCount = list.items.filter(i => i.checked).length;
  const totalCount   = list.items.length;
  const progress     = totalCount > 0 ? checkedCount / totalCount : 0;
  const statusCfg    = STATUS_CONFIG[list.status];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* ── Top row: list icon + name + status ── */}
      <View style={styles.topRow}>
        <View style={[styles.listIcon, { backgroundColor: colors.primary + "15" }]}>
          <Ionicons name="list-outline" size={18} color={colors.primary} />
        </View>

        <View style={styles.nameBlock}>
          <Text style={[styles.listName, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]} numberOfLines={1}>
            {list.name}
          </Text>
          <Text style={[styles.time, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
            {list.createdByMe ? "Sent to" : "From"} {list.contact.name} · {list.createdAt}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
          <Text style={[styles.statusText, { color: statusCfg.color, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
            {statusCfg.label}
          </Text>
        </View>
      </View>

      {/* ── Progress bar ── */}
      <View style={styles.progressBlock}>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, {
            backgroundColor: list.status === "completed" ? "#22C55E" : colors.primary,
            width: `${progress * 100}%` as any,
          }]} />
        </View>
        <Text style={[styles.progressLabel, { color: colors.subText, fontFamily: typography.fontFamily.medium, fontSize: typography.size.xs }]}>
          {checkedCount}/{totalCount} items
        </Text>
      </View>

      {/* ── Bottom: assignee avatar + live location hint ── */}
      <View style={styles.bottomRow}>
        <View style={[styles.avatar, { backgroundColor: list.contact.color }]}>
          <Text style={[styles.avatarText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xs }]}>
            {list.contact.initials}
          </Text>
        </View>

        <Text style={[styles.contactName, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]}>
          {list.contact.name}
        </Text>

        {list.locationHint && (
          <View style={[styles.liveChip, { backgroundColor: "#22C55E" + "18" }]}>
            <View style={styles.liveDot} />
            <Text style={[styles.liveText, { color: "#16A34A", fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.ss }]}>
              Live
            </Text>
          </View>
        )}

        <Ionicons name="chevron-forward" size={16} color={colors.subText} style={{ marginLeft: "auto" }} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth:  1,
    padding:      14,
    gap:          12,
  },

  topRow: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           10,
  },
  listIcon: {
    width:          38,
    height:         38,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
  },
  nameBlock: { flex: 1 },
  listName:  { lineHeight: 22 },
  time:      { marginTop: 2 },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
    alignSelf:         "flex-start",
  },
  statusText: {},

  // Progress
  progressBlock: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           10,
  },
  progressTrack: {
    flex:         1,
    height:       6,
    borderRadius: 3,
    overflow:     "hidden",
  },
  progressFill: {
    height:       6,
    borderRadius: 3,
  },
  progressLabel: { minWidth: 60 },

  // Bottom row
  bottomRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
  },
  avatar: {
    width:          28,
    height:         28,
    borderRadius:   14,
    alignItems:     "center",
    justifyContent: "center",
  },
  avatarText:  { color: "#fff" },
  contactName: {},

  liveChip: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               4,
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
  },
  liveDot: {
    width:        6,
    height:       6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  liveText: {},
});
