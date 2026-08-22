// ============================================================
// SOUND — audible feedback for the shopper: order updates and the scanner.
//
// Same design as the seller app's lib/sound.ts (kept deliberately parallel
// so a fix in one is obvious to port to the other):
//   * a plain module, not expo-audio's useAudioPlayer hook, because these
//     fire from polls and scan callbacks that outlive any one screen,
//   * ONE reusable player per sound — createAudioPlayer allocates a native
//     player, so making a fresh one per beep leaks them,
//   * seekTo(0) before play, or a second beep in a row is silently ignored
//     because the player is already sitting at the end of the clip,
//   * nothing here can throw into a caller. A sound is decoration on top of
//     a real event; if audio fails the order still arrived.
//
// Bundled rather than served from the backend (unlike the app's images, see
// lib/assetImg.ts): these are a few KB each, and a sound that waits on a
// network round-trip has already missed the moment it was meant to mark.
// ============================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";

export const SOUND_ENABLED_KEY = "apana_sound_enabled";

const SOURCES = {
  /** Barcode captured in the in-app scanner. */
  scan: require("../assets/sounds/scan-beep.wav"),
  /** Scanned code could not be resolved. */
  scanError: require("../assets/sounds/scan-error.wav"),
  /** An order moved: accepted / ready / on the way / delivered. */
  status: require("../assets/sounds/notify-status.wav"),
} as const;

export type SoundName = keyof typeof SOURCES;

const players: Partial<Record<SoundName, AudioPlayer>> = {};

// In memory so play() never has to await a storage read on a hot path.
let enabled = true;
let audioModeSet = false;

/** Load the preference. Call once at app start. */
export async function initSound(): Promise<void> {
  try {
    const v = await AsyncStorage.getItem(SOUND_ENABLED_KEY);
    // Absent = ON: a shopper should hear that their order was accepted
    // without first having to find a setting.
    enabled = v === null ? true : v === "true";
  } catch {
    enabled = true;
  }
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export async function setSoundEnabled(on: boolean): Promise<void> {
  enabled = on;
  try {
    await AsyncStorage.setItem(SOUND_ENABLED_KEY, String(on));
  } catch {
    // The in-memory flag already changed, so the toggle holds for this session.
  }
}

async function ensureAudioMode(): Promise<void> {
  if (audioModeSet) return;
  audioModeSet = true;
  try {
    await setAudioModeAsync({
      // Mix rather than interrupt — a status chime must not stop the
      // customer's music.
      interruptionMode: "mixWithOthers",
      // Explicitly false: if the phone is on silent, respect it.
      playsInSilentMode: false,
      shouldPlayInBackground: false,
      allowsRecording: false,
      shouldRouteThroughEarpiece: false,
    });
  } catch {
    // Audio usually still works without an explicit mode.
  }
}

/** Play one sound. Fire-and-forget — callers cannot be broken by it. */
export function playSound(name: SoundName): void {
  if (!enabled) return;
  void (async () => {
    try {
      await ensureAudioMode();
      let p = players[name];
      if (!p) {
        p = createAudioPlayer(SOURCES[name]);
        // Explicit, not assumed — see the seller app for why.
        p.volume = 1.0;
        players[name] = p;
      }
      await p.seekTo(0);
      p.play();
    } catch (e) {
      // Still silent for the user; visible to a developer, because a
      // swallowed audio error made "I hear nothing" undiagnosable.
      if (__DEV__) console.warn(`[sound] "${name}" failed to play:`, e);
    }
  })();
}

/** Release native players — for teardown paths and tests. */
export function releaseSounds(): void {
  for (const key of Object.keys(players) as SoundName[]) {
    try { players[key]?.remove(); } catch { /* already gone */ }
    delete players[key];
  }
}
