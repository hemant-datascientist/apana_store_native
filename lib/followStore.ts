// ============================================================
// FOLLOW STORE — "stores I follow", the customer side of the seller's Fans.
//
// 🔴 THIS WAS LOCAL-ONLY UNTIL 0070. A follow lived in AsyncStorage on ONE
// phone: the shop never learned of it, so its Fans count was a hardcoded 0 and
// a fan update reached nobody. Reinstalling the app erased every follow.
//
// Now it is a row (POST /customer/stores/:id/follow) and AsyncStorage is a
// CACHE — the list renders instantly and survives being offline, but the
// server is the truth. §30 growth loop.
//
// Module-level singleton + useSyncExternalStore so any screen stays in sync.
// ============================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, getAuthToken } from "../services/api/client";

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

export function followedIds(): string[] {
  return [...followed];
}

/**
 * Optimistic, then real — and it ROLLS BACK VISIBLY on failure.
 *
 * 🔴 A silent rollback is the defect useOptimistic exists to prevent: the heart
 * fills, the request fails, the heart empties, and the customer is told
 * nothing. So the local set flips first (the tap must feel instant), the server
 * is told, and a refusal puts it back — with the caller able to see it failed.
 *
 * ⚠ Returns a promise the caller MAY await. Screens that do not care still get
 * the instant flip; a screen that wants to surface the failure can.
 */
export async function toggleFollow(id: string): Promise<boolean> {
  if (!id) return false;

  const wasFollowing = followed.has(id);
  const next = !wasFollowing;

  // 1. flip locally so the tap is instant
  if (next) followed.add(id);
  else followed.delete(id);
  emit();
  void persist();

  // 2. tell the server
  try {
    const token = await getAuthToken();
    // ⚠ Not signed in: the follow stays local and is NOT sent. Following is a
    // relationship between two identities — there is no anonymous follower for
    // a shop to have. It syncs on the next toggle after sign-in.
    if (!token) return next;

    const res = await fetch(`${API_BASE_URL}/stores/${id}/follow`, {
      method: next ? "POST" : "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(String(res.status));
    return next;
  } catch {
    // 3. put it back. The heart returning to its old state IS the signal;
    // pretending the follow stuck would leave the customer expecting updates
    // from a shop that has never heard of them.
    if (next) followed.delete(id);
    else followed.add(id);
    emit();
    void persist();
    return wasFollowing;
  }
}

/**
 * Replace the local cache with what the SERVER says.
 *
 * ⚠ Called after sign-in, when the follows of the phone and the follows of the
 * account can legitimately differ — a reinstall, or a second device. The server
 * wins, because it is the copy the shop's Fans count is built from.
 */
export async function syncFollowsFromServer(): Promise<void> {
  try {
    const token = await getAuthToken();
    if (!token) return;
    const res = await fetch(`${API_BASE_URL}/stores/following/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const body = (await res.json()) as { items?: { seller_id: string }[] };
    followed = new Set((body.items ?? []).map((i) => i.seller_id));
    emit();
    void persist();
  } catch {
    // Offline: the cached set is still the best answer available, and an empty
    // follow list would be a worse lie than a slightly stale one.
  }
}
