// ============================================================
// useApcBrowser — the category browser, driven straight from the §27 APC
// classification instead of a hand-written merchandising list.
//
// Departments and their classes are grouped + ordered SERVER-SIDE
// (GET /apc/departments) from data/departments.ts — the single source that also
// composes the frozen code prefix. The client used to re-derive departments from
// the class-code prefix (APC-01-VEG -> dept 01), a second copy of the rule that
// drifted the moment a code-space was split: Packaged Foods and Bakery & Sweets
// came out of the Food canvas keeping the 01 prefix, so the prefix rule wrongly
// filed them back under Grocery. Reading the server grouping ends that drift.
//
// One shared module-level fetch: many sections mount at once, one round trip.
// ============================================================

import { useEffect, useState } from "react";
import { type ApcClass, getDepartments } from "../services/apc";

export interface ApcBrowseGroup {
  code: string;     // department code, e.g. "APC-D01"
  title: string;    // department name, e.g. "Grocery"
  icon: string | null; // department glyph
  classes: ApcClass[];
}

let cache: ApcBrowseGroup[] | null = null;
let inflight: Promise<ApcBrowseGroup[]> | null = null;

async function loadOnce(): Promise<ApcBrowseGroup[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = getDepartments()
      .then((depts) => {
        cache = depts.map((d) => ({
          code: d.code,
          title: d.name,
          icon: d.icon,
          classes: d.classes,
        }));
        return cache;
      })
      .catch(() => {
        cache = [];
        return cache;
      })
      .finally(() => { inflight = null; });
  }
  return inflight;
}

export function useApcBrowser(): { groups: ApcBrowseGroup[]; loading: boolean } {
  const [groups, setGroups] = useState<ApcBrowseGroup[]>(cache ?? []);
  const [loading, setLoading] = useState(cache == null);

  useEffect(() => {
    let alive = true;
    if (cache) { setGroups(cache); setLoading(false); return; }
    loadOnce().then((g) => {
      if (!alive) return;
      setGroups(g);
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  return { groups, loading };
}
