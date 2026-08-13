// ============================================================
// callPhone — ring the shop or the rider from the device dialer.
//
// MVP DECISION: no call masking, no WebRTC, no relay. The customer, seller and
// partner identities ARE phone numbers in V1, so the cheapest correct thing is
// to hand the number to the OS dialer and let the carrier do what it is good
// at. That works with the app backgrounded, on a 2G signal, with no push
// credential and no TURN server — none of which is true of an in-app voice
// call.
//
// THE TRADE, STATED PLAINLY: both parties see each other's real number. A proxy
// service (a virtual number that bridges two legs) is what removes that, and it
// swaps in behind this one function plus the two backend fields that feed it.
//
// The number only ever arrives from the server, and only while the order is
// live — see delivery/tracking.ts. Nothing here fabricates or stores one.
// ============================================================

import { Alert, Linking, Platform } from "react-native";

/** Strips spaces/dashes a human typed; keeps a leading +. */
function toDialable(phone: string): string {
  const trimmed = phone.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return plus + trimmed.replace(/[^0-9]/g, "");
}

/**
 * Opens the dialer for `phone`. `who` names the person in the failure message —
 * "Could not call the rider" is actionable; "Could not call" is not.
 *
 * Uses `tel:` (not `telprompt:`) on both platforms: telprompt is iOS-only and
 * silently does nothing on Android.
 */
export async function callPhone(phone: string | null | undefined, who: string): Promise<void> {
  const number = phone ? toDialable(phone) : "";
  if (!number) {
    // Not an error state to hide — a missing number means the order is not live
    // or the person never registered one, and the caller should not have shown
    // a call button at all.
    Alert.alert(`No number for the ${who}`, "This becomes available once the order is on its way.");
    return;
  }
  const url = `tel:${number}`;
  try {
    // canOpenURL is unreliable for tel: on Android (it returns false on devices
    // with no dialer app AND on some that have one), so attempt the open and let
    // the failure surface, rather than refusing a call that would have worked.
    await Linking.openURL(url);
  } catch {
    Alert.alert(
      `Could not call the ${who}`,
      Platform.OS === "ios"
        ? "Your device could not open the dialer."
        : `Dial ${number} manually.`,
    );
  }
}
