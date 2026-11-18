// ============================================================
// ONDC NETWORK SHOPS — shops on other ONDC seller apps, near the customer.
//
//   POST {BASE}/ondc/search      { lat, lng, pincode?, query? } -> { transaction_id }
//   GET  {BASE}/ondc/search/:txn -> { shops, answers, open }
//
// Apana sends one search to the ONDC network; seller apps answer over the next
// ~30 seconds, so the screen polls. This is a SEPARATE stream from Apana's own
// shops on purpose: the home feed never waits on the network.
// ============================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./api/client";

const TIMEOUT_MS = 12_000;

export interface NetworkItem {
  id: string;
  name: string;
  price_paise: number;
  mrp_paise: number | null;
  image: string | null;
  category: string | null;
  in_stock: boolean;
}

export interface NetworkShop {
  bpp_id: string;
  provider_id: string;
  name: string;
  logo: string | null;
  distance_m: number | null;
  items: NetworkItem[];
}

export interface NetworkResults {
  shops: NetworkShop[];
  answers: number;
  /** Seller apps may still be answering. */
  open: boolean;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await AsyncStorage.getItem("apana_access_token");
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      signal: ctl.signal,
    });
    const body = (await res.json().catch(() => null)) as (T & { message?: string }) | null;
    if (!res.ok) throw new Error(body?.message ?? `The network search failed (HTTP ${res.status}).`);
    return body as T;
  } finally {
    clearTimeout(timer);
  }
}

export function startNetworkSearch(input: { lat: number; lng: number; pincode?: string; query?: string }) {
  return call<{ transaction_id: string; expires_in: number }>("/ondc/search", { method: "POST", body: JSON.stringify(input) });
}

export function networkResults(txn: string) {
  return call<NetworkResults>(`/ondc/search/${encodeURIComponent(txn)}`);
}
