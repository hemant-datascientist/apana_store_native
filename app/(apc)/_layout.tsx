// ============================================================
// APC LAYOUT — Apana Store (Customer App)
//
// Route group for the APC category browser (§27 N-level taxonomy):
//   index   — top-level segments grid + search
//   [code]  — a node: breadcrumb + sub-categories
//
// Screens manage their own headers.
// ============================================================

import { Stack } from "expo-router";

export default function ApcLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[code]" />
    </Stack>
  );
}
