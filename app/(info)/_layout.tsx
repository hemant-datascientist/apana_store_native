// ============================================================
// INFO LAYOUT — Apana Store (Customer App)
//
// Route group for informational + settings screens:
//   about-us, help-support, sell-ondc, rate-us,
//   language, notifications
//
// All screens manage their own headers.
// ============================================================

import { Stack } from "expo-router";

export default function InfoLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="about-us"     />
      <Stack.Screen name="help-support" />
      <Stack.Screen name="sell-ondc"    />
      <Stack.Screen name="rate-us"      />
      <Stack.Screen name="language"     />
      <Stack.Screen name="notifications"/>
    </Stack>
  );
}
