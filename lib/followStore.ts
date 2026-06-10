// ============================================================
// FOLLOW STORE — tiny external store for "stores I follow" (the customer side
// of seller Fans). Persists to AsyncStorage; consumed via hooks/useFollow.
// Frontend-first stand-in for POST /stores/:id/follow. §30 growth loop.
// Module-level singleton + useSyncExternalStore so any screen stays in sync.
// ============================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "apana_followed_stores";

let followed = new Set<string>();
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
      followed = new Set(JSON.parse(raw) as string[]);
      emit();
    }
  } catch {
    // ignore — an empty follow set is a valid state (no phantom follows)
  }
}
void hydrate();

async function persist(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify([...followed]));
  } catch {
    // non-fatal; in-memory state is still correct for this session
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

export function isFollowing(id: string): boolean {
  return followed.has(id);
}

export function followCount(): number {
  return followed.size;
}

export function toggleFollow(id: string): void {
  if (!id) return;
  if (followed.has(id)) followed.delete(id);
  else followed.add(id);
  emit();
  void persist();
}
