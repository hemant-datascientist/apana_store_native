// ============================================================
// useLiveProducts — one shared fetch of real seller inventory for the whole
// home feed. Module-level cache + in-flight de-dupe so the many product
// sections that mount at once make a SINGLE backend call, not one each.
//
// 🔴 THIS WAS NATIONWIDE. `fetchLiveProducts(100)` asked for "every visible
// product" with no location, so a shopper in Jalgaon saw a Pune shop's stock
// on their home screen — orderable, from a shop that cannot deliver to them.
// Same defect class as the store feed showing a Jalgaon shop in Pune.
//
// Now scoped to the customer's k-ring (§19.6), the same ring nearby-stores
// uses. Honest-empty (§19.8): a location with no listed stock shows nothing,
// never a filler row.
// ============================================================

import { useEffect, useState } from "react";
import { fetchLiveProducts, LiveProduct } from "../services/liveCatalogService";
import { useLocation } from "../context/LocationContext";

// Keyed by location: the cache exists to stop N sections making N calls, NOT
// to survive the customer moving. An unkeyed cache would serve the first
// city's shelf forever — which is exactly the bug this hook is fixing.
const cache = new Map<string, LiveProduct[]>();
const inflight = new Map<string, Promise<LiveProduct[]>>();

// 3dp ≈ 110 m. Finer than that is noise from a drifting GPS fix and would
// miss the cache on every reading.
function keyFor(lat: number, lng: number): string {
  return `${lat.toFixed(3)},${lng.toFixed(3)}`;
}

async function loadOnce(key: string, lat: number, lng: number): Promise<LiveProduct[]> {
  const hit = cache.get(key);
  if (hit) return hit;

  let pending = inflight.get(key);
  if (!pending) {
    pending = fetchLiveProducts(100, "", { lat, lng })
      .then((p) => { cache.set(key, p); return p; })
      // A failed fetch is NOT cached: caching [] here would turn one dead
      // tunnel into a permanently empty home feed for the whole session.
      .catch(() => [] as LiveProduct[])
      .finally(() => { inflight.delete(key); });
    inflight.set(key, pending);
  }
  return pending;
}

export function useLiveProducts(): { products: LiveProduct[]; loading: boolean } {
  const { selectedAddress, deviceCoords } = useLocation();
  // Device fix first — "near me" is where the person is standing, not where
  // they last chose delivery. Same rule as NearbyStoresFeed.
  const lat = deviceCoords?.lat ?? selectedAddress.lat ?? null;
  const lng = deviceCoords?.lng ?? selectedAddress.lng ?? null;
  const key = lat != null && lng != null ? keyFor(lat, lng) : null;

  const [products, setProducts] = useState<LiveProduct[]>(key ? cache.get(key) ?? [] : []);
  const [loading, setLoading] = useState(key != null && !cache.has(key));

  useEffect(() => {
    if (key == null || lat == null || lng == null) {
      // No location yet. Not an error — the app cannot reach the home feed
      // without one, so this is the brief window before hydration lands.
      setProducts([]);
      setLoading(false);
      return;
    }
    const hit = cache.get(key);
    if (hit) { setProducts(hit); setLoading(false); return; }

    let alive = true;
    setLoading(true);
    void loadOnce(key, lat, lng).then((p) => {
      if (!alive) return;
      setProducts(p);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [key, lat, lng]);

  return { products, loading };
}
