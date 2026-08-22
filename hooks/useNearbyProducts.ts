// ============================================================
// useNearbyProducts — real products, from shops the customer can buy from.
//
// 🔴 THE HOME FEED'S PRODUCT GRIDS RAN ON BUNDLED SAMPLE DATA.
//
// GroceryProductGrid, FashionSubCategoryGrid and the seasonal rails rendered
// rows from data/groceryData and data/fashionData — invented products with
// invented prices — and tapping one opened an Alert saying "Product detail
// coming soon", because there was no real product behind it to open.
//
// This returns the real thing, scoped to the customer's location: the same
// k-ring the nearby-stores feed uses, so a shelf on the home screen is stock a
// customer can actually order. Without the scope the endpoint answers with
// every product in the country, which is a shelf of things nobody nearby
// sells.
//
// Honest-empty (§19.8): a location with no listed products in this class
// yields an empty list and says so — never a sample row to fill the space.
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchApcProducts, type LiveProduct } from "../services/liveCatalogService";
import { useLocation } from "../context/LocationContext";

export interface NearbyProducts {
  products: LiveProduct[];
  loading: boolean;
  /** The server's words when the fetch failed; "" when it did not. */
  error: string;
  /** Succeeded and genuinely returned nothing — distinct from `error`. */
  isEmpty: boolean;
  reload: () => void;
}

export function useNearbyProducts(apcClass: string | null, limit = 20): NearbyProducts {
  const { selectedAddress, deviceCoords } = useLocation();
  // Device fix first — "near me" means where the person is standing, not where
  // they last chose to have something delivered. Same rule as NearbyStoresFeed.
  const lat = deviceCoords?.lat ?? selectedAddress.lat ?? null;
  const lng = deviceCoords?.lng ?? selectedAddress.lng ?? null;

  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [loading, setLoading] = useState(Boolean(apcClass));
  const [error, setError] = useState("");

  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => { aliveRef.current = false; };
  }, []);

  const load = useCallback(async (): Promise<void> => {
    if (!apcClass || lat == null || lng == null) {
      // No class, or no location yet. Not an error — there is simply nothing to
      // ask for. The app cannot reach the home feed without a location anyway.
      setProducts([]);
      setLoading(false);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetchApcProducts(apcClass, { limit, near: { lat, lng } });
      if (!aliveRef.current) return;
      setProducts(res.products);
    } catch (e) {
      if (!aliveRef.current) return;
      // Empty AND a reason. Silently showing nothing makes a dead backend look
      // like "no shops sell this near you", which sends someone hunting for a
      // bug in the wrong place.
      setProducts([]);
      setError(e instanceof Error ? e.message : "Could not load products.");
    } finally {
      if (aliveRef.current) setLoading(false);
    }
  }, [apcClass, lat, lng, limit]);

  useEffect(() => { void load(); }, [load]);

  return {
    products,
    loading,
    error,
    isEmpty: !loading && !error && products.length === 0,
    reload: () => { void load(); },
  };
}
