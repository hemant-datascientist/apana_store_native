// ============================================================
// NOTIFICATION PREFS — the customer's opt-out controls for store ("Fan")
// updates. §30 P4b — the receiving half of the seller broadcast (P4). Two
// levers: a GLOBAL "store updates" switch + PER-STORE mute. A store's update is
// allowed only if global-on AND that store isn't muted.
// AsyncStorage-persisted; synced across screens via useSyncExternalStore.
// BE swap = GET/PATCH /customer/notification-prefs. No spam = kept trust.
// ============================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "apana_notif_prefs";

interface PrefsShape {
  storeUpdates: boolean;
  muted: string[];
}

let storeUpdates = true; // default: opted in, but always overridable
let muted = new Set<string>();
let version = 0;
let loaded = false;
const listeners = new Set<() => void>();

function emit(): void {
  version += 1;
  listeners.forEach((l) => l());
}

async function hydrate(): Promise<void> {
  if (loaded) return;
  loaded = true;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as PrefsShape;
      storeUpdates = p.storeUpdates ?? true;
      muted = new Set(p.muted ?? []);
      emit();
    }
  } catch {
    // defaults (opted in, nothing muted) are a valid state
  }
}
void hydrate();

async function persist(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify({ storeUpdates, muted: [...muted] }));
  } catch {
    // non-fatal; in-memory prefs stay correct this session
  }
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getVersion(): number {
  return version;
}

export function storeUpdatesEnabled(): boolean {
  return storeUpdates;
}

export function setStoreUpdatesEnabled(value: boolean): void {
  storeUpdates = value;
  emit();
  void persist();
}

export function isStoreMuted(id: string): boolean {
  return muted.has(id);
}

export function toggleStoreMute(id: string): void {
  if (!id) return;
  if (muted.has(id)) muted.delete(id);
  else muted.add(id);
  emit();
  void persist();
}

// A store's updates reach the customer only if globally enabled AND not muted.
export function storeUpdatesAllowed(id: string): boolean {
  return storeUpdates && !muted.has(id);
}
