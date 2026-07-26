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

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!storeId) {
      setMeta(null);
      setProducts([]);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    Promise.all([fetchStoreMeta(storeId), fetchStoreProducts(storeId, 100)])
      .then(([m, p]) => {
        if (!alive) return;
        setMeta(m);
        setProducts(p);
      })
      .catch(() => {
        if (!alive) return;
        setMeta(null);
        setProducts([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [storeId]);

  return { meta, categories: groupByCategory(products), products, loading };
}
