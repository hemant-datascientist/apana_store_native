// ============================================================
// NOTIFICATION PREFS — the customer's off switches for promotions.
//
//   global    "Offers & news" — a shop's fan updates and Apana's broadcasts.
//             Server: GET/PUT /customer/notifications/prefs { promotions }.
//   per shop  mute a followed shop's updates without unfollowing it.
//             Server: GET /customer/stores/:id/follow → muted,
//                     PUT /customer/stores/:id/mute { muted }.
//
// 🔴 Both used to live in AsyncStorage only, and nothing on the server read
// them — switching either off changed nothing; every update still arrived.
// The SERVER filters now, so the switch is the truth on every phone. Order,
// delivery and booking messages are never affected.
//
// Optimistic, and a failed save flips back: a switch showing "off" while the
// server still sends is the exact defect this file replaced.
// ============================================================

import { API_BASE_URL, getAuthToken } from "../services/api/client";

let promotions = true;
const muted = new Map<string, boolean>(); // storeId → muted (known once fetched)
let version = 0;
let loadedGlobal = false;
const listeners = new Set<() => void>();

function emit(): void {
  version += 1;
  for (const l of listeners) l();
}

async function call(path: string, init?: RequestInit): Promise<unknown> {
  const token = await getAuthToken();
  if (!token) throw new Error("not signed in");
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

async function loadGlobal(): Promise<void> {
  if (loadedGlobal) return;
  loadedGlobal = true;
  try {
    const r = (await call("/notifications/prefs")) as { promotions: boolean };
    promotions = r.promotions;
    emit();
  } catch {
    loadedGlobal = false; // retry on the next read; the default (on) is the server's default too
  }
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  void loadGlobal();
  return () => {
    listeners.delete(cb);
  };
}

export function getVersion(): number {
  return version;
}

export function storeUpdatesEnabled(): boolean {
  return promotions;
}

export function setStoreUpdatesEnabled(value: boolean): void {
  promotions = value;
  emit();
  call("/notifications/prefs", { method: "PUT", body: JSON.stringify({ promotions: value }) }).catch(() => {
    promotions = !value; // the server didn't take it — show the truth
    emit();
  });
}

export function isStoreMuted(id: string): boolean {
  if (id && !muted.has(id)) {
    muted.set(id, false); // fetch once; show unmuted until it answers
    call(`/stores/${id}/follow`)
      .then((r) => {
        muted.set(id, (r as { muted?: boolean }).muted === true);
        emit();
      })
      .catch(() => muted.delete(id));
  }
  return muted.get(id) ?? false;
}

export function toggleStoreMute(id: string): void {
  if (!id) return;
  const next = !(muted.get(id) ?? false);
  muted.set(id, next);
  emit();
  call(`/stores/${id}/mute`, { method: "PUT", body: JSON.stringify({ muted: next }) }).catch(() => {
    muted.set(id, !next); // not followed, offline, or refused — show the truth
    emit();
  });
}
