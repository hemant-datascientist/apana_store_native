// ============================================================
// useLiveProductCart — add / + / − for a real (LiveProduct) listing.
//
// The same shape app/category-products.tsx and CategoryLiveProducts already
// use inline: a plain listing adds one straight in, keyed on its product id;
// a variant listing never reaches here (ApcGridCard sends it to detail so a
// size is chosen first). Pairs with ApcGridCard's onAdd / onInc / onDec.
// ============================================================

import { cartRowId, useCart } from "../context/CartContext";
import { storeTint } from "../lib/storeTint";
import { orderCeiling, type LiveProduct } from "../services/liveCatalogService";

export function useLiveProductCart() {
  const { addItem, updateQty, removeItem, getItemQty } = useCart();

  return {
    qtyOf: (p: LiveProduct) => getItemQty(p.store.id, p.id),
    add(p: LiveProduct) {
      const tint = storeTint(p.store.id);
      addItem({
        storeId: p.store.id, storeName: p.store.name, storeType: p.store.type,
        storeTypeColor: tint.color, storeTypeBg: tint.bg, fulfillment: "pickup",
        item: {
          id: cartRowId(p.id, null), productId: p.id, variantId: null,
          maxQty: orderCeiling(p), image: p.image, name: p.name, unit: p.unit,
          price: p.price, qty: 1, icon: "pricetag-outline", bg: tint.bg,
          floorPrice: p.dealPrice ?? undefined,
        },
      });
    },
    inc: (p: LiveProduct) => updateQty(p.store.id, p.id, 1),
    dec(p: LiveProduct) {
      if (getItemQty(p.store.id, p.id) <= 1) removeItem(p.store.id, p.id);
      else updateQty(p.store.id, p.id, -1);
    },
  };
}
