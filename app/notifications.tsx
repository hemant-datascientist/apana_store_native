// ============================================================
// NOTIFICATIONS — Apana Store (Customer App)
//
// Two sections:
//   1. Notification Toggles — push notification preferences
//   2. Recent Notifications — chronological notification feed
//
// Backend:
//   GET  /customer/notification-settings  → toggle states
//   PUT  /customer/notification-settings  { key: boolean }
//   GET  /customer/notifications          → NotificationItem[]
//   PUT  /customer/notifications/:id/read
//   DELETE /customer/notifications        (clear all)
// ============================================================

import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, Switch, StyleSheet,
  StatusBar, ScrollView, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons }     from "@expo/vector-icons";
import { useRouter }    from "expo-router";
import { typography }   from "../theme/typography";

const BRAND_BLUE = "#0F4C81";

// ── Toggle preferences ────────────────────────────────────────
interface NotifToggle {
  key:   string;
  label: string;
  desc:  string;
  icon:  string;
  color: string;
}

const NOTIF_TOGGLES: NotifToggle[] = [
  {
    key:   "orders",
    label: "Order Updates",
    desc:  "Placement confirmed, out for delivery, delivered",
    icon:  "bag-check-outline",
    color: "#0F4C81",
  },
  {
    key:   "delivery",
    label: "Delivery Tracking",
    desc:  "Real-time partner location and ETA updates",
    icon:  "bicycle-outline",
    color: "#1D4ED8",
  },
  {
    key:   "promo",
    label: "Offers & Promotions",
    desc:  "Flash deals, coupons and seasonal discounts",
    icon:  "pricetag-outline",
    color: "#D97706",
  },
  {
    key:   "stores",
    label: "New Stores Nearby",
    desc:  "Get notified when new stores open near you",
    icon:  "storefront-outline",
    color: "#16A34A",
  },
  {
    key:   "reminders",
    label: "Cart Reminders",
    desc:  "Reminder when you leave items in your cart",
    icon:  "cart-outline",
    color: "#7C3AED",
  },
];

// ── Mock notification feed ────────────────────────────────────
interface NotifItem {
  id:      string;
  type:    "order" | "promo" | "store" | "delivery" | "system";
  icon:    string;
  color:   string;
  bg:      string;
  title:   string;
  body:    string;
  time:    string;
  read:    boolean;
}

