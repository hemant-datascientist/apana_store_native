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

  useEffect(() => {
    const filter: OfferingsFilter | null =
      varietyCode ? { variety: varietyCode }
      : familyCode ? { family: familyCode }
      : classCode ? { class: classCode }
      : null;
    if (!filter) { setOfferings([]); return; }

    let cancelled = false;
    setLoading(true);
    fetchOfferings(filter)
      .then((list) => {
        if (cancelled) return;
        setOfferings(list.filter((o) => o.is_active && o.id !== excludeProductId));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [varietyCode, familyCode, classCode, excludeProductId]);

  return { offerings, loading };
}
