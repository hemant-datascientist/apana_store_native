// ============================================================
// GO BACK — or somewhere real.
//
// 🔴 `router.back()` does NOTHING when there is no history, and expo-router
// only logs "The action 'GO_BACK' was not handled by any navigator". So a
// back button on a screen the user can land on FIRST — from the tab bar,
// from a notification tap, from a deep link, or from restored navigation
// state after a route was renamed or deleted — is a button that silently
// fails.
//
// Same defect the seller app already found and fixed (2026-08-27, 30 calls
// across 22 screens) — the customer app never got the same pass. `order-chat
// .tsx` and `app/+not-found.tsx` had already reached this fix independently
// and are left as-is; every other raw `router.back()` in this app is the gap.
//
// `app/+not-found.tsx` HIDES its back affordance when there is no history
// rather than offering a fallback — the right call for a 404 — so it stays
// exempt rather than being routed through this helper.
// ============================================================

import { router } from "expo-router";

/** Where to land when there is no history. The customer's own home surface. */
const FALLBACK = "/(tabs)";

export function goBackOr(fallback: string = FALLBACK): void {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  // replace, not push: arriving here means there was no stack to return to, so
  // pushing would build one whose back button has the same problem.
  router.replace(fallback as never);
}
