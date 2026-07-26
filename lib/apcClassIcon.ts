// ============================================================
// apcClassIcon — an Ionicons glyph for an APC class code.
//
// Maps the class SLUG (last non-department segment of an APC class code,
// e.g. APC-04-PCARE → PCARE) to a category icon for the Store Detail category
// rows. Unknown / null → a neutral tag icon; a category is never left iconless.
// ============================================================

// slug → Ionicons name. Kept to the 49 live classes; extend as the taxonomy
// grows. Deliberately not exhaustive on sub-variants — one glyph per class.
const ICON_BY_SLUG: Record<string, string> = {
  FRT: "nutrition-outline",
  VEG: "leaf-outline",
  DAI: "egg-outline",
  NVG: "fish-outline",
  STPL: "basket-outline",
  SPC: "flame-outline",
  MITH: "ice-cream-outline",
  NMK: "fast-food-outline",
  BKY: "cafe-outline",
  OIL: "water-outline",
  DRYF: "flower-outline",
  TEA: "cafe-outline",
  PKGF: "fast-food-outline",
  BEV: "wine-outline",
  MUKH: "sparkles-outline",
  PCARE: "medkit-outline",
  BTY: "color-palette-outline",
  MED: "medical-outline",
  WELL: "fitness-outline",
  ELDR: "accessibility-outline",
  BABY: "happy-outline",
  BABYM: "happy-outline",
  FASH: "shirt-outline",
  FABR: "cut-outline",
  ELEC: "flash-outline",
  A7: "phone-portrait-outline",
  A8: "laptop-outline",
  A9: "tv-outline",
  HFUR: "bed-outline",
  KTCH: "restaurant-outline",
  CLN: "sparkles-outline",
  HOME: "home-outline",
  SANI: "construct-outline",
  TOOL: "hammer-outline",
  BOOK: "book-outline",
  ART: "brush-outline",
  MUS: "musical-notes-outline",
  TOY: "game-controller-outline",
  SPRT: "football-outline",
  PET: "paw-outline",
  FLR: "flower-outline",
  PLANT: "leaf-outline",
  POOJ: "flame-outline",
  FIRE: "sparkles-outline",
  AUTO: "car-outline",
  AGRI: "leaf-outline",
  LIQ: "wine-outline",
  SIN: "warning-outline",
  MISC: "cube-outline",
};

const FALLBACK = "pricetag-outline";

// Class SLUG from an APC class code, skipping the 2-digit department segment.
//   APC-04-PCARE → PCARE · APC-12-A7 → A7 · APC-PCARE → PCARE
function slugOf(code: string | null | undefined): string {
  if (!code) return "";
  const parts = code.replace(/^APC-/i, "").split("-");
  const slug = /^\d{2}$/.test(parts[0] ?? "") ? parts[1] : parts[0];
  return (slug ?? "").toUpperCase();
}

export function apcClassIcon(code: string | null | undefined): string {
  return ICON_BY_SLUG[slugOf(code)] ?? FALLBACK;
}
