// ============================================================
// useNewOnApana — what is genuinely new near the customer.
//
// 🔴 THE "NEW LAUNCHES" SCREEN RAN ENTIRELY ON INVENTED BUSINESSES.
//
// data/newLaunchersData.ts held eight hand-written entries — "Cloud Kitchen by
// Fresh Bakes, opened 2 days ago", "TechZone Service Centre — certified
// technicians, 90-day warranty" — presented to every customer in every city as
// shops that had just opened near them. They carried warranty and
// certification claims nothing backs, and their `storeId` values pointed at
// bundled sample stores, so tapping one led nowhere.
//
// It also had a "Coming Soon" section listing future launches with dates.
// That is deleted rather than rebuilt: nobody announces a future opening to
// Apana, so there is no source for it and never was.
//
// What IS real: a shop's `joined_at` (when it registered) and a product's
// insertion order. Both are facts the platform already owns.
// ============================================================

import { useMemo } from "react";
import { useStoreBucket } from "./useStoreBucket";
import { useLiveProducts } from "./useLiveProducts";
import { useLocation } from "../context/LocationContext";
import type { BucketStore } from "../services/storeBucketService";
import type { LiveProduct } from "../services/liveCatalogService";

/** A shop counts as "new" for this long after it joins. */
const NEW_SHOP_DAYS = 30;

export interface NewOnApana {
  shops: BucketStore[];
  products: LiveProduct[];
  loading: boolean;
  error: string;
  /** Reached the backend and there is genuinely nothing new nearby. */
  isEmpty: boolean;
  reload: () => void;
}

/** Whole days since an ISO timestamp; null when it cannot be parsed. */
export function daysSince(iso: string): number | null {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return null;
  return Math.floor((Date.now() - t) / 86_400_000);
}

/** "today" / "3 days ago" — from a real timestamp, never a written date. */
export function joinedLabel(iso: string): string | null {
  const d = daysSince(iso);
  if (d == null || d < 0) return null; // a future join date is not describable
  if (d === 0) return "opened today";
  if (d === 1) return "opened yesterday";
  if (d < 7) return `opened ${d} days ago`;
  if (d < 14) return "opened last week";
  return `opened ${Math.floor(d / 7)} weeks ago`;
}

export function useNewOnApana(): NewOnApana {
  const { selectedAddress, deviceCoords } = useLocation();
  const lat = deviceCoords?.lat ?? selectedAddress.lat ?? null;
  const lng = deviceCoords?.lng ?? selectedAddress.lng ?? null;
  const coords = lat != null && lng != null ? { lat, lng } : null;

  const { stores, loading: sLoading, error: sError, reload } = useStoreBucket("local", coords, 50, "newest");
  // Products already arrive newest-added first and k-ring scoped.
  const { products, loading: pLoading } = useLiveProducts();

  const shops = useMemo(
    () =>
      stores.filter((s) => {
        const d = daysSince(s.joined_at);
        // An unparseable or future date is NOT treated as new: padding this
        // list is the whole defect being fixed.
        return d != null && d >= 0 && d <= NEW_SHOP_DAYS;
      }),
    [stores],
  );

  const newest = useMemo(() => products.slice(0, 12), [products]);
  const loading = sLoading || pLoading;

  return {
    shops,
    products: newest,
    loading,
    error: sError ?? "",
    isEmpty: !loading && !sError && shops.length === 0 && newest.length === 0,
    reload,
  };
}
