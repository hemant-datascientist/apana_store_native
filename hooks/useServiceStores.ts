// ============================================================
// useServiceStores / useServiceStore — §16.11 ASvC customer reads.
//
// No module-level cache here (unlike useLiveProducts): the list is filtered
// by city and query, so a single shared snapshot would serve the wrong city
// after the customer changes their pin. Each screen owns its own fetch and
// re-runs when the filters change.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import {
  fetchServiceStore,
  fetchServiceStores,
  ServiceStore,
  ServiceStoreDetail,
  type DiscoveryScope,
} from "../services/bookingService";

export interface ServiceStoresState {
  stores: ServiceStore[];
  loading: boolean;
  error: string | null;
  scope: DiscoveryScope;
  elsewhere: number;
  reload: () => void;
}

export function useServiceStores(opts: {
  city?: string;
  q?: string;
  classCode?: string;
  lat?: number | null;
  lng?: number | null;
} = {}): ServiceStoresState {
  const { city, q, classCode, lat, lng } = opts;
  const [stores, setStores] = useState<ServiceStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  // What the backend actually searched, and how many live shops sit outside
  // it — the empty state needs both to say something true and useful.
  const [scope, setScope] = useState<DiscoveryScope>({ label: null, level: "all" });
  const [elsewhere, setElsewhere] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetchServiceStores({ city, q, classCode, lat, lng })
      .then((res) => {
        if (!alive) return;
        setStores(res.items);
        setScope(res.scope);
        setElsewhere(res.elsewhere);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        // Honest failure — an empty list must never be shown as "no shops
        // near you" when the truth is the request failed (§19.8).
        setError(e instanceof Error ? e.message : "Couldn't load service stores.");
        setStores([]);
        setLoading(false);
      });
    return () => { alive = false; };
  }, [city, q, classCode, lat, lng, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { stores, loading, error, scope, elsewhere, reload };
}

export interface ServiceStoreState {
  detail: ServiceStoreDetail | null;
  loading: boolean;
  reload: () => void;
}

export function useServiceStore(id: string | undefined): ServiceStoreState {
  const [detail, setDetail] = useState<ServiceStoreDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    if (!id) { setDetail(null); setLoading(false); return; }
    setLoading(true);
    fetchServiceStore(id).then((d) => {
      if (!alive) return;
      setDetail(d);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [id, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { detail, loading, reload };
}
