// ============================================================
// BOTTOM NAV BAR — Apana Store (Customer App)
//
// Fully custom tab bar replacing React Navigation's default.
// Passed via <Tabs tabBar={...}> so we own the entire layout —
// no wrapper width ambiguity, labels never truncate.
//
// Five tabs: Home · Category · Bharat · Cart · Profile
// Active:   primary color icon + semiBold label
// Inactive: subText color icon + regular label
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import IndiaMapIcon from "./IndiaMapIcon";

// ── Dimensions ────────────────────────────────────────────────
const TAB_HEIGHT = 72;   // visible bar height (dp, excl. safe area)
const ICON_SIZE  = 24;   // icon height in dp
const LABEL_SIZE = 11;   // label font size

// ── Tab definitions (order must match Tabs.Screen order) ──────
const TABS: {
  label: string;
  icon:  keyof typeof Ionicons.glyphMap | "bharat";
}[] = [
  { label: "Home",     icon: "home"   },
  { label: "Category", icon: "grid"   },
  { label: "Bharat",   icon: "bharat" },
  { label: "Cart",     icon: "bag"    },
  { label: "Profile",  icon: "person" },
];

// ── Component ─────────────────────────────────────────────────
export default function BottomNavBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets     = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.card,
          borderTopColor:  colors.border,
          height:          TAB_HEIGHT + insets.bottom,
          paddingBottom:   insets.bottom,
        },
      ]}
    >
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const tab     = TABS[i];
        const color   = focused ? colors.primary : colors.subText;

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.75}
          >
            {/* Icon */}
            {tab.icon === "bharat" ? (
              <IndiaMapIcon size={ICON_SIZE} color={color} />
            ) : (
              <Ionicons
                name={
                  focused
                    ? (tab.icon as keyof typeof Ionicons.glyphMap)
                    : (`${tab.icon}-outline` as keyof typeof Ionicons.glyphMap)
                }
                size={ICON_SIZE}
                color={color}
              />
            )}

            {/* Label */}
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  color,
                  fontFamily: focused
                    ? typography.fontFamily.semiBold
                    : typography.fontFamily.regular,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: 1,
    // Shadow
    elevation:     12,
    shadowColor:   "#000",
    shadowOpacity: 0.08,
    shadowRadius:  12,
    shadowOffset:  { width: 0, height: -3 },
  },
  tab: {
    flex:           1,           // each tab gets exactly 1/5 of bar width
    alignItems:     "center",
    justifyContent: "center",
    gap:            4,
    paddingTop:     10,          // breathing room from top border
  },
  label: {
    fontSize:      LABEL_SIZE,
    textAlign:     "center",
    letterSpacing: 0.1,
  },
});
