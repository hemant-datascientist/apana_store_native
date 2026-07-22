// ============================================================
// Store tint — a stable colour pair for a real store in the cart.
//
// The cart UI was built against mock stores that carried hand-picked colours.
// Real sellers have none, and a random colour per render makes the same shop
// look like a different one each time the cart redraws. Hashing the store id
// gives a colour that is arbitrary but CONSTANT for that shop.
// ============================================================

const TINTS: { color: string; bg: string }[] = [
  { color: "#166534", bg: "#DCFCE7" },
  { color: "#1D4ED8", bg: "#DBEAFE" },
  { color: "#92400E", bg: "#FEF3C7" },
  { color: "#6D28D9", bg: "#EDE9FE" },
  { color: "#9D174D", bg: "#FCE7F3" },
  { color: "#0F766E", bg: "#CCFBF1" },
  { color: "#B45309", bg: "#FFEDD5" },
  { color: "#1E3A5F", bg: "#E0F2FE" },
];

export function storeTint(storeId: string): { color: string; bg: string } {
  let hash = 0;
  for (let i = 0; i < storeId.length; i++) {
    hash = (hash * 31 + storeId.charCodeAt(i)) >>> 0;
  }
  return TINTS[hash % TINTS.length];
}
