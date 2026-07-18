// ============================================================
// useLiveProducts — one shared fetch of real seller inventory for the whole
// home feed. Module-level cache + in-flight de-dupe so the many product
// sections that mount at once make a SINGLE backend call, not one each.
// ============================================================

import { useEffect, useState } from "react";
import { fetchLiveProducts, LiveProduct } from "../services/liveCatalogService";

let cache: LiveProduct[] | null = null;
let inflight: Promise<LiveProduct[]> | null = null;

async function loadOnce(): Promise<LiveProduct[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetchLiveProducts(100)
      .then((p) => { cache = p; return p; })
      .catch(() => { cache = []; return []; })
      .finally(() => { inflight = null; });
  }
  return inflight;
}

export function useLiveProducts(): { products: LiveProduct[]; loading: boolean } {
  const [products, setProducts] = useState<LiveProduct[]>(cache ?? []);
  const [loading, setLoading] = useState(cache == null);

  useEffect(() => {
    let alive = true;
    if (cache) { setProducts(cache); setLoading(false); return; }
    loadOnce().then((p) => {
      if (!alive) return;
      setProducts(p);
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  return { products, loading };
}
