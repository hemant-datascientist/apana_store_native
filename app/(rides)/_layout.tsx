// ============================================================
// RIDES LAYOUT — Apana Store (Customer App)
//
// Route group for the Apana Partner ride surfaces:
//   auto-riders — live riders map + nearest-first booking list
// Screens manage their own headers.
// ============================================================

import { Stack } from "expo-router";

export default function RidesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auto-riders" />
    </Stack>
  );
}
