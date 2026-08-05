// ============================================================
// ROOT INDEX — Apana Store (Customer App)
//
// Redirect guard on app launch:
//   apana_user or apana_guest = "true" → /(tabs) (returning user / guest)
//   otherwise                          → /(auth)/get-started (onboarding)
// ============================================================

import { useEffect } from "react";
import { router }    from "expo-router";
import AsyncStorage  from "@react-native-async-storage/async-storage";

export default function Index() {
  useEffect(() => {
    (async () => {
      try {
        const [user, guest] = await Promise.all([
          AsyncStorage.getItem("apana_user"),
          AsyncStorage.getItem("apana_guest_mode"),
        ]);
        if (user || guest === "true") {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/get-started");
        }
      } catch {
        router.replace("/(auth)/get-started");
      }
    })();
  }, []);

  return null;
}
