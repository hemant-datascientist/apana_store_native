// ============================================================
// APC deep-link entry — Apana Store (Customer App)
//
// External surfaces (the APC registry's "Shop on Apana" CTA) link in at
//   apanastore://apc/<code>   (custom scheme)
//   https://<store-origin>/apc/<code>   (universal link, when live)
//
// This literal /apc/<code> route catches that path and redirects into the
// real browser screen at (apc)/<code> (a route group, hidden from the URL).
// Keeping the public deep-link path stable (/apc/...) decouples it from the
// internal route-group layout.
// ============================================================

import { Redirect, useLocalSearchParams } from "expo-router";

export default function ApcDeepLink() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const target = code ? `/(apc)/${String(code)}` : "/(apc)";
  return <Redirect href={target as never} />;
}
