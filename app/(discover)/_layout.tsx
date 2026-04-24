// ============================================================
// DISCOVER LAYOUT — Apana Store (Customer App)
//
// Route group for discovery + browsing screens:
//   search-results, product-detail, product-finder,
//   scanner, brands, offer-zone, new-launchers
//
// All screens manage their own headers.
// ============================================================

import { Stack } from "expo-router";

export default function DiscoverLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="search-results"  />
      <Stack.Screen name="product-detail"  />
      <Stack.Screen name="product-finder"  />
      <Stack.Screen name="scanner"         />
      <Stack.Screen name="brands"          />
      <Stack.Screen name="offer-zone"      />
      <Stack.Screen name="new-launchers"   />
    </Stack>
  );
}
