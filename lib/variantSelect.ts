// ============================================================
// §23 variant selection — the logic behind a size/colour picker.
//
// The hard part of a variant picker is not drawing chips, it is never showing
// a choice that leads nowhere. A shop that stocks {S-Navy, M-Navy, L-Black}
// must not let a customer pick "L" then "Navy" and land on a combination that
// does not exist. So availability of a value is always evaluated against the
// OTHER axes already chosen, not in isolation.
//
// Out-of-stock values stay VISIBLE but disabled: "we sell L, it's gone" is
// useful information, and hiding it makes the shop look like it never carried
// the size at all.
// ============================================================

import type { ProductVariant } from "../services/liveCatalogService";

export interface AxisOption {
  value: string;
  // A variant with this value exists given the other current selections.
  exists: boolean;
  // ...and at least one such variant has stock.
  inStock: boolean;
}

export interface Axis {
  key: string; // "size", "color"
  label: string; // "Size", "Color"
  options: AxisOption[];
}

// Axis keys, in the order the seller's schema declared them. Object key order
// is insertion order in JS and the backend preserves the seller's payload, so
// "size" before "color" stays that way instead of sorting alphabetically.
export function axisKeys(variants: ProductVariant[]): string[] {
  const seen: string[] = [];
  for (const v of variants) {
    for (const k of Object.keys(v.axes)) {
      if (!seen.includes(k)) seen.push(k);
    }
  }
  return seen;
}

export function axisLabel(key: string): string {
  // "sleeveLength" → "Sleeve Length"; the seller's schema keys are camelCase.
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// Distinct values for an axis, in first-seen order (the seller's chip order).
function valuesFor(variants: ProductVariant[], key: string): string[] {
  const out: string[] = [];
  for (const v of variants) {
    const val = v.axes[key];
    if (val != null && !out.includes(val)) out.push(val);
  }
  return out;
}

/**
 * Build the axis rows for the current selection.
 *
 * A value on axis K is judged against every OTHER axis's current selection —
 * not against the full selection including K itself, or picking a new value
 * for K would always look unavailable.
 */
export function buildAxes(
  variants: ProductVariant[],
  selection: Record<string, string>,
): Axis[] {
  const keys = axisKeys(variants);

  return keys.map((key) => {
    const others = keys.filter((k) => k !== key && selection[k] != null);

    const options: AxisOption[] = valuesFor(variants, key).map((value) => {
      const matching = variants.filter(
        (v) => v.axes[key] === value && others.every((k) => v.axes[k] === selection[k]),
      );
      return {
        value,
        exists: matching.length > 0,
        inStock: matching.some((v) => v.stockQty > 0),
      };
    });

    return { key, label: axisLabel(key), options };
  });
}

// The one variant matching a complete selection, or null while the customer
// still has an axis to choose (or has chosen a combination that isn't stocked).
export function resolveVariant(
  variants: ProductVariant[],
  selection: Record<string, string>,
): ProductVariant | null {
  const keys = axisKeys(variants);
  if (keys.some((k) => selection[k] == null)) return null;
  return variants.find((v) => keys.every((k) => v.axes[k] === selection[k])) ?? null;
}

/**
 * Opening selection: the first in-stock SKU, else the first that exists.
 *
 * Starting with nothing chosen leaves the price block blank and the buy button
 * dead, which reads as a broken screen. Starting on something the shop can
 * actually sell is both truthful and usable.
 */
export function initialSelection(variants: ProductVariant[]): Record<string, string> {
  if (variants.length === 0) return {};
  const preferred = variants.find((v) => v.stockQty > 0) ?? variants[0];
  return { ...preferred.axes };
}

// What the customer pays for a variant. null on the variant means "same as the
// parent" (§23 schema) — resolving that here keeps every caller from
// re-implementing the fallback and getting it subtly wrong.
export function variantPrice(variant: ProductVariant | null, parentPrice: number): number {
  return variant?.price ?? parentPrice;
}

export function variantMrp(variant: ProductVariant | null, parentMrp: number | null): number | null {
  return variant?.mrp ?? parentMrp;
}

// Stock the customer can actually buy right now.
export function variantStock(
  variant: ProductVariant | null,
  variants: ProductVariant[],
  parentStock: number,
): number {
  if (variants.length === 0) return parentStock;
  return variant?.stockQty ?? 0;
}
