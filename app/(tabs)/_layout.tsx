// ============================================================
// TABS LAYOUT — Apana Store (Customer App)
//
// Five primary tabs:
//   Home     — Nearby stores, featured collections, personalized feed
//   Category — Browse by store category (Grocery, Pharmacy, etc.)
//   Bharat   — India Map (CENTER HERO TAB): live local discovery,
//              store pins, LIVE inventory, occupancy, barcode scan
//   Cart     — Multi-store cart + route optimizer
//   Profile  — Account, saved stores, privacy, support
//
// The Bharat tab is the center hero — visually elevated with a
// filled Apana Blue circle badge, like a discovery FAB in the bar.
// ============================================================

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme from "../../theme/useTheme";
import { typography } from "../../theme/typography";

// ── Tab bar dimensions ─────────────────────────────────────────
const TAB_HEIGHT = 62;

// ── Regular tab icon ───────────────────────────────────────────
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
      <Ionicons
        name={focused ? name : (`${name}-outline` as keyof typeof Ionicons.glyphMap)}
        size={22}
        color={color}
      />
      <Text
        style={[
          styles.iconLabel,
          {
            color,
            fontFamily: focused
              ? typography.fontFamily.semiBold
              : typography.fontFamily.regular,
            fontSize: typography.size.xs,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

// ── Bharat center hero tab ─────────────────────────────────────
// Elevated circle badge — stands out as the discovery focal point
function BharatTabIcon({ focused }: { focused: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={styles.bharatWrapper}>
      {/* Elevated circle */}
      <View
        style={[
          styles.bharatCircle,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            // Subtle glow when active
            opacity: focused ? 1 : 0.85,
          },
        ]}
      >
        <Ionicons name="map" size={26} color="#fff" />
      </View>
      <Text
        style={[
          styles.bharatLabel,
          {
            color:      colors.primary,
            fontFamily: focused
              ? typography.fontFamily.bold
              : typography.fontFamily.semiBold,
            fontSize: typography.size.xs,
          },
        ]}
      >
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
          height:          TAB_HEIGHT + insets.bottom,
          paddingBottom:   insets.bottom,
          paddingTop:      6,
          elevation:       14,
          shadowColor:     "#000",
          shadowOpacity:   0.09,
          shadowRadius:    14,
          shadowOffset:    { width: 0, height: -3 },
        },
        tabBarShowLabel: false,
      }}
    >
      {/* ── 1. Home ── */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="home" label="Home" focused={focused} color={color} />
          ),
        }}
      />

      {/* ── 2. Category ── */}
      <Tabs.Screen
        name="category"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="grid" label="Category" focused={focused} color={color} />
          ),
        }}
      />

      {/* ── 3. Bharat (CENTER HERO) ── */}
      <Tabs.Screen
        name="bharat"
        options={{
          tabBarIcon: ({ focused }) => <BharatTabIcon focused={focused} />,
        }}
      />

      {/* ── 4. Cart ── */}
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="bag" label="Cart" focused={focused} color={color} />
          ),
        }}
      />

      {/* ── 5. Profile ── */}
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
  // Regular tab
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingTop: 2,
  },
  iconLabel: {
    letterSpacing: 0.2,
  },

  // Bharat center tab
  bharatWrapper: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    // Lift the circle above the tab bar top edge
    marginTop: -20,
  },
  bharatCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  bharatLabel: {
    letterSpacing: 0.3,
  },
});
