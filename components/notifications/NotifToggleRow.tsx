// ============================================================
// NOTIF TOGGLE ROW — Apana Store (Notifications Component)
//
// Single push-notification preference toggle row.
// Icon + label + description on the left; Switch on the right.
//
// Note: icon/color come from the data layer (category-specific
// accent colors, not theme tokens — they originate from the backend).
//
// Props:
//   toggle  — NotifToggle data item
//   enabled — current on/off state
//   onFlip  — called when Switch is toggled
// ============================================================

import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { Ionicons }     from "@expo/vector-icons";
import useTheme         from "../../theme/useTheme";
import { typography }   from "../../theme/typography";
import { NotifToggle }  from "../../data/notificationsData";

interface NotifToggleRowProps {
  toggle:  NotifToggle;
  enabled: boolean;
  onFlip:  () => void;
}

export default function NotifToggleRow({ toggle, enabled, onFlip }: NotifToggleRowProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {/* ── Category icon ── */}
      <View style={[styles.iconWrap, { backgroundColor: toggle.color + "15" }]}>
        <Ionicons name={toggle.icon as any} size={18} color={toggle.color} />
      </View>

      {/* ── Label + description ── */}
      <View style={styles.textBlock}>
        <Text style={[styles.label, {
          color:      colors.text,
          fontFamily: typography.fontFamily.medium,
          fontSize:   typography.size.sm,
        }]}>
          {toggle.label}
        </Text>
        <Text style={[styles.desc, {
          color:      colors.subText,
          fontFamily: typography.fontFamily.regular,
          fontSize:   typography.size.xs - 1,
        }]} numberOfLines={2}>
          {toggle.desc}
        </Text>
      </View>

      {/* ── Toggle switch ── */}
      <Switch
        value={enabled}
        onValueChange={onFlip}
        trackColor={{ false: colors.border, true: colors.primary + "60" }}
        thumbColor={enabled ? colors.primary : colors.subText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               12,
    paddingHorizontal: 14,
    paddingVertical:   14,
  },
  iconWrap: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  textBlock: {
    flex: 1,
    gap:  2,
  },
  label: {},
  desc:  { lineHeight: 15 },
});
