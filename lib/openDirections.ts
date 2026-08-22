// ============================================================
// OPEN DIRECTIONS — navigate to a shop, in Mappls.
//
// Mappls only, never Google Maps or Mapbox (project rule). Tries the installed
// Mappls app first — common on Indian devices — and falls back to Mappls web.
//
// 🔴 The search results screen used to answer this with an Alert saying
// "Mappls navigation coming soon", while the store page a tap away had a
// working deep link. One copy now, so a second caller cannot drift into a
// placeholder again.
// ============================================================

import { Alert, Linking } from "react-native";

/**
 * Open turn-by-turn directions to a point.
 *
 * Does nothing but SAY SO when the shop has no pin: a store that never set its
 * location cannot be navigated to, and sending someone to 0,0 (the Atlantic)
 * or to a defaulted city centre is worse than telling them it is unknown.
 */
export async function openDirections(
  lat: number | null | undefined,
  lng: number | null | undefined,
  name: string,
): Promise<void> {
  if (lat == null || lng == null || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    Alert.alert(
      "No location for this shop",
      `${name} hasn't set its location yet, so we can't give directions to it.`,
    );
    return;
  }

  const appUrl = `mappls://navigation?target_lat=${lat}&target_lng=${lng}&target_name=${encodeURIComponent(name)}`;
  const webUrl = `https://www.mappls.com/direction?places=${lng},${lat}`;

  const canOpenApp = await Linking.canOpenURL(appUrl).catch(() => false);
  await Linking.openURL(canOpenApp ? appUrl : webUrl).catch(() =>
    Alert.alert("Maps unavailable", "Could not open directions. Please try again."),
  );
}
