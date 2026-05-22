// ============================================================
// useNearbyStores — k-ring store discovery  ·  §19.3 / §19.6
//
// Given the user's location (or the map centre), this:
//   1. resolves it to an H3 cell,
//   2. takes a k-ring of cells around it (K=2 default — the
//      q-commerce radius, ~600 m across),
//   3. asks cellCache for the stores in those cells.
//
// Cell-debounced: the centre cell is the effect dependency, so GPS
// drift within the same cell never refetches. When the centre does
// move, most of the new ring overlaps the old one, so cellCache
// serves it almost entirely from memory — pan/zoom stays cheap.
// ============================================================

import { useEffect, useState } from "react";
import { latLngToCell, gridDisk, H3_RES } from "../services/h3";
import { getStoresInCells } from "../services/cellCache";
import { StoreMapPin } from "../data/nearbyMapData";

interface LatLng {
  lat: number;
  lng: number;
}

interface UseNearbyStoresOptions {
  k?: number; // ring size — default 2 (§19.3 q-commerce default)
  res?: number; // H3 resolution — default DISCOVERY (r8)
}

interface NearbyStoresResult {
  stores: StoreMapPin[];
  loading: boolean;
  error: string | null;
}

export function useNearbyStores(
  location: LatLng | null,
  options: UseNearbyStoresOptions = {},
): NearbyStoresResult {
  const k = options.k ?? 2;
  const res = options.res ?? H3_RES.DISCOVERY;

  const [stores, setStores] = useState<StoreMapPin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The centre cell is the real dependency — a stable string while
  // the user moves within one cell, so the effect stays idle until
  // they actually cross into a new hex.
  const centerCell = location ? latLngToCell(location.lat, location.lng, res) : null;

  useEffect(() => {
    if (!centerCell) {
      setStores([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getStoresInCells(gridDisk(centerCell, k))
      .then((result) => {
        if (cancelled) return;
        setStores(result);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("could not load nearby stores");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [centerCell, k, res]);

  return { stores, loading, error };
}
