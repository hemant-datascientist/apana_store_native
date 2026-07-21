// ============================================================
// STORE LAYOUT — Apana Store (Customer App)
//
// Route group for store-browsing screens:
//   store-detail, store-live, store-qr
//
// All screens manage their own headers.
// ============================================================

import { Stack } from "expo-router";

export default function StoreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="store-detail" />
      <Stack.Screen name="store-live"   />
      <Stack.Screen name="store-qr"     />
      <Stack.Screen name="state-detail" />
      <Stack.Screen name="bharat-bazaar" />
      <Stack.Screen name="store-categories" />
      <Stack.Screen name="service-detail" />
      <Stack.Screen name="store-type" />
      {/* §16.11 ASvC booking + §16.12 AMC dish ordering */}
      <Stack.Screen name="service-stores" />
      <Stack.Screen name="service-store" />
      <Stack.Screen name="menu-stores" />
      <Stack.Screen name="menu-store" />
    </Stack>
  );
}
