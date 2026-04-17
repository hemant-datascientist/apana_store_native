// ============================================================
// NOTIF SECTION HEADER — Apana Store (Notifications Component)
//
// "RECENT" label + optional action links (Mark all read / Clear all)
// shown above the notification feed list.
//
// Props:
//   hasNotifs    — hides actions when feed is empty
//   hasUnread    — hides "Mark all read" when none are unread
//   onMarkAllRead — marks all as read
//   onClearAll   — clears all notifications (with confirmation)
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

interface NotifSectionHeaderProps {
  hasNotifs:     boolean;
  hasUnread:     boolean;
  onMarkAllRead: () => void;
  onClearAll:    () => void;
}

export default function NotifSectionHeader({
  hasNotifs, hasUnread, onMarkAllRead, onClearAll,
}: NotifSectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {/* ── Section label ── */}
      <Text style={[styles.title, {
        color:      colors.subText,
        fontFamily: typography.fontFamily.semiBold,
        fontSize:   typography.size.xs - 1,
        letterSpacing: 0.8,
      }]}>
        RECENT
      </Text>

      {/* ── Action links (only when feed is non-empty) ── */}
      {hasNotifs && (
        <View style={styles.actions}>
          {/* Mark all read — only shown when unread exist */}
          {hasUnread && (
            <TouchableOpacity onPress={onMarkAllRead} activeOpacity={0.7}>
              <Text style={[styles.link, {
                color:      colors.primary,
                fontFamily: typography.fontFamily.medium,
                fontSize:   typography.size.xs,
              }]}>
                Mark all read
              </Text>
            </TouchableOpacity>
          )}

          {/* Clear all */}
          <TouchableOpacity onPress={onClearAll} activeOpacity={0.7}>
            <Text style={[styles.link, {
              color:      colors.danger,
              fontFamily: typography.fontFamily.medium,
              fontSize:   typography.size.xs,
            }]}>
              Clear all
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    marginTop:      4,
    marginBottom:   4,
  },
  title:   {},
  actions: {
    flexDirection: "row",
    gap:           14,
  },
  link: {},
});
