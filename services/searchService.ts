// ============================================================
// SEARCH SERVICE — Apana Store (Customer App)
//
// Global search over REAL seller inventory. Products come from the live catalog
// (fetchLiveProducts — approved store + active listing + stock > 0, §19.8), so a
// search never surfaces a product no shop lists. Store text-search is not built
// yet, so `stores` is honestly empty rather than a mock list.
//
// Endpoint (products): GET /customer/catalog/products?q=<query>
// ============================================================

import { fetchLiveProducts } from "./liveCatalogService";
import {
  SearchProductResult,
  SearchStoreResult,
  SearchSort,
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

// Neutral placeholder tint for the (rare) product with no photo yet.
const ICON_BG = "#EEF2F7";

// ── fetchSearchResults ────────────────────────────────────────
// Blank query → empty (no round-trip). Otherwise the live catalog filtered by
// name; errors PROPAGATE so the screen shows its retry state (never invents
// results). Mock API mode → fetchLiveProducts returns [] → honest empty.
export async function fetchSearchResults(
  params: FetchSearchParams,
): Promise<SearchResults> {
  const q = params.query.trim();
  if (!q) return { products: [], stores: [] };

  const live = await fetchLiveProducts(60, q);

  let products: SearchProductResult[] = live.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    mrp: p.mrp ?? p.price,
    // No fake ratings — a listing has no reviews until the review system exists.
    rating: 0,
    reviewCount: 0,
    storeId: p.store.id,
    storeName: p.store.name,
    category: p.category ?? "",
    // A real seller-declared stop-loss deal is a real badge; nothing invented.
    badge: p.dealPrice != null ? "DEAL" : undefined,
    image: p.image,
    icon: "cube-outline",
    iconBg: ICON_BG,
  }));

  // Client-side sort. "rating"/"relevance" keep the server order (newest-add
  // first) — there are no real ratings to sort by, and inventing them is exactly
  // the phantom data this rewrite removes.
  if (params.sort === "price_asc") products = [...products].sort((a, b) => a.price - b.price);
  else if (params.sort === "price_desc") products = [...products].sort((a, b) => b.price - a.price);

  // Store text-search is not implemented — honest-empty, not a mock store list.
  return { products, stores: [] };
}
