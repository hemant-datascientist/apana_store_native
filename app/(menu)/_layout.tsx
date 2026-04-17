// ============================================================
// MENU LAYOUT — Apana Store (Customer App)
//
// Route group layout for all menu / utility screens:
//   about-us, address-book, favourite, product-finder,
//   scanner, sell-ondc, store-live, store-qr
//
// All screens manage their own headers, so the Stack
// navigator runs header-less.
// ============================================================

import { Stack } from "expo-router";

export default function MenuLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="about-us"        />
      <Stack.Screen name="address-book"   />
      <Stack.Screen name="favourite"      />
      <Stack.Screen name="help-support"   />
      <Stack.Screen name="order-history"  />
      <Stack.Screen name="payment-methods"/>
      <Stack.Screen name="product-finder" />
      <Stack.Screen name="scanner"        />
      <Stack.Screen name="sell-ondc"      />
      <Stack.Screen name="store-live"     />
      <Stack.Screen name="store-qr"       />
    </Stack>
  );
}
