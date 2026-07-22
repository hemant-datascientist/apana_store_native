// ============================================================
// useMenuStores / useMenuStore — §16.12 AMC customer reads.
// Same shape and reasoning as useServiceStores.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import {
  fetchMenuStore, fetchMenuStores, MenuStore, MenuStoreDetail, type DiscoveryScope,
} from "../services/menuService";

export interface MenuStoresState {
  stores: MenuStore[];
  loading: boolean;
  error: string | null;
  scope: DiscoveryScope;
  elsewhere: number;
  reload: () => void;
}

export function useMenuStores(opts: {
  city?: string;
  q?: string;
  classCode?: string;
  lat?: number | null;
  lng?: number | null;
} = {}): MenuStoresState {
  const { city, q, classCode, lat, lng } = opts;
  const [stores, setStores] = useState<MenuStore[]>([]);
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
    fetchMenuStores({ city, q, classCode, lat, lng })
      .then((res) => {
        if (!alive) return;
        setStores(res.items);
        setScope(res.scope);
        setElsewhere(res.elsewhere);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Couldn't load kitchens.");
        setStores([]);
        setLoading(false);
      });
    return () => { alive = false; };
  }, [city, q, classCode, lat, lng, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { stores, loading, error, scope, elsewhere, reload };
}

export interface MenuStoreState {
  detail: MenuStoreDetail | null;
  loading: boolean;
  reload: () => void;
}

export function useMenuStore(id: string | undefined): MenuStoreState {
  const [detail, setDetail] = useState<MenuStoreDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    if (!id) { setDetail(null); setLoading(false); return; }
    setLoading(true);
    fetchMenuStore(id).then((d) => {
      if (!alive) return;
      setDetail(d);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [id, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { detail, loading, reload };
}
