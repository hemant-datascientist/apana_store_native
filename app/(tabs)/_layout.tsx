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
// Active:   primary color icon + semiBold label
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

// ── Dimensions ────────────────────────────────────────────────
const ICON_SIZE   = 24;  // icon height in dp
const TAB_HEIGHT  = 72;  // tab bar visible height (excl. safe area)
const TAB_PAD_TOP = 10;  // gap between top border and icon content

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
      <Text
        numberOfLines={1}
        style={[styles.label, {
          color,
          fontFamily: focused ? typography.fontFamily.semiBold : typography.fontFamily.regular,
          fontSize:   10,
        }]}
      >
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
      <Text
        numberOfLines={1}
        style={[styles.label, {
          color,
          fontFamily: focused ? typography.fontFamily.semiBold : typography.fontFamily.regular,
          fontSize:   10,
        }]}
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
        tabBarShowLabel:         false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor:  colors.border,
          borderTopWidth:  1,
          height:          TAB_HEIGHT + insets.bottom,
          paddingBottom:   insets.bottom,
          // TAB_PAD_TOP pushes icons away from the top separator line
          paddingTop:      TAB_PAD_TOP,
          elevation:       12,
          shadowColor:     "#000",
          shadowOpacity:   0.08,
          shadowRadius:    12,
          shadowOffset:    { width: 0, height: -3 },
        },
        // stretch → icon wrapper fills full cell width so width:'100%'
        // on the tab View resolves to the real screenWidth/5 value,
        // preventing "Category" / "Profile" from truncating.
        tabBarItemStyle: {
          height:          TAB_HEIGHT - TAB_PAD_TOP,
          paddingVertical: 0,
          alignItems:      "stretch",
          justifyContent:  "center",
        },
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
    // width: '100%' is critical — without it the View shrinks to icon width
    // (~24dp) and clips the label text. Full width lets Text use the whole
    // tab cell (≈screenWidth/5) so "Category" and "Profile" never truncate.
    width:          "100%",
    alignItems:     "center",
    justifyContent: "center",
    gap:            4,
  },
  label: {
    textAlign:     "center",
    letterSpacing: 0.1,
  },
});
