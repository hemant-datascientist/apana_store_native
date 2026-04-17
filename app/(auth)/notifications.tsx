// ============================================================
// NOTIFICATIONS — Apana Store (Customer App)
//
// Two sections:
//   1. Push Preferences — toggle per-category notifications
//   2. Recent Feed      — chronological notification cards
//
// Backend:
//   GET  /customer/notification-settings  → toggle states
//   PUT  /customer/notification-settings  { key: boolean }
//   GET  /customer/notifications          → NotifItem[]
//   PUT  /customer/notifications/:id/read
//   DELETE /customer/notifications        (clear all)
//
// Components: AuthHeader, NotifToggleCard, NotifSectionHeader,
//             NotifList, NotifEmptyState
// Data:       NOTIF_TOGGLES, MOCK_NOTIFICATIONS from data/notificationsData.ts
// ============================================================

import React, { useState } from "react";
import {
  View, ScrollView, StyleSheet, StatusBar, Alert, Text,
} from "react-native";
import { useRouter }         from "expo-router";
import useTheme              from "../../theme/useTheme";
import { typography }        from "../../theme/typography";
import { NOTIF_TOGGLES, MOCK_NOTIFICATIONS, NotifItem } from "../../data/notificationsData";
import AuthHeader            from "../../components/auth/AuthHeader";
import NotifToggleCard       from "../../components/notifications/NotifToggleCard";
import NotifSectionHeader    from "../../components/notifications/NotifSectionHeader";
import NotifList             from "../../components/notifications/NotifList";
import NotifEmptyState       from "../../components/notifications/NotifEmptyState";

export default function NotificationsScreen() {
  const router     = useRouter();
  const { colors } = useTheme();

  // Toggle on/off states — all ON by default
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_TOGGLES.map(t => [t.key, true]))
  );

  // Notification feed — read states managed locally
  const [notifs, setNotifs] = useState<NotifItem[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifs.filter(n => !n.read).length;

  // ── Toggle a single push preference ──────────────────────────
  function flipToggle(key: string) {
    setToggles(prev => {
      const next = { ...prev, [key]: !prev[key] };
      // TODO: PUT /customer/notification-settings { [key]: next[key] }
      return next;
    });
  }

  // ── Mark a single notification as read ───────────────────────
  function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    // TODO: PUT /customer/notifications/:id/read
  }

  // ── Mark all as read ─────────────────────────────────────────
  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    // TODO: PUT /customer/notifications/read-all
  }

  // ── Clear all notifications (with confirmation) ───────────────
  function clearAll() {
    Alert.alert("Clear All Notifications?", "This will remove all notifications.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear",  style: "destructive", onPress: () => {
        setNotifs([]);
        // TODO: DELETE /customer/notifications
      }},
    ]);
  }

  // ── Unread badge injected into header's right slot ───────────
  const unreadBadge = unreadCount > 0 ? (
    <View style={[styles.badge, { backgroundColor: colors.danger }]}>
      <Text style={[styles.badgeText, {
        color:      colors.white,
        fontFamily: typography.fontFamily.bold,
        fontSize:   typography.size.xs - 1,
      }]}>
        {unreadCount}
      </Text>
    </View>
  ) : null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── Header with unread count badge ── */}
      <AuthHeader
        title="Notifications"
        onBack={() => router.back()}
        rightSlot={unreadBadge}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Push preferences section ── */}
        <NotifToggleCard
          toggles={NOTIF_TOGGLES}
          states={toggles}
          onFlip={flipToggle}
        />

        {/* ── Recent feed header ── */}
        <NotifSectionHeader
          hasNotifs={notifs.length > 0}
          hasUnread={unreadCount > 0}
          onMarkAllRead={markAllRead}
          onClearAll={clearAll}
        />

        {/* ── Feed or empty state ── */}
        {notifs.length === 0 ? (
          <NotifEmptyState />
        ) : (
          <NotifList items={notifs} onPress={markRead} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1 },
  scroll: {
    paddingHorizontal: 16,
    paddingTop:        20,
    paddingBottom:     40,
    gap:               10,
  },
  badge: {
    minWidth:          20,
    height:            20,
    borderRadius:      10,
    alignItems:        "center",
    justifyContent:    "center",
    paddingHorizontal: 5,
  },
  badgeText: {},
});
