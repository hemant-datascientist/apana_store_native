// ============================================================
// COVERAGE CONTEXT — Apana Store (Customer App)
//
// The customer's store-coverage preference — mutually exclusive,
// mirrors the §19 admin-area model proven in the Testing harness
// (Testing/README.md → "Nearest vs Long Coverage"):
//
//   nearest → stores in the user's SUB-DISTRICT  (hyperlocal, fastest)
//   long    → stores in the user's DISTRICT       (wider, more choice)
//
// One setting, surfaced in two places that stay in sync:
//   • Profile → Preferences → Store Coverage  (CoverageModal)
//   • Stores → Map view                       (CoverageToggle)
//
// Backend: GET /api/customer/stores/nearby?lat=&lng=&coverage=nearest|long
//   resolves the pin to its sub-district / district and scopes the
//   query accordingly (geolocation module, nearbyStores()). On the FE
//   the same choice drives the H3 k-ring radius so the map visibly
//   widens / tightens (COVERAGE_K) until that endpoint is wired.
// ============================================================

import React, {
  createContext, useContext, useState, useEffect, ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ── Coverage mode — matches the backend CoverageMode union ────
export type CoverageMode = "nearest" | "long";

// Per-mode copy + the admin scope it maps to + the FE k-ring radius
// that stands in for that scope on the cell-grid map. Single source so
// the modal, the map toggle and the scope captions never drift.
export interface CoverageMeta {
  key:       CoverageMode;
  label:     string;   // short, for the toggle pill
  title:     string;   // full, for the modal card
  scopeWord: string;   // "sub-district" | "district" — used in captions
  desc:      string;
  icon:      string;   // Ionicons glyph
  k:         number;    // H3 k-ring radius (nearest = tight, long = wide)
}

export const COVERAGE_META: Record<CoverageMode, CoverageMeta> = {
  nearest: {
    key:       "nearest",
    label:     "Nearest",
    title:     "Nearest Coverage",
    scopeWord: "sub-district",
    desc:      "Only shops in your sub-district. Closest stores, fastest delivery — the hyperlocal default.",
    icon:      "locate-outline",
    k:         1,
  },
  long: {
    key:       "long",
    label:     "Long",
    title:     "Long Coverage",
    scopeWord: "district",
    desc:      "Shops across your whole district. More choice and variety, a little farther away.",
    icon:      "expand-outline",
    k:         3,
  },
};

export const COVERAGE_ORDER: CoverageMode[] = ["nearest", "long"];

// k-ring radius for the map, keyed by mode (§19.3 cell discovery).
export const COVERAGE_K: Record<CoverageMode, number> = {
  nearest: COVERAGE_META.nearest.k,
  long:    COVERAGE_META.long.k,
};

const KEY_COVERAGE = "@apana_store:coverage";
const DEFAULT_COVERAGE: CoverageMode = "nearest";

// ── Context shape ─────────────────────────────────────────────
interface CoverageContextValue {
  coverage:    CoverageMode;
  meta:        CoverageMeta;            // COVERAGE_META[coverage], convenience
  setCoverage: (mode: CoverageMode) => void;
}

const CoverageContext = createContext<CoverageContextValue | null>(null);

export function CoverageProvider({ children }: { children: ReactNode }) {
  const [coverage, setCoverageState] = useState<CoverageMode>(DEFAULT_COVERAGE);

  // Restore the saved choice on mount. Coverage isn't needed for first
  // paint, so we don't gate rendering — children show the default until
  // the stored value (if any) lands a tick later.
  useEffect(() => {
    AsyncStorage.getItem(KEY_COVERAGE)
      .then((v) => {
        if (v === "nearest" || v === "long") setCoverageState(v);
      })
      .catch(() => {
        // AsyncStorage read failed — keep the default, never crash
      });
  }, []);

  function setCoverage(mode: CoverageMode) {
    setCoverageState(mode);
    AsyncStorage.setItem(KEY_COVERAGE, mode).catch(() => {});
  }

  return (
    <CoverageContext.Provider
      value={{ coverage, meta: COVERAGE_META[coverage], setCoverage }}
    >
      {children}
    </CoverageContext.Provider>
  );
}

export function useCoverage(): CoverageContextValue {
  const ctx = useContext(CoverageContext);
  if (!ctx) throw new Error("useCoverage must be used inside CoverageProvider");
  return ctx;
}
