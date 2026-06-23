// ============================================================
// useNearbyStores — store discovery for the map  ·  §19.3 / §19.6
//
// Resolves the centre to an H3 cell and fetches nearby stores from
// services/nearbyStoresService (live BE /customer/stores/nearby, or the
// bundled mock). The centre CELL is the refetch trigger, so GPS drift within
// one cell never refetches — the BE call only fires when the user actually
// crosses into a new hex (or on an explicit refetch).
//
// The BE computes the k-ring itself; `k` is accepted for call-site
// compatibility (coverage scope) but the live radius is server-defined.
// ============================================================

import { useEffect, useState, useCallback, useRef } from "react";
import { latLngToCell, H3_RES } from "../services/h3";
import { fetchNearbyStores } from "../services/nearbyStoresService";
import { StoreMapPin } from "../data/nearbyMapData";

interface LatLng {
  lat: number;
  lng: number;
}

interface UseNearbyStoresOptions {
  k?:     number; // ring size (coverage scope) — server radius is fixed in live mode
  res?:   number; // H3 resolution — default DISCOVERY (r8)
  limit?: number; // max pins
}

interface NearbyStoresResult {
  stores:  StoreMapPin[];
  loading: boolean;
  error:   string | null;
  refetch: () => void;
}

export function useNearbyStores(
  location: LatLng | null,
  options: UseNearbyStoresOptions = {},
): NearbyStoresResult {
  const res   = options.res ?? H3_RES.DISCOVERY;
  const limit = options.limit;

  const [stores, setStores]   = useState<StoreMapPin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // Stable while the user moves within one cell — the refetch trigger.
  const centerCell = location ? latLngToCell(location.lat, location.lng, res) : null;

  // Latest location read inside load via a ref, so the fetch isn't a render
  // dependency (the cell debounces it instead).
  const locRef = useRef(location);
  locRef.current = location;
  const aliveRef = useRef(true);

  const load = useCallback(async () => {
    const loc = locRef.current;
    if (!loc || !centerCell) {
      setStores([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchNearbyStores(loc.lat, loc.lng, limit);
      if (aliveRef.current) setStores(result);
    } catch {
      // Live mode propagates errors here → surface a retry, never fabricate.
      if (aliveRef.current) setError("could not load nearby stores");
    } finally {
      if (aliveRef.current) setLoading(false);
    }
  }, [centerCell, limit]);

  useEffect(() => {
    aliveRef.current = true;
    void load();
    return () => { aliveRef.current = false; };
  }, [load]);

  return { stores, loading, error, refetch: load };
}
