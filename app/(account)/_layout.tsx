// ============================================================
// ACCOUNT LAYOUT — Apana Store (Customer App)
//
// Route group for account-management screens:
//   address-book, payment-methods, add-payment, favourite
//
// All screens manage their own headers.
// ============================================================

import { Stack } from "expo-router";

export default function AccountLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="address-book"    />
      <Stack.Screen name="payment-methods" />
      <Stack.Screen name="add-payment"     />
      <Stack.Screen name="favourite"       />
    </Stack>
  );
}