const MOCK_NOTIFICATIONS: NotifItem[] = [
  {
    id:    "n1",
    type:  "order",
    icon:  "bag-check-outline",
    color: BRAND_BLUE,
    bg:    "#EFF6FF",
    title: "Order Delivered!",
    body:  "Your order from Sharma General Store has been delivered. Rate your experience.",
    time:  "2 min ago",
    read:  false,
  },
  {
    id:    "n2",
    type:  "delivery",
    icon:  "bicycle-outline",
    color: "#1D4ED8",
    bg:    "#DBEAFE",
    title: "Out for Delivery",
    body:  "Ravi Kumar is on the way with your order. ETA 8 minutes.",
    time:  "18 min ago",
    read:  false,
  },
  {
    id:    "n3",
    type:  "promo",
    icon:  "pricetag-outline",
    color: "#D97706",
    bg:    "#FEF3C7",
    title: "Flash Deal — 40% Off Groceries",
    body:  "Today only! Use code FLASH40 at checkout on grocery orders above ₹200.",
    time:  "1 hr ago",
    read:  false,
  },
  {
    id:    "n4",
    type:  "store",
    icon:  "storefront-outline",
    color: "#16A34A",
    bg:    "#DCFCE7",
    title: "New Store Near You",
    body:  "Pune Fresh Mart just opened in Kothrud. Check out their opening deals!",
    time:  "3 hr ago",
    read:  true,
  },
  {
    id:    "n5",
    type:  "order",
    icon:  "receipt-outline",
    color: BRAND_BLUE,
    bg:    "#EFF6FF",
    title: "Order Confirmed — #APL20241",
    body:  "Your order from TechZone Electronics has been confirmed. Estimated delivery: 45 min.",
    time:  "Yesterday",
    read:  true,
  },
  {
    id:    "n6",
    type:  "promo",
    icon:  "gift-outline",
    color: "#7C3AED",
    bg:    "#EDE9FE",
    title: "Refer & Earn ₹100",
    body:  "Invite a friend to Apana Store and earn ₹100 in wallet credits when they place their first order.",
    time:  "2 days ago",
    read:  true,
  },
  {
    id:    "n7",
    type:  "system",
    icon:  "shield-checkmark-outline",
    color: "#16A34A",
    bg:    "#DCFCE7",
    title: "Account Verified",
    body:  "Your Apana Store account has been successfully verified. Happy shopping!",
    time:  "3 days ago",
    read:  true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  // Toggle states — default all ON
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_TOGGLES.map(t => [t.key, true]))
  );

  // Notification read states
  const [notifs, setNotifs] = useState<NotifItem[]>(MOCK_NOTIFICATIONS);
  const unreadCount = notifs.filter(n => !n.read).length;

  function flipToggle(key: string) {
    setToggles(prev => {
      const next = { ...prev, [key]: !prev[key] };
      // TODO: PUT /customer/notification-settings { [key]: next[key] }
      return next;
    });
  }

  function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    // TODO: PUT /customer/notifications/:id/read
  }

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    // TODO: PUT /customer/notifications/read-all
  }

  function clearAll() {
    Alert.alert("Clear All Notifications?", "This will remove all notifications.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear",  style: "destructive", onPress: () => {
        setNotifs([]);
        // TODO: DELETE /customer/notifications
      }},
    ]);
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />

      {/* ── Header ── */}
      <SafeAreaView style={styles.header} edges={["top"]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()} activeOpacity={0.75}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: typography.fontFamily.semiBold }]}>
          Notifications
        </Text>
        {/* Unread badge */}
        {unreadCount > 0 ? (
          <View style={styles.headerBadgeWrap}>
            <View style={styles.headerBadge}>
              <Text style={[styles.headerBadgeText, { fontFamily: typography.fontFamily.bold }]}>
                {unreadCount}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.headerBtn} />
        )}
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* ── Push Notification Preferences ── */}
        <Text style={[styles.sectionTitle, { fontFamily: typography.fontFamily.semiBold }]}>
          PUSH PREFERENCES
        </Text>
        <View style={styles.toggleCard}>
          {NOTIF_TOGGLES.map((t, i) => (
            <React.Fragment key={t.key}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.toggleRow}>
                {/* Icon */}
                <View style={[styles.toggleIcon, { backgroundColor: t.color + "15" }]}>
                  <Ionicons name={t.icon as any} size={18} color={t.color} />
                </View>
                {/* Text */}
                <View style={styles.toggleText}>
                  <Text style={[styles.toggleLabel, { fontFamily: typography.fontFamily.medium }]}>
                    {t.label}
                  </Text>
                  <Text style={[styles.toggleDesc, { fontFamily: typography.fontFamily.regular }]}>
                    {t.desc}
                  </Text>
                </View>
                {/* Switch */}
                <Switch
                  value={toggles[t.key]}
                  onValueChange={() => flipToggle(t.key)}
                  trackColor={{ false: "#E5E7EB", true: BRAND_BLUE + "60" }}
                  thumbColor={toggles[t.key] ? BRAND_BLUE : "#9CA3AF"}
                />
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* ── Recent Notifications ── */}
        <View style={styles.recentHeader}>
          <Text style={[styles.sectionTitle, { fontFamily: typography.fontFamily.semiBold }]}>
            RECENT
          </Text>
          {notifs.length > 0 && (
            <View style={styles.recentActions}>
              {unreadCount > 0 && (
                <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
                  <Text style={[styles.actionLink, { fontFamily: typography.fontFamily.medium }]}>
                    Mark all read
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={clearAll} activeOpacity={0.7}>
                <Text style={[styles.actionLink, { fontFamily: typography.fontFamily.medium, color: "#EF4444" }]}>
                  Clear all
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {notifs.length === 0 ? (
          /* Empty state */
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={40} color="#9CA3AF" />
            </View>
            <Text style={[styles.emptyTitle, { fontFamily: typography.fontFamily.semiBold }]}>
              No notifications yet
            </Text>
            <Text style={[styles.emptySub, { fontFamily: typography.fontFamily.regular }]}>
              Order updates, offers, and alerts will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.notifList}>
            {notifs.map((n, i) => (
              <TouchableOpacity
                key={n.id}
                style={[
                  styles.notifCard,
                  !n.read && styles.notifCardUnread,
                  i === 0 && styles.notifCardFirst,
                  i === notifs.length - 1 && styles.notifCardLast,
                ]}
                activeOpacity={0.75}
                onPress={() => markRead(n.id)}
              >
                {/* Unread dot */}
                {!n.read && <View style={styles.unreadDot} />}

                {/* Icon */}
                <View style={[styles.notifIcon, { backgroundColor: n.bg }]}>
                  <Ionicons name={n.icon as any} size={20} color={n.color} />
                </View>

                {/* Content */}
                <View style={styles.notifContent}>
                  <View style={styles.notifTitleRow}>
                    <Text
                      style={[
                        styles.notifTitle,
                        { fontFamily: n.read ? typography.fontFamily.medium : typography.fontFamily.semiBold },
                      ]}
                      numberOfLines={1}
                    >
                      {n.title}
                    </Text>
                    <Text style={[styles.notifTime, { fontFamily: typography.fontFamily.regular }]}>
                      {n.time}
                    </Text>
                  </View>
                  <Text style={[styles.notifBody, { fontFamily: typography.fontFamily.regular }]} numberOfLines={2}>
                    {n.body}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: "#F8FAFC" },

  // ── Header ──────────────────────────────────────────────────
  header: {
    backgroundColor:   BRAND_BLUE,
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 8,
    paddingBottom:     14,
  },
  headerBtn: {
    width:          48,
    height:         44,
    alignItems:     "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex:      1,
    fontSize:  17,
    color:     "#fff",
    textAlign: "center",
  },
  headerBadgeWrap: {
    width:          48,
    alignItems:     "center",
    justifyContent: "center",
  },
  headerBadge: {
    minWidth:          20,
    height:            20,
    borderRadius:      10,
    backgroundColor:   "#EF4444",
    alignItems:        "center",
    justifyContent:    "center",
    paddingHorizontal: 5,
  },
  headerBadgeText: {
    fontSize: 11,
    color:    "#fff",
  },

  // ── Scroll ──────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: 16,
    paddingTop:        20,
    paddingBottom:     40,
    gap:               10,
  },

  // Section title
  sectionTitle: {
    fontSize:      11,
    color:         "#9CA3AF",
    letterSpacing: 0.8,
    marginBottom:  4,
  },

  // ── Toggle card ──────────────────────────────────────────────
  toggleCard: {
    backgroundColor: "#fff",
    borderRadius:    14,
    borderWidth:     1,
    borderColor:     "#E5E7EB",
    overflow:        "hidden",
    marginBottom:    8,
  },
  toggleRow: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    paddingHorizontal: 14,
    paddingVertical:   14,
  },
  toggleIcon: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  toggleText: {
    flex: 1,
    gap:  2,
  },
  toggleLabel: {
    fontSize: 14,
    color:    "#111827",
  },
  toggleDesc: {
    fontSize:   11,
    color:      "#9CA3AF",
    lineHeight: 15,
  },
  divider: {
    height:           1,
    backgroundColor:  "#F3F4F6",
    marginHorizontal: 14,
  },

  // ── Recent header ────────────────────────────────────────────
  recentHeader: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    marginTop:      4,
  },
  recentActions: {
    flexDirection: "row",
    gap:           14,
    marginBottom:  4,
  },
  actionLink: {
    fontSize: 12,
    color:    BRAND_BLUE,
  },

  // ── Notification list ────────────────────────────────────────
  notifList: {
    borderRadius: 14,
    borderWidth:  1,
    borderColor:  "#E5E7EB",
    overflow:     "hidden",
    backgroundColor: "#fff",
  },
  notifCard: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               12,
    paddingHorizontal: 14,
    paddingVertical:   14,
    backgroundColor:   "#fff",
    position:          "relative",
    borderTopWidth:    1,
    borderTopColor:    "#F3F4F6",
  },
  notifCardFirst: {
    borderTopWidth: 0,
  },
  notifCardLast:  {},
  notifCardUnread: {
    backgroundColor: "#F8FAFF",
  },
  unreadDot: {
    position:        "absolute",
    left:            6,
    top:             18,
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: BRAND_BLUE,
  },
  notifIcon: {
    width:          42,
    height:         42,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  notifContent: {
    flex: 1,
    gap:  4,
  },
  notifTitleRow: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    gap:            8,
  },
  notifTitle: {
    flex:     1,
    fontSize: 13,
    color:    "#111827",
  },
  notifTime: {
    fontSize:  10,
    color:     "#9CA3AF",
    flexShrink: 0,
  },
  notifBody: {
    fontSize:   12,
    color:      "#6B7280",
    lineHeight: 18,
  },

  // ── Empty state ──────────────────────────────────────────────
  emptyWrap: {
    alignItems:    "center",
    paddingTop:    48,
    paddingBottom: 32,
    gap:           12,
  },
  emptyIcon: {
    width:           80,
    height:          80,
    borderRadius:    24,
    backgroundColor: "#F3F4F6",
    alignItems:      "center",
    justifyContent:  "center",
    marginBottom:    4,
  },
  emptyTitle: {
    fontSize: 16,
    color:    "#374151",
  },
  emptySub: {
    fontSize:  13,
    color:     "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
});
