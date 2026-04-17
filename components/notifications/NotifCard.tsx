// ============================================================
// NOTIF CARD — Apana Store (Notifications Component)
//
// Single notification card row within the feed list.
// Unread cards get a light tinted background + left dot indicator.
//
// Note: item.color/item.bg are category-specific accent colors
// from the data layer (backend-driven), not theme tokens.
//
// Props:
//   item      — NotifItem data
//   isFirst   — removes top border on the first card
//   onPress   — marks the notification as read
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons }  from "@expo/vector-icons";
import useTheme      from "../../theme/useTheme";
import { typography }from "../../theme/typography";
import { NotifItem } from "../../data/notificationsData";

interface NotifCardProps {
  item:    NotifItem;
  isFirst: boolean;
  onPress: (id: string) => void;
}

export default function NotifCard({ item, isFirst, onPress }: NotifCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: item.read ? colors.card : colors.primary + "06" },
        !isFirst && [styles.borderTop, { borderTopColor: colors.background }],
      ]}
      activeOpacity={0.75}
      onPress={() => onPress(item.id)}
    >
      {/* Unread indicator dot */}
      {!item.read && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}

      {/* ── Category icon ── */}
      <View style={[styles.iconWrap, { backgroundColor: item.bg }]}>
        <Ionicons name={item.icon as any} size={20} color={item.color} />
      </View>

      {/* ── Content ── */}
      <View style={styles.content}>
        {/* Title row with timestamp */}
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, {
              color:      colors.text,
              fontFamily: item.read
                ? typography.fontFamily.medium
                : typography.fontFamily.semiBold,
              fontSize: typography.size.xs + 1,
            }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={[styles.time, {
            color:      colors.subText,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.xs - 2,
          }]}>
            {item.time}
          </Text>
        </View>

        {/* Body text */}
        <Text
          style={[styles.body, {
            color:      colors.subText,
            fontFamily: typography.fontFamily.regular,
            fontSize:   typography.size.xs,
          }]}
          numberOfLines={2}
        >
          {item.body}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection:     "row",
    alignItems:        "flex-start",
    gap:               12,
    paddingHorizontal: 14,
    paddingVertical:   14,
    position:          "relative",
  },
  borderTop: {
    borderTopWidth: 1,
  },
  unreadDot: {
    position:     "absolute",
    left:         6,
    top:          18,
    width:        6,
    height:       6,
    borderRadius: 3,
  },
  iconWrap: {
    width:          42,
    height:         42,
    borderRadius:   12,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  content: {
    flex: 1,
    gap:  4,
  },
  titleRow: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    gap:            8,
  },
  title:   { flex: 1 },
  time:    { flexShrink: 0 },
  body:    { lineHeight: 18 },
});
