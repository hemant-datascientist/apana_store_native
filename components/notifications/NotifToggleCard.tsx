// ============================================================
// NOTIF TOGGLE CARD — Apana Store (Notifications Component)
//
// Rounded card wrapping all push-notification toggle rows,
// with hairline dividers between each row.
//
// Props:
//   toggles — NotifToggle[] items from notificationsData
//   states  — Record<key, boolean> current on/off per key
//   onFlip  — (key) toggle a single preference
// ============================================================

import React from "react";
import { View, StyleSheet } from "react-native";
import useTheme        from "../../theme/useTheme";
import { NotifToggle } from "../../data/notificationsData";
import NotifToggleRow  from "./NotifToggleRow";

interface NotifToggleCardProps {
  toggles: NotifToggle[];
  states:  Record<string, boolean>;
  onFlip:  (key: string) => void;
}

export default function NotifToggleCard({ toggles, states, onFlip }: NotifToggleCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, {
      backgroundColor: colors.card,
      borderColor:     colors.border,
    }]}>
      {toggles.map((t, i) => (
        <React.Fragment key={t.key}>
          {/* Divider between rows (not before first) */}
          {i > 0 && (
            <View style={[styles.divider, { backgroundColor: colors.background }]} />
          )}
          <NotifToggleRow
            toggle={t}
            enabled={states[t.key] ?? true}
            onFlip={() => onFlip(t.key)}
          />
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth:  1,
    overflow:     "hidden",
    marginBottom: 8,
  },
  divider: {
    height:           1,
    marginHorizontal: 14,
  },
});
