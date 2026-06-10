// ============================================================
// STORE SHORT-LINK — /s/<id> deep-link + universal-link entry
// (apanastore://s/<id> and https://apana.app/s/<id> from a shared link or QR).
// Redirects into the storefront and follows on landing (share/scan → follow,
// §30 growth loop). Mirrors the apc/<code> registry deep-link entry.
// ============================================================

import { Redirect, useLocalSearchParams } from "expo-router";

export default function StoreShortLink() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <Redirect href={`/store-detail?id=${id ?? ""}&follow=1`} />;
}
