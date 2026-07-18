// ============================================================
// categoryLiveMatch — map a home category feed (grocery, fashion, mobiles…)
// to the real seller products that belong in it, by APC class code. Mirrors
// the tile→APC bridge in data/categoryApcMap.ts so the feed and the browser
// classify the same way. "all" returns everything; an unmapped category
// returns [] (its sections then show the empty state, never mock).
// ============================================================

import type { LiveProduct } from "../services/liveCatalogService";

// Home category key → APC class codes that live in it (class-level, matches
// seller_products.apc_class_code like "APC-12-A7", "APC-02-BEV").
const CATEGORY_CLASSES: Record<string, string[]> = {
  grocery: [
    "APC-01-VEG", "APC-01-FRT", "APC-01-DAI", "APC-01-NVG", "APC-01-TEA",
    "APC-01-SPC", "APC-01-DRYF", "APC-01-STPL", "APC-01-OIL", "APC-01-BKY",
    "APC-01-PKGF", "APC-01-NMK", "APC-01-MITH", "APC-02-BEV", "APC-09-BABY",
  ],
  food: ["APC-01-PKGF", "APC-01-NMK", "APC-01-MITH", "APC-02-BEV", "APC-03-MUKH"],
  fashion: ["APC-10-FASH"],
  mobiles: ["APC-12-A7"],
  electronics: ["APC-13-A8"],
  appliances: ["APC-14-A9"],
  beauty: ["APC-05-BTY", "APC-04-PCARE"],
  pharmacy: ["APC-06-MED", "APC-07-WELL"],
  sports: ["APC-25-SPRT"],
  home: ["APC-17-KTCH"],
  books: ["APC-21-BOOK", "APC-22-ART"],
  icecream: ["APC-01-DAI"],
  furniture: ["APC-17-KTCH"],
  hardware: ["APC-17-KTCH"],
  misc: [],
};

export function productsForCategory<T extends { apcClassCode: string | null }>(
  products: T[],
  categoryKey: string,
): T[] {
  if (categoryKey === "all") return products;
  const classes = CATEGORY_CLASSES[categoryKey];
  if (!classes || classes.length === 0) return [];
  return products.filter(
    (p) => p.apcClassCode != null && classes.some((c) => p.apcClassCode!.startsWith(c)),
  );
}
