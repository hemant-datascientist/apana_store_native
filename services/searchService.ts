// ============================================================
// SEARCH SERVICE — Apana Store (Customer App)
//
// Typed request/response interfaces for the global search,
// plus a stub function that simulates the backend API.
//
// To wire the real backend: replace the stub body inside
// fetchSearchResults() with a fetch() call — no component
// changes needed.
//
// Endpoint:
//   GET /search?q=<query>&sort=<sort>
//   → { products: SearchProductResult[], stores: SearchStoreResult[] }
// ============================================================

import {
  SearchProductResult,
  SearchStoreResult,
  SearchSort,
  searchProducts,
  searchStores,
} from "../data/searchResultsData";

// Re-export types so importers only need this service file
export type { SearchProductResult, SearchStoreResult, SearchSort };

// ── Request params ────────────────────────────────────────────
export interface FetchSearchParams {
  query: string;
  sort?: SearchSort;
}

// ── Aggregated response ───────────────────────────────────────
export interface SearchResults {
  products: SearchProductResult[];
  stores:   SearchStoreResult[];
}

// ── fetchSearchResults ────────────────────────────────────────
// GET /search
//
// Returns products + stores matching the query, sorted by `sort`.
// Empty query → returns { products: [], stores: [] } immediately
// (no network call needed — caller shows empty/suggestion state).
//
// Real backend call: uncomment the fetch block below and remove
// the stub.
export async function fetchSearchResults(
  params: FetchSearchParams,
): Promise<SearchResults> {
  // Return instantly for blank queries — no round-trip needed
  if (!params.query.trim()) {
    return { products: [], stores: [] };
  }

  // TODO: replace stub with real call ↓
  // const qp = new URLSearchParams({
  //   q:    params.query,
  //   sort: params.sort ?? "relevance",
  // });
  // const res = await fetch(`${API_BASE}/search?${qp}`, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // if (!res.ok) {
  //   const err = await res.json().catch(() => ({}));
  //   throw new Error(err.message ?? `Search failed (${res.status})`);
  // }
  // return res.json() as Promise<SearchResults>;

  // ── Simulate ~350 ms network latency ─────────────────────────
  await new Promise(r => setTimeout(r, 350));

  return {
    products: searchProducts(params.query, params.sort),
    stores:   searchStores(params.query,   params.sort),
  };
}
