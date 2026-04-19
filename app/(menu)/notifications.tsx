// ============================================================
// NOTIFICATIONS SCREEN — Apana Store (Customer App)
//
// Shows the customer's notification feed grouped into:
//   Unread — highlighted, shown first
//   Earlier — already read
//
// Tap a notification → marks it read.
// "Mark all read" button in header.
//
// Backend:
//   GET   /customer/notifications         → NotifItem[]
//   PATCH /customer/notifications/read    → mark all read
//   PATCH /customer/notifications/:id/read
// ============================================================

import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import { useRouter }    from "expo-router";

import useTheme         from "../../theme/useTheme";
import { typography }   from "../../theme/typography";
import {
  MOCK_NOTIFICATIONS, NotifItem,
} from "../../data/notificationsData";

export default function NotificationsScreen() {
  const { colors, isDark } = useTheme();
  const router             = useRouter();

  const [items, setItems] = useState<NotifItem[]>(MOCK_NOTIFICATIONS);

  const unread  = useMemo(() => items.filter(n => !n.read),  [items]);
  const earlier = useMemo(() => items.filter(n =>  n.read),  [items]);
  const unreadCount = unread.length;

  // ── Mark single notification as read ─────────────────────
  function handleTap(id: string) {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  // ── Mark all as read ──────────────────────────────────────
  function handleMarkAllRead() {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.card} />

      {/* ── Header ── */}
      <SafeAreaView style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.background }]}
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg }]}>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.unreadBadgeText, { fontFamily: typography.fontFamily.bold, fontSize: typography.size.ss }]}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>

          {/* Mark all read — only shown when there are unread items */}
          {unreadCount > 0 ? (
            <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.75}>
              <Text style={[styles.markAll, { color: colors.primary, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                Mark all read
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backBtn} />
          )}
        </View>
      </SafeAreaView>

      {/* ── Notification list ── */}
      {items.length === 0 ? (
        // Empty state
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="notifications-off-outline" size={36} color={colors.subText} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md }]}>
            No Notifications
          </Text>
          <Text style={[styles.emptySub, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm }]}>
            You're all caught up! Check back later.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* ── Unread section ── */}
          {unread.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                NEW
              </Text>
              {unread.map(item => (
                <NotifRow
                  key={item.id}
                  item={item}
                  onTap={handleMarkAllRead}
                  colors={colors}
                  onPress={() => handleTap(item.id)}
                />
              ))}
            </View>
          )}

          {/* ── Earlier section ── */}
          {earlier.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.subText, fontFamily: typography.fontFamily.semiBold, fontSize: typography.size.xs }]}>
                EARLIER
              </Text>
              {earlier.map(item => (
                <NotifRow
                  key={item.id}
                  item={item}
                  onTap={handleMarkAllRead}
                  colors={colors}
                  onPress={() => handleTap(item.id)}
                />
              ))}
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
    </View>
  );
}

// ── Notification row sub-component ───────────────────────────
interface NotifRowProps {
  item:    NotifItem;
  onTap:   (id: string) => void;
  onPress: () => void;
  colors:  ReturnType<typeof useTheme>["colors"];
}

function NotifRow({ item, onPress, colors }: NotifRowProps) {
  return (
    <TouchableOpacity
      style={[
        styles.row,
        { backgroundColor: item.read ? colors.card : colors.primary + "08", borderColor: colors.border },
        !item.read && { borderLeftColor: colors.primary, borderLeftWidth: 3 },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Icon circle */}
      <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
        <Ionicons name={item.icon as any} size={20} color={item.color} />
      </View>

      {/* Content */}
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <Text style={[styles.rowTitle, {
            color:      colors.text,
            fontFamily: item.read ? typography.fontFamily.regular : typography.fontFamily.semiBold,
            fontSize:   typography.size.sm,
            flex:       1,
          }]} numberOfLines={1}>
            {item.title}
          </Text>
          {!item.read && (
            <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
          )}
        </View>
        <Text style={[styles.rowBody, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.xs }]} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={[styles.rowTime, { color: colors.subText, fontFamily: typography.fontFamily.regular, fontSize: typography.size.ss }]}>
          {item.time}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1 },
  header: { borderBottomWidth: 1 },

  headerRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               10,
    paddingHorizontal: 12,
    paddingVertical:   12,
  },
  backBtn: {
    width:          38,
    height:         38,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex:          1,
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
  },
  headerTitle: {},
  unreadBadge: {
    paddingHorizontal: 7,
    paddingVertical:   2,
    borderRadius:      20,
  },
  unreadBadgeText: { color: "#fff" },
  markAll: {},

  // Empty state
  emptyWrap: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
    gap:            14,
    padding:        32,
  },
  emptyIcon: {
    width:          80,
    height:         80,
    borderRadius:   24,
    alignItems:     "center",
    justifyContent: "center",
    borderWidth:    1,
  },
  emptyTitle: {},
  emptySub:   { textAlign: "center", lineHeight: 20 },

  // List
  scroll:       { gap: 16, padding: 16 },
  section:      { gap: 8 },
  sectionLabel: { letterSpacing: 0.8, marginBottom: 2 },

  row: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               12,
    padding:           14,
    borderRadius:      14,
    borderWidth:       1,
  },
  iconCircle: {
    width:          44,
    height:         44,
    borderRadius:   14,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  rowContent: { flex: 1, gap: 4 },
  rowTop: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
  },
  rowTitle:    {},
  unreadDot: {
    width:        8,
    height:       8,
    borderRadius: 4,
    flexShrink:   0,
  },
  rowBody:     { lineHeight: 17 },
  rowTime:     {},

  bottomSpacer: { height: 20 },
});
