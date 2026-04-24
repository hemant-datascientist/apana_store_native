// ============================================================
// CHECKOUT LAYOUT — Apana Store (Customer App)
//
// Route group for the end-to-end checkout + fulfilment flow:
//   checkout → checkout-payment → order-tracking
//   → order-qr → order-collected → invoice
//
// All screens manage their own headers.
// ============================================================

import { Stack } from "expo-router";

export default function CheckoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="checkout"          />
      <Stack.Screen name="checkout-payment"  />
      <Stack.Screen name="order-tracking"    />
      <Stack.Screen name="order-qr"          />
      <Stack.Screen name="order-collected"   />
      <Stack.Screen name="invoice"           />
    </Stack>
  );
}
