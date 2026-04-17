// ============================================================
// NOTIF LIST — Apana Store (Notifications Component)
//
// Rounded card wrapping all notification cards with
// shared border and overflow clipping.
//
// Props:
//   items   — NotifItem[] to render
//   onPress — (id) mark notification as read
// ============================================================

import React from "react";
import { View, StyleSheet } from "react-native";
import useTheme      from "../../theme/useTheme";
import { NotifItem } from "../../data/notificationsData";
import NotifCard     from "./NotifCard";

interface NotifListProps {
  items:   NotifItem[];
  onPress: (id: string) => void;
}

export default function NotifList({ items, onPress }: NotifListProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.list, {
      borderColor:     colors.border,
      backgroundColor: colors.card,
    }]}>
      {items.map((item, i) => (
        <NotifCard
          key={item.id}
          item={item}
          isFirst={i === 0}
          onPress={onPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    borderRadius: 14,
    borderWidth:  1,
    overflow:     "hidden",
  },
});
