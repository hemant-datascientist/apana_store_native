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
} from "../services/bookingService";

export interface ServiceStoresState {
  stores: ServiceStore[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useServiceStores(opts: {
  city?: string;
  q?: string;
  classCode?: string;
} = {}): ServiceStoresState {
  const { city, q, classCode } = opts;
  const [stores, setStores] = useState<ServiceStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetchServiceStores({ city, q, classCode })
      .then((items) => {
        if (!alive) return;
        setStores(items);
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
  }, [city, q, classCode, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { stores, loading, error, reload };
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
