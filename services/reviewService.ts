// ============================================================
// REVIEW SERVICE — Apana Store (Customer App · store ratings)
//
// Customer rates a store 1–5★ after a delivered order. Backs:
//   POST {BASE}/stores/:id/review   { rating, comment?, orderId? }  (authed)
//     → { seller_id, rating, review_count }
//   GET  {BASE}/stores/:id/reviews?limit=                            (public)
//     → { seller_id, rating, review_count, items:[{id,rating,comment,created_at}] }
// (modules/seller submitStoreReview / getStoreReviews — the BE enforces the
//  real-buyer gate: a DELIVERED order from that store. Ratings can't be faked.)
//
// Mode gate (same as services/nearbyStoresService.ts):
//   EXPO_PUBLIC_API_MODE=local|prod → real fetch (bearer from AsyncStorage);
//     errors propagate so the UI can show them.
//   anything else (mock)            → optimistic in-memory aggregate so the
//     rating flow is demoable offline (never persisted, never faked into the
//     real map — §19.8).
// ============================================================

import { API_BASE_URL, getAuthToken } from "./api/client";

const API_MODE = process.env.EXPO_PUBLIC_API_MODE ?? "mock";
const IS_LIVE  = API_MODE === "local" || API_MODE === "prod";
const FETCH_TIMEOUT_MS = 10_000;

export const REVIEWS_IS_LIVE = IS_LIVE;

export interface StoreRating {
  seller_id:    string;
  rating:       number; // AVG, 1 decimal
  review_count: number;
}

export interface StoreReview {
  id:         string;
  rating:     number;
  comment:    string | null;
  created_at: string;
}

export interface StoreReviewsResult extends StoreRating {
  items: StoreReview[];
}

// ── Mock aggregate store (in-memory; demo only) ───────────────
// Keyed by storeId → running sum + count so repeat submits move the average.
const mockAgg = new Map<string, { sum: number; count: number }>();

function mockSubmit(storeId: string, rating: number): StoreRating {
  const prev = mockAgg.get(storeId) ?? { sum: 0, count: 0 };
  const next = { sum: prev.sum + rating, count: prev.count + 1 };
  mockAgg.set(storeId, next);
  return {
    seller_id: storeId,
    rating: Math.round((next.sum / next.count) * 10) / 10,
    review_count: next.count,
  };
}

async function fetchJson<T>(url: string, init: RequestInit): Promise<T> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: ctl.signal });
    if (!res.ok) throw new Error(`${url} ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

// ── Public API ────────────────────────────────────────────────

export async function submitStoreReview(
  storeId: string,
  rating: number,
  comment?: string,
  orderId?: string,
): Promise<StoreRating> {
  if (!IS_LIVE) return mockSubmit(storeId, rating);

  const token = await getAuthToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  return fetchJson<StoreRating>(`${API_BASE_URL}/stores/${storeId}/review`, {
    method: "POST",
    headers,
    body: JSON.stringify({ rating, comment, orderId }),
  });
}

export async function fetchStoreReviews(
  storeId: string,
  limit = 20,
): Promise<StoreReviewsResult> {
  if (!IS_LIVE) {
    const agg = mockAgg.get(storeId);
    return {
      seller_id: storeId,
      rating: agg ? Math.round((agg.sum / agg.count) * 10) / 10 : 0,
      review_count: agg?.count ?? 0,
      items: [],
    };
  }
  return fetchJson<StoreReviewsResult>(
    `${API_BASE_URL}/stores/${storeId}/reviews?limit=${limit}`,
    { method: "GET" },
  );
}
