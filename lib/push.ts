// ============================================================
// PUSH — ring this phone when the server has news (FCM).
//
// The inbox the app polls only works while the app is open. A new order at a
// shop whose app is in the background was silent until the 2-minute accept
// window expired — push is what tells them in time.
//
// Kept PARALLEL in all three apps (like lib/sound.ts); only the API call and
// the tap destination differ, and those are passed in.
//
// ⚠ NATIVE: needs expo-notifications in a dev/release build plus the app's
// google-services.json from Firebase. Without them every step below is a
// no-op — the inbox still works, nothing crashes.
// ============================================================

import { Platform } from "react-native";

// Lazy: a top-level import crashes
// Expo Go, and on web it touches localStorage during server render.
let Notifications: typeof import("expo-notifications") | null = null;
if (Platform.OS !== "web") {
  try {
    Notifications = require("expo-notifications");
  } catch {
    // Expo Go — push unavailable.
  }
}

/** Must match the channel the server names (modules/notifications/src/push.ts). */
const CHANNEL_ID = "orders";

let handlerSet = false;

/**
 * Asks permission, registers this phone's FCM token with `send`, re-sends it
 * if FCM rotates it, and routes a tap to `onOpen`. Returns a cleanup.
 */
export function startPush(
  send: (token: string) => Promise<unknown>,
  onOpen: (data: Record<string, unknown>) => void,
): () => void {
  const N = Notifications;
  if (!N) return () => {};
  const subs: { remove(): void }[] = [];

  if (!handlerSet) {
    handlerSet = true;
    // Shown while the app is open too — a new order must not be silent just
    // because the shopkeeper happens to be on another screen.
    N.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false,
      }),
    });
  }

  void (async () => {
    try {
      if (Platform.OS === "android") {
        await N.setNotificationChannelAsync(CHANNEL_ID, {
          name: "Orders",
          importance: N.AndroidImportance.MAX,
          sound: "default",
        });
      }
      const current = await N.getPermissionsAsync();
      const granted = current.granted || (await N.requestPermissionsAsync()).granted;
      if (!granted) return;
      // The raw FCM token (not an Expo token): the server talks to FCM itself.
      const { data } = await N.getDevicePushTokenAsync();
      await send(String(data));
    } catch (err) {
      // No google-services.json, no Play services, or offline — the inbox
      // still works. Logged, never thrown into a screen.
      console.warn("[push] not registered:", (err as Error).message);
    }
  })();

  subs.push(N.addPushTokenListener(({ data }) => { void send(String(data)).catch(() => {}); }));
  subs.push(N.addNotificationResponseReceivedListener((r) => {
    onOpen((r.notification.request.content.data ?? {}) as Record<string, unknown>);
  }));
  return () => subs.forEach((s) => s.remove());
}

/** This phone's current token, for sign-out. null when push never registered. */
export async function currentPushToken(): Promise<string | null> {
  try {
    return Notifications ? String((await Notifications.getDevicePushTokenAsync()).data) : null;
  } catch {
    return null;
  }
}
