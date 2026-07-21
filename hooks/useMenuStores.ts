// ============================================================
// useMenuStores / useMenuStore — §16.12 AMC customer reads.
// Same shape and reasoning as useServiceStores.
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { fetchMenuStore, fetchMenuStores, MenuStore, MenuStoreDetail } from "../services/menuService";

export interface MenuStoresState {
  stores: MenuStore[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useMenuStores(opts: {
  city?: string;
  q?: string;
  classCode?: string;
} = {}): MenuStoresState {
  const { city, q, classCode } = opts;
  const [stores, setStores] = useState<MenuStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetchMenuStores({ city, q, classCode })
      .then((items) => {
        if (!alive) return;
        setStores(items);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Couldn't load kitchens.");
        setStores([]);
        setLoading(false);
      });
    return () => { alive = false; };
  }, [city, q, classCode, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { stores, loading, error, reload };
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
