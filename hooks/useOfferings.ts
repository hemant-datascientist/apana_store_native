// ============================================================
// useOfferings — the other ways this same product is sold nearby.
//
// Keyed on the most specific APC code the product carries (variety, else
// family, else class), because that is what makes two listings the SAME thing:
// "Atta" is a family, "Chakki Atta" a variety, and only matching at the right
// level puts the uncle's loose scoop next to the sealed Aashirvaad pack.
//
// No APC on the product → no query, empty list. Better to show nothing than to
// group unrelated items under a guess.
// ============================================================

import { useEffect, useState } from "react";
import { useLocation } from "../context/LocationContext";
import {
  fetchOfferings, type Offering, type OfferingsFilter,
} from "../services/offeringsService";

interface Args {
  varietyCode?: string | null;
  familyCode?: string | null;
  classCode?: string | null;
  // Hide the listing the customer is already looking at — it is the page, not
  // an alternative to it.
  excludeProductId?: string | null;
}

export function useOfferings({ varietyCode, familyCode, classCode, excludeProductId }: Args) {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(false);
  // Same "near me" as the home feed: a shop the feed would not show must not
  // be offered here either. Rounded so GPS jitter does not refetch.
  const { selectedAddress, deviceCoords } = useLocation();
  const lat = deviceCoords?.lat ?? selectedAddress.lat ?? null;
  const lng = deviceCoords?.lng ?? selectedAddress.lng ?? null;
  const latK = lat != null ? lat.toFixed(3) : "";
  const lngK = lng != null ? lng.toFixed(3) : "";

  useEffect(() => {
    const filter: OfferingsFilter | null =
      varietyCode ? { variety: varietyCode }
      : familyCode ? { family: familyCode }
      : classCode ? { class: classCode }
      : null;
    if (!filter) { setOfferings([]); return; }

    let cancelled = false;
    setLoading(true);
    fetchOfferings(latK && lngK ? { ...filter, lat: latK, lng: lngK } : filter)
      .then((list) => {
        if (cancelled) return;
        setOfferings(list.filter((o) => o.is_active && o.id !== excludeProductId));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [varietyCode, familyCode, classCode, excludeProductId, latK, lngK]);

  return { offerings, loading };
}
