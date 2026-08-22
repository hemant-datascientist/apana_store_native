// ============================================================
// ROOT INDEX — Apana Store (Customer App)
//
// Redirect guard on app launch:
//   no account/guest            → /(auth)/get-started   (onboarding)
//   account but NO location     → /(auth)/location-access
//   account + location          → /(tabs)
//
// 🔴 LOCATION IS NOT OPTIONAL, AND THE GATE DID NOT CHECK IT.
//
// Everything this app shows is answered by "where are you": the nearby feed
// is an H3 ring around a point, delivery distance and ETA are measured from
// one, and store discovery returns nothing without coordinates. Launching
// into (tabs) with no location produced a home screen of empty feeds that
// looked broken rather than unconfigured — and the only thing that could
// fill it was a screen the user was never sent to.
//
// Read straight from AsyncStorage rather than LocationContext: this runs as
// the very first route, before the provider has hydrated, and a gate that
// reads a not-yet-loaded value would bounce a user who does have a location.
// ============================================================

import { useEffect } from "react";
import { router }    from "expo-router";
import AsyncStorage  from "@react-native-async-storage/async-storage";

// Mirrors LocationContext's v2 keys. If these diverge the gate silently stops
// working, so they are checked together by scripts/check-storage-keys.mjs.
const KEY_ACTIVE_ADDRESS = "@apana_store:active_address_v2";
const KEY_SESSION        = "apana_access_token";
const KEY_USER           = "apana_user";

/** A location is usable only if it has a point to query with. */
function hasUsablePoint(addrJson: string | null): boolean {
  if (!addrJson) return false;
  try {
    const a = JSON.parse(addrJson) as { lat?: unknown; lng?: unknown };
    return (
      typeof a.lat === "number" && Number.isFinite(a.lat) &&
      typeof a.lng === "number" && Number.isFinite(a.lng)
    );
  } catch {
    return false;
  }
}

export default function Index() {
  useEffect(() => {
    (async () => {
      try {
        const [user, token, addrJson] = await Promise.all([
          AsyncStorage.getItem(KEY_USER),
          AsyncStorage.getItem(KEY_SESSION),
          AsyncStorage.getItem(KEY_ACTIVE_ADDRESS),
        ]);

        // 🔴 BOTH HALVES ARE FACTS NOW, NOT FLAGS.
        //
        // This gated on `apana_user` OR `apana_guest_mode === "true"`, and on a
        // `location_ready` flag. Three problems, all of which let someone
        // straight to a home screen they should never have seen:
        //
        //   · `apana_guest_mode` is written by NOTHING — a dead key that only
        //     ever read null, so "guest mode" was never real.
        //   · `apana_user` is a stored profile blob. It survives a token
        //     expiring, so a stale one meant "logged in" forever.
        //   · `location_ready` was set true by an older Skip that saved NO
        //     coordinates — the gate passed and the feeds had nothing to query.
        //
        // A session is a live TOKEN. A location is a POINT. Anything less and
        // the app cannot show one honest thing, so it asks instead.
        const signedIn = Boolean(user) && Boolean(token);
        if (!signedIn) {
          router.replace("/(auth)/get-started");
          return;
        }
        router.replace(hasUsablePoint(addrJson) ? "/(tabs)" : "/(auth)/location-access");
      } catch {
        router.replace("/(auth)/get-started");
      }
    })();
  }, []);

  return null;
}
