// ============================================================
// TABS LAYOUT — Apana Store (Customer App)
//
// Five primary tabs:
//   Home     — Map discovery + dual-mode store/product toggle
//   Search   — Full-text search, barcode scanner, filters
//   Cart     — Multi-store cart, route optimizer
//   Orders   — Order, ride, and scan history
//   Profile  — Account, privacy, settings, support
//
// Uses expo-router's built-in Tabs navigator.
// Custom tab bar to be added when screens are built.
// ============================================================

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

// ── Tab icon helper ────────────────────────────────────────────
function TabIcon({
  name,
  label,
  focused,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
  color: string;
}) {
  return (
    <View style={styles.iconWrapper}>
      <Ionicons name={focused ? name : (`${name}-outline` as any)} size={22} color={color} />
      <Text style={[styles.iconLabel, { color, fontFamily: focused ? typography.fontFamily.semiBold : typography.fontFamily.regular, fontSize: typography.size.xs }]}>
        {label}
      </Text>
    </View>
  );
}

// ── Layout ────────────────────────────────────────────────────
export default function TabsLayout() {
  const { colors } = useTheme();
  const insets     = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.subText,
        tabBarStyle: {
          backgroundColor:  colors.card,
          borderTopColor:   colors.border,
          borderTopWidth:   1,
          height:           56 + insets.bottom,
          paddingBottom:    insets.bottom,
          paddingTop:       6,
          elevation:        12,
          shadowColor:      "#000",
          shadowOpacity:    0.08,
          shadowRadius:     12,
          shadowOffset:     { width: 0, height: -3 },
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="home" label="Home" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="search" label="Search" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="bag" label="Cart" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="receipt" label="Orders" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="person" label="Profile" focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingTop: 2,
  },
  iconLabel: {
    letterSpacing: 0.2,
  },
});
