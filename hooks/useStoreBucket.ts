// ============================================================
// useStoreBucket — one Stores tab's real sellers.
//
// Feeds B2C / Wholesale / Service Based, which read bundled mock files before
// this. Nearby keeps its own hook (it is proximity-ranked and cell-cached).
//
// Empty is EMPTY (§19.8): no shops in a bucket yet means an honest empty state,
// never a placeholder shop that cannot be ordered from.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import {
  fetchStoresByBucket,
  BUCKETS_LIVE,
  type BucketStore,
  type StoreBucket,
} from "../services/storeBucketService";

export interface StoreBucketState {
  stores: BucketStore[];
  loading: boolean;
  /** Set when the fetch failed — the UI says so rather than showing a blank. */
  error: string | null;
  /** true when the backend is reachable and simply has none of this kind yet. */
  isEmpty: boolean;
  reload: () => void;
}

export function useStoreBucket(
  bucket: StoreBucket,
  coords?: { lat: number; lng: number } | null,
  limit = 50,
  // "newest" = most recently joined first, for the New Launches screen.
  sort: "default" | "newest" = "default",
): StoreBucketState {
  const [stores,  setStores]  = useState<BucketStore[]>([]);
  const [loading, setLoading] = useState(BUCKETS_LIVE);
  const [error,   setError]   = useState<string | null>(null);

  // Only `local` needs the pin; passing it for the others is harmless (the
  // server just adds a distance where a seller happens to have one).
  const lat = coords?.lat ?? null;
  const lng = coords?.lng ?? null;

  const load = useCallback(() => {
    if (!BUCKETS_LIVE) { setStores([]); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchStoresByBucket(bucket, { lat, lng, limit, sort })
      .then((r) => { if (!cancelled) setStores(r.items); })
      .catch((e) => {
        if (cancelled) return;
        // Keep the list empty AND say why. Silently showing nothing makes a
        // dead backend look like "no shops here", which sends someone looking
        // for a bug in the wrong place.
        setStores([]);
        setError(e instanceof Error ? e.message : "Could not load stores.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [bucket, lat, lng, limit, sort]);

  useEffect(() => load(), [load]);

  return {
    stores,
    loading,
    error,
    isEmpty: !loading && !error && stores.length === 0,
    reload: load,
  };
}
