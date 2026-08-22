// ============================================================
// useStoreCatalog — a store's REAL catalog, arranged by APC class (§16.9).
//
// The Store Detail screen was 100% mock (getStoreById). This fetches the
// store's real meta + real products and buckets the products into APC-class
// category rows — "Personal Care (3)", "Beverages (2)" — exactly what the
// customer sees, straight from what the seller listed. Honest-empty (§19.8):
// a real store with no products yields no categories, never invented ones.
//
// Grouping is client-side on purpose: the product rows already carry
// apc_class_code + category (the class-name mirror), so a category is just a
// bucket of the products already fetched — no extra round-trip.
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchStoreMeta,
  fetchStoreProducts,
  StoreMeta,
  LiveProduct,
} from "../services/liveCatalogService";
import { StoreProductCategory } from "../data/storeDetailData";
import { apcClassIcon } from "../lib/apcClassIcon";

export interface StoreCategoryGroup extends StoreProductCategory {
  products: LiveProduct[];
}

export interface StoreCatalog {
  meta: StoreMeta | null;
  categories: StoreCategoryGroup[];
  products: LiveProduct[];
  loading: boolean;
  /** Retry after a failed load, without leaving the screen. */
  reload: () => void;
}

// Bucket products by the DISPLAY category (the class-name mirror the picker
// wrote). Keyed by that label, not the raw class code, so a customer sees one
// "Personal Care (3)" row rather than two rows that happen to read the same.
// Icon comes from the first product's APC class. No category ⇒ "Other" — the
// product stays visible, never dropped.
function groupByCategory(products: LiveProduct[]): StoreCategoryGroup[] {
  const buckets = new Map<string, StoreCategoryGroup>();
  for (const p of products) {
    const label = (p.category ?? "").trim() || "Other";
    const key = label.toLowerCase();
    let g = buckets.get(key);
    if (!g) {
      g = { key, label, icon: apcClassIcon(p.apcClassCode), productCount: 0, products: [] };
      buckets.set(key, g);
    }
    g.products.push(p);
    g.productCount = g.products.length;
  }
  // Biggest category first — the store's strongest shelf leads.
  return [...buckets.values()].sort((a, b) => b.productCount - a.productCount);
}

export function useStoreCatalog(storeId: string | undefined): StoreCatalog {
  const [meta, setMeta] = useState<StoreMeta | null>(null);
  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [loading, setLoading] = useState(!!storeId);
  // The fetch lives in a callback so BOTH the mount effect and an explicit
  // retry can run it. The alternative — an `attempt` counter in the dep array —
  // is a dependency the effect never actually reads, which the hooks linter
  // correctly refuses.
  //
  // `aliveRef` rather than a per-effect local: a manual reload has no effect
  // cleanup of its own, so its in-flight promise still needs to know when the
  // screen has gone away.
  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => { aliveRef.current = false; };
  }, []);

  const load = useCallback(async (): Promise<void> => {
    if (!storeId) {
      setMeta(null);
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [m, p] = await Promise.all([
        fetchStoreMeta(storeId),
        fetchStoreProducts(storeId, 100),
      ]);
      if (!aliveRef.current) return;
      setMeta(m);
      setProducts(p);
    } catch {
      if (!aliveRef.current) return;
      // Null meta is what the screen reads as "could not load" — it must NOT
      // fall through to the bundled sample store (see store-detail.tsx).
      setMeta(null);
      setProducts([]);
    } finally {
      if (aliveRef.current) setLoading(false);
    }
  }, [storeId, aliveRef]);

  useEffect(() => { void load(); }, [load]);

  return {
    meta,
    categories: groupByCategory(products),
    products,
    loading,
    reload: () => { void load(); },
  };
}
