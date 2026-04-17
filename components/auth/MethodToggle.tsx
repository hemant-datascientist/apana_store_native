// ============================================================
// METHOD TOGGLE — Apana Store (Auth Component)
//
// Phone / Email tab switcher on the login screen.
// Active tab has primary background + shadow.
// Inactive tab is gray text on a muted background.
//
// Props:
//   method   — "phone" | "email"
//   onChange — callback when user taps a tab
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons }   from "@expo/vector-icons";
import useTheme       from "../../theme/useTheme";
import { typography } from "../../theme/typography";

type Method = "phone" | "email";

interface MethodToggleProps {
  method:   Method;
  onChange: (m: Method) => void;
}

// ── Tab config ────────────────────────────────────────────────
const TABS: Array<{ key: Method; label: string; icon: string }> = [
  { key: "phone", label: "Phone", icon: "phone-portrait-outline" },
  { key: "email", label: "Email", icon: "mail-outline"           },
];

export default function MethodToggle({ method, onChange }: MethodToggleProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.toggle, { backgroundColor: colors.border + "80" }]}>
      {TABS.map(tab => {
        const active = method === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              active && [styles.tabActive, {
                backgroundColor: colors.primary,
                shadowColor:     colors.primary,
              }],
            ]}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.8}
          >
            {/* ── Tab icon ── */}
            <Ionicons
              name={tab.icon as any}
              size={16}
              color={active ? colors.white : colors.subText}
            />

            {/* ── Tab label ── */}
            <Text style={[styles.tabText, {
              color:      active ? colors.white : colors.subText,
              fontFamily: active
                ? typography.fontFamily.bold
                : typography.fontFamily.medium,
              fontSize: typography.size.sm,
            }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: "row",
    borderRadius:  14,
    padding:       4,
    gap:           4,
  },
  tab: {
    flex:            1,
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             7,
    paddingVertical: 11,
    borderRadius:    10,
  },
  tabActive: {
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius:  6,
    elevation:     3,
  },
  tabText: {},
});
