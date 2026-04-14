// ============================================================
// TABS LAYOUT — Apana Store (Customer App)
//
// Delegates the entire tab bar to BottomNavBar (custom component)
// so we have full layout control — no React Navigation wrapper
// width ambiguity, labels never clip or truncate.
//
// Five tabs: Home · Category · Bharat · Cart · Profile
// ============================================================

import { Tabs } from "expo-router";
import BottomNavBar from "../../components/shared/BottomNavBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNavBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* 1 — Home */}
      <Tabs.Screen name="index" />

      {/* 2 — Category */}
      <Tabs.Screen name="category" />

      {/* 3 — Bharat (India Map) */}
      <Tabs.Screen name="bharat" />

      {/* 4 — Cart */}
      <Tabs.Screen name="cart" />

      {/* 5 — Profile */}
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
