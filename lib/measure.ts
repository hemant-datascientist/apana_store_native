// ============================================================
// Measure — how a loose amount becomes money and words, customer side.
//
// Mirrors apana_backend/packages/shared/src/measure.ts. The cart must show the
// SAME number the server will charge, or the customer sees one price and pays
// another — so the arithmetic is copied deliberately and kept tiny, rather than
// re-derived per screen. If the backend formula ever changes, this changes with it.
//
// Base units: weight → grams, volume → ml, piece → pieces, count → units.
// Weight/volume rates are quoted per 100 base units; piece rates per piece.
// ============================================================

import type { CartItem } from "../data/cartData";

export type MeasureKind = "count" | "weight" | "volume" | "piece";

export function measureBasis(kind: MeasureKind): number {
  return kind === "weight" || kind === "volume" ? 100 : 1;
}

// A line is loose when it carries a non-count measure. Packaged lines have no
// measureKind at all, so this is false for every pre-existing row.
export function isLooseItem(item: Pick<CartItem, "measureKind">): boolean {
  return item.measureKind != null && item.measureKind !== "count";
}

// Line total in PAISE, matching measureLineTotalCents on the server.
export function measureLineTotalCents(
  kind: MeasureKind,
  amount: number,
  pricePerMeasureCents: number | null | undefined,
): number {
  return Math.round((amount * (pricePerMeasureCents ?? 0)) / measureBasis(kind));
}

// "500 g" · "1.5 kg" · "6 bunches" — how a shopper says the amount.
export function formatMeasure(kind: MeasureKind, amount: number, unit?: string | null): string {
  if (kind === "weight") return amount >= 1000 ? `${+(amount / 1000).toFixed(2)} kg` : `${amount} g`;
  if (kind === "volume") return amount >= 1000 ? `${+(amount / 1000).toFixed(2)} L` : `${amount} ml`;
  if (kind === "piece") {
    const word = unit && unit !== "piece" ? unit : "piece";
    return `${amount} ${amount === 1 ? word : pluralise(word)}`;
  }
  return String(amount);
}

function pluralise(word: string): string {
  if (/(ch|sh|s|x|z)$/i.test(word)) return `${word}es`;
  if (/[^aeiou]y$/i.test(word)) return `${word.slice(0, -1)}ies`;
  return `${word}s`;
}

// "₹40/kg" — the rate as a shopper reads it. Stored per 100 g, so ×10 for a kg;
// a per-100 g figure on a price tag would be unreadable in an Indian shop.
export function formatRate(kind: MeasureKind, pricePerMeasureCents: number | null | undefined, unit?: string | null): string {
  const c = pricePerMeasureCents ?? 0;
  if (kind === "weight") return `₹${Math.round(c * 10) / 100}/kg`;
  if (kind === "volume") return `₹${Math.round(c * 10) / 100}/L`;
  const word = unit && unit !== "piece" ? unit : "piece";
  return `₹${Math.round(c) / 100}/${word}`;
}

// Amounts offered as one-tap presets. Only those the shop can actually serve
// survive: a preset below the minimum, or off the weighing step, would be
// refused at checkout — better never to show it.
const WEIGHT_PRESETS = [250, 500, 1000, 2000];
const VOLUME_PRESETS = [200, 500, 1000, 2000];
const PIECE_PRESETS = [1, 2, 5, 10];

export function measurePresets(
  kind: MeasureKind,
  opts: { min?: number | null; step?: number | null; max?: number | null },
): number[] {
  const base = kind === "weight" ? WEIGHT_PRESETS : kind === "volume" ? VOLUME_PRESETS : PIECE_PRESETS;
  const min = opts.min ?? 1;
  const step = opts.step ?? 1;
  const max = opts.max ?? Infinity;
  return base.filter((a) => a >= min && a <= max && (step <= 1 || a % step === 0));
}

// ── self-check (bun run lib/measure.ts) ──
// These expectations are COPIED from the backend's own measure self-check
// (apana_backend/packages/shared/src/measure.ts). If the two ever disagree the
// customer is quoted one price and charged another, so the numbers are asserted
// here rather than trusted to stay in sync by memory.
if ((import.meta as { main?: boolean }).main) {
  const eq = (a: unknown, b: unknown, m: string) => {
    if (a !== b) throw new Error(`FAIL ${m}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`);
  };
  eq(measureLineTotalCents("weight", 500, 400), 2000, "500g x Rs40/kg = Rs20");
  eq(measureLineTotalCents("weight", 1000, 400), 4000, "1kg x Rs40/kg");
  eq(measureLineTotalCents("volume", 250, 300), 750, "250ml x Rs3/100ml");
  eq(measureLineTotalCents("piece", 6, 1500), 9000, "6 pieces x Rs15");
  eq(measureLineTotalCents("weight", 175, 333), 583, "rounds once, at the line");

  eq(formatMeasure("weight", 500), "500 g", "grams");
  eq(formatMeasure("weight", 1500), "1.5 kg", "kg");
  eq(formatMeasure("volume", 2000), "2 L", "litres");
  eq(formatMeasure("piece", 6, "bunch"), "6 bunches", "sibilant plural");

  eq(formatRate("weight", 400), "₹40/kg", "per-100g rate reads per kg");
  eq(formatRate("volume", 300), "₹30/L", "per-100ml rate reads per litre");

  // Presets must never offer something the counter would refuse.
  eq(JSON.stringify(measurePresets("weight", { min: 250, step: 50, max: 2000 })),
     JSON.stringify([250, 500, 1000, 2000]), "presets within min/step/stock");
  // A 300 g weighing step fits none of the standard presets, so none are shown
  // rather than offering an amount the shop would refuse.
  eq(measurePresets("weight", { min: 250, step: 300, max: 2000 }).length, 0, "no preset fits a 300g step");
  eq(JSON.stringify(measurePresets("weight", { min: 250, step: 50, max: 600 })),
     JSON.stringify([250, 500]), "presets capped by available stock");
  console.log("measure self-check OK (matches backend expectations)");
}
