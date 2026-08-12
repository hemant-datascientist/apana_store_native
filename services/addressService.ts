// ============================================================
// Addresses — the place an order actually goes.
//
// These used to come from a bundled mock file, so checkout sent an address id
// that existed nowhere: an order could be paid for and still have no real
// destination. Now they are real rows.
//
//   GET    /customer/addresses
//   POST   /customer/addresses
//   PATCH  /customer/addresses/:id
//   POST   /customer/addresses/:id/default
//   DELETE /customer/addresses/:id
//
// The server keeps exactly one default per customer and always leaves one
// standing, so the caller never has to reconcile that.
// ============================================================

import type { UserAddress } from "../data/addressData";

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
export const ADDRESSES_LIVE = API_MODE === "local" || API_MODE === "prod";

const BASE_URL =
  API_MODE === "prod"
    ? "https://api.apana.in/api/customer"
    : `${(process.env.EXPO_PUBLIC_BE_BASE_URL ?? "").replace(/\/+$/, "") || `http://${TOWER_IP}:8000`}/api/customer`;

const TIMEOUT_MS = 12_000;

/**
 * PIN-FIRST address. The customer drops a pin and types ONE thing.
 *
 * There is no street/city/pincode field, and that is the point: the SERVER
 * resolves those from the pin via Mappls and derives the DIGIPIN from the same
 * lat/lng, so the printed address and the routed coordinates cannot describe
 * two different places. A client that could send both would eventually send a
 * mismatched pair, and the partner would follow the text while the ETA followed
 * the pin.
 */
export interface PinAddressInput {
  lat: number;
  lng: number;
  /** The only typed field — "Flat 402", "Ground floor, green gate". */
  door?: string;
  label?: string;
  icon?: string;
  name?: string | null;
  is_default?: boolean;
}

export interface AddressInput {
  label?: string;
  icon?: string;
  name?: string | null;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number | null;
  lng?: number | null;
  is_current_location?: boolean;
  is_default?: boolean;
}

// The customer id goes in the QUERY on reads. "+" must be percent-encoded or it
// decodes to a space server-side and every lookup silently misses.
function q(customerId: string): string {
  return `customer_id=${encodeURIComponent(customerId)}`;
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { "content-type": "application/json", ...(init.headers ?? {}) },
      signal: ctl.signal,
    });
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    let parsed: unknown;
    try { parsed = text ? JSON.parse(text) : {}; } catch { parsed = {}; }
    if (!res.ok) {
      const e = parsed as { message?: string; error?: string };
      // Server messages here are written for a shopper ("pincode must be 6
      // digits and cannot start with 0"), so pass them through — but ONLY the
      // real ones. A framework 404 arrives as message:"NOT_FOUND", and passing
      // that straight to an Alert told the customer their address failed for a
      // reason they cannot act on, while the actual fault was a bad URL in this
      // file. A machine token has no spaces and no lowercase; that is the tell.
      const msg = e.message ?? e.error;
      const isSentence = !!msg && /\s/.test(msg); // real copy has spaces; NOT_FOUND / not_found do not
      throw new Error(
        isSentence ? (msg as string) : `Could not reach the server (${res.status}). Try again.`,
      );
    }
    return parsed as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchAddresses(customerId: string): Promise<UserAddress[]> {
  if (!ADDRESSES_LIVE || !customerId) return [];
  const body = await call<{ items: UserAddress[] }>(`/addresses?${q(customerId)}`);
  return body.items ?? [];
}

/** Create from a dropped pin. The server resolves and stores the address. */
export async function createPinAddress(
  customerId: string,
  input: PinAddressInput,
): Promise<UserAddress> {
  // Refuse in mock mode rather than saving into a backend the list never reads
  // (fetchAddresses returns [] when !ADDRESSES_LIVE) — the address would appear
  // to save and then simply not be there.
  if (!ADDRESSES_LIVE) {
    throw new Error("Addresses are not connected in this build. Set EXPO_PUBLIC_API_MODE=local.");
  }
  // Path is RELATIVE to BASE_URL, which already ends in /api/customer. Writing
  // the absolute path here produced /api/customer/api/customer/addresses/pin —
  // a 404 the screen surfaced verbatim as "Could not save · NOT_FOUND" while
  // the pin itself was perfectly good.
  return call<UserAddress>(`/addresses/pin`, {
    method: "POST",
    body: JSON.stringify({ ...input, customer_id: customerId }),
  });
}

export async function createAddress(customerId: string, input: AddressInput): Promise<UserAddress> {
  return call<UserAddress>("/addresses", {
    method: "POST",
    body: JSON.stringify({ ...input, customer_id: customerId }),
  });
}

export async function updateAddress(
  customerId: string, id: string, patch: Partial<AddressInput>,
): Promise<UserAddress> {
  return call<UserAddress>(`/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ ...patch, customer_id: customerId }),
  });
}

export async function setDefaultAddress(customerId: string, id: string): Promise<UserAddress> {
  return call<UserAddress>(`/addresses/${id}/default`, {
    method: "POST",
    body: JSON.stringify({ customer_id: customerId }),
  });
}

export async function deleteAddress(customerId: string, id: string): Promise<void> {
  await call<void>(`/addresses/${id}?${q(customerId)}`, { method: "DELETE" });
}
