// ============================================================
// useApcBrowser — the category browser, driven straight from the §27 APC
// classification instead of a hand-written merchandising list.
//
// Departments come from the tree roots (APC-D01 "Food & Fresh" …) and classes
// from /classes (APC-01-VEG "Vegetables" …); a class joins its department by
// the 2-digit number in its code. Because both sides are read from the live
// taxonomy, the browser can never drift from the canvas — a class added to the
// canvas simply appears here.
//
// One shared module-level fetch: many sections mount at once, one round trip.
// ============================================================

import { useEffect, useState } from "react";
import {
  ApcClass, classDeptNo, getClasses, getTreeRoots,
} from "../services/apc";

export interface ApcBrowseGroup {
  code: string;     // department code, e.g. "APC-D01"
  title: string;    // department name, e.g. "Food & Fresh"
  classes: ApcClass[];
}

let cache: ApcBrowseGroup[] | null = null;
let inflight: Promise<ApcBrowseGroup[]> | null = null;

function group(classes: ApcClass[], roots: { code: string; name: string }[]): ApcBrowseGroup[] {
  const byDept = new Map<string, ApcClass[]>();
  for (const c of classes) {
    const d = classDeptNo(c.code);
    if (!d) continue;
    const list = byDept.get(d) ?? [];
    list.push(c);
    byDept.set(d, list);
  }
  const out: ApcBrowseGroup[] = [];
  for (const r of roots) {
    const m = /^APC-D(\d{2})$/.exec(r.code);
    if (!m) continue;
    const list = byDept.get(m[1]);
    if (!list || list.length === 0) continue; // empty department -> no shell
    out.push({
      code: r.code,
      title: r.name,
      classes: [...list].sort((a, b) => a.sort_order - b.sort_order),
    });
  }
  return out;
}

async function loadOnce(): Promise<ApcBrowseGroup[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = Promise.all([getClasses(), getTreeRoots()])
      .then(([classes, roots]) => {
        cache = group(classes, roots.map((r) => ({ code: r.code, name: r.name })));
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
