// ============================================================
// ORDERS LAYOUT — Apana Store (Customer App)
//
// Route group for order history screens:
//   order-history
//
// All screens manage their own headers.
// ============================================================

import { Stack } from "expo-router";

export default function OrdersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="order-history" />
    </Stack>
  );
}
