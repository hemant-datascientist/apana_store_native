// ============================================================
// useAscBrowser — the stores browser, driven by the §16 ASC taxonomy.
//
// Groups the 106 store types under their 5 classes, straight from the live
// API. One shared module-level fetch; findType() lets a detail screen read a
// type out of the same cache instead of re-fetching.
// ============================================================

import { useEffect, useState } from "react";
import { AscClass, AscType, getAscClasses, getAscTypes } from "../services/asc";

export interface AscBrowseGroup {
  cls: AscClass;
  types: AscType[];
}

let cache: AscBrowseGroup[] | null = null;
let inflight: Promise<AscBrowseGroup[]> | null = null;

function group(classes: AscClass[], types: AscType[]): AscBrowseGroup[] {
  const byClass = new Map<string, AscType[]>();
  for (const t of types) {
    const list = byClass.get(t.class_id) ?? [];
    list.push(t);
    byClass.set(t.class_id, list);
  }
  return [...classes]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((cls) => ({
      cls,
      types: (byClass.get(cls.id) ?? []).sort(
        (a, b) => a.sort_order - b.sort_order || a.num - b.num,
      ),
    }))
    .filter((g) => g.types.length > 0); // empty class -> no shell
}

async function loadOnce(): Promise<AscBrowseGroup[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = Promise.all([getAscClasses(), getAscTypes()])
      .then(([classes, types]) => { cache = group(classes, types); return cache; })
      .catch(() => { cache = []; return cache; })
      .finally(() => { inflight = null; });
  }
  return inflight;
}

export function useAscBrowser(): { groups: AscBrowseGroup[]; loading: boolean } {
  const [groups, setGroups] = useState<AscBrowseGroup[]>(cache ?? []);
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

// Read one store type (used by the type-detail screen) without a second call.
export function useAscType(code: string | undefined): { type: AscType | null; cls: AscClass | null; loading: boolean } {
  const { groups, loading } = useAscBrowser();
  if (!code) return { type: null, cls: null, loading };
  for (const g of groups) {
    const t = g.types.find((x) => x.code === code);
    if (t) return { type: t, cls: g.cls, loading };
  }
  return { type: null, cls: null, loading };
}
