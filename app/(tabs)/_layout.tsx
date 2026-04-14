// ============================================================
// TABS LAYOUT — Apana Store (Customer App)
//
// Five primary tabs — all identical flat style (icon + label):
//   Home     — house icon
//   Category — grid icon
//   Bharat   — India outline SVG (IndiaMapIcon) — center tab
//   Cart     — bag/cart icon
//   Profile  — person icon
//
// Active:   primary color icon + bold label
// Inactive: subText color icon + regular label
// All tabs same height, same icon size — no elevation or special shapes.
// ============================================================

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";
import IndiaMapIcon from "../../components/shared/IndiaMapIcon";

// ── Icon size — consistent across all tabs ─────────────────────
const ICON_SIZE = 24;

// ── Ionicons tab icon ──────────────────────────────────────────
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
    <View style={styles.tab}>
      <Ionicons
        name={focused ? name : (`${name}-outline` as keyof typeof Ionicons.glyphMap)}
        size={ICON_SIZE}
        color={color}
      />
      <Text style={[
        styles.label,
        {
          color,
          fontFamily: focused ? typography.fontFamily.semiBold : typography.fontFamily.regular,
          fontSize: typography.size.xs,
        },
      ]}>
        {label}
      </Text>
    </View>
  );
}

// ── Bharat tab — India SVG icon, same flat style ───────────────
function BharatTabIcon({ focused, color }: { focused: boolean; color: string }) {
  return (
    <View style={styles.tab}>
      <IndiaMapIcon size={ICON_SIZE} color={color} />
      <Text style={[
        styles.label,
        {
          color,
          fontFamily: focused ? typography.fontFamily.semiBold : typography.fontFamily.regular,
          fontSize: typography.size.xs,
        },
      ]}>
        Bharat
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
        headerShown:             false,
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.subText,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor:  colors.border,
          borderTopWidth:  1,
          height:          62 + insets.bottom,
          paddingBottom:   insets.bottom,
          paddingTop:      6,
          elevation:       12,
          shadowColor:     "#000",
          shadowOpacity:   0.08,
          shadowRadius:    12,
          shadowOffset:    { width: 0, height: -3 },
        },
        tabBarShowLabel: false,
      }}
    >
      {/* 1 — Home */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="home" label="Home" focused={focused} color={color} />
          ),
        }}
      />

      {/* 2 — Category */}
      <Tabs.Screen
        name="category"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="grid" label="Category" focused={focused} color={color} />
          ),
        }}
      />

      {/* 3 — Bharat (India Map) */}
      <Tabs.Screen
        name="bharat"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <BharatTabIcon focused={focused} color={color} />
          ),
        }}
      />

      {/* 4 — Cart */}
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="bag" label="Cart" focused={focused} color={color} />
          ),
        }}
      />

      {/* 5 — Profile */}
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
  tab: {
    alignItems:     "center",
    justifyContent: "center",
    gap:            3,
    paddingTop:     2,
  },
  label: {
    letterSpacing: 0.2,
  },
});
