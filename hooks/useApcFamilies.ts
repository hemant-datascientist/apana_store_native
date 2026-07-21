// ============================================================
// useApcFamilies — the families (real sub-categories) of one APC class.
//
// Most APC departments hold a single class, so the browsable sub-categories
// live one tier down: Fashion -> Clothings, Footwears, Watches… This fetches
// them per class, module-cached, and is called from the section component so
// FlatList windowing keeps it lazy (only on-screen departments fetch).
// ============================================================

import { useEffect, useState } from "react";
import { ApcFamily, getFamilies } from "../services/apc";

const cache = new Map<string, ApcFamily[]>();
const inflight = new Map<string, Promise<ApcFamily[]>>();

function loadOnce(classCode: string): Promise<ApcFamily[]> {
  const hit = cache.get(classCode);
  if (hit) return Promise.resolve(hit);
  let p = inflight.get(classCode);
  if (!p) {
    p = getFamilies(classCode)
      .then((fams) => { cache.set(classCode, fams); return fams; })
      .catch(() => { cache.set(classCode, []); return []; })
      .finally(() => { inflight.delete(classCode); });
    inflight.set(classCode, p);
  }
  return p;
}

// classCode = null -> not needed (department already has several classes).
export function useApcFamilies(classCode: string | null): { families: ApcFamily[]; loading: boolean } {
  const [families, setFamilies] = useState<ApcFamily[]>(
    classCode ? cache.get(classCode) ?? [] : [],
  );
  const [loading, setLoading] = useState(classCode ? !cache.has(classCode) : false);

  useEffect(() => {
    let alive = true;
    if (!classCode) { setFamilies([]); setLoading(false); return; }
    const hit = cache.get(classCode);
    if (hit) { setFamilies(hit); setLoading(false); return; }
    setLoading(true);
    loadOnce(classCode).then((fams) => {
      if (!alive) return;
      setFamilies(fams);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [classCode]);

  return { families, loading };
}
