// Checkout said only `available` of one line are left. Lower that line to it
// and cap its stepper there; at 0 the line goes, and a shop left with no lines
// goes too. Matches the SIZE as well as the product — "only 1 Large left" must
// not shrink the Medium beside it.
import type { CartStore } from "../data/cartData";

export function limitCartLine(
  cart: CartStore[], productId: string, variantId: string | null, available: number,
): CartStore[] {
  return cart
    .map((store) => ({
      ...store,
      items: store.items
        .map((i) => (i.productId === productId && (i.variantId ?? null) === variantId
          ? { ...i, qty: Math.min(i.qty, available), maxQty: available }
          : i))
        .filter((i) => i.qty > 0),
    }))
    .filter((store) => store.items.length > 0);
}
