// ============================================================
// CART CONTEXT — Apana Store (Customer App)
//
// Single source of truth for the multi-store cart.
// Shared between CartScreen, CheckoutScreen, and ProductDetail.
//
// The cart is CLIENT-OWNED (frontend-first): the backend has no /cart, and
// checkout receives the final item list. What changed is that its rows now
// carry real `productId` / `variantId`, so the list can actually be ordered
// (§13 checkout) instead of only drawn.
//
// Persisted to AsyncStorage. A cart that empties itself when the app is
// backgrounded reads as a bug, and a customer who loses a 12-item basket
// does not rebuild it.
// ============================================================

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  INITIAL_CART, CartStore, CartItem, FulfillmentMode,
} from "../data/cartData";
import { isLooseItem } from "../lib/measure";

// 🔴 BUMPED v2 → v3 to abandon carts written by an older build.
//
// The cart used to ship with four hardcoded sample stores as its initial
// state. That was removed (INITIAL_CART is now []), but the removal only
// fixed FRESH installs: any device that had already run the old build had
// those sample rows PERSISTED, and hydration below restored them on every
// launch. A tester saw a cart full of products that no shop sells, on a
// build whose code contains no mock cart at all.
//
// Worse than cosmetic: those rows predate real `productId`s, so checkout
// refuses them ("from an older cart and can no longer be ordered") — the
// cart was not just wrong, it was unusable and could not be cleared by
// anything the customer could do except reinstalling.
//
// Changing the KEY is the fix rather than a migration: there is nothing in
// an old cart worth keeping, and a key bump cannot half-succeed the way a
// field-by-field migration can.
const STORAGE_KEY = "apana_cart_v3";
// Read once at hydration so a device upgrading from the old build does not
// carry the dead payload around forever.
const LEGACY_STORAGE_KEYS = ["apana_cart_v2", "apana_cart"];

interface AddItemPayload {
  storeId:        string;
  storeName:      string;
  storeType:      string;
  storeTypeColor: string;
  storeTypeBg:    string;
  fulfillment:    FulfillmentMode;
  item:           CartItem;
}

interface CartContextValue {
  cart:           CartStore[];
  hydrated:       boolean;
  updateQty:      (storeId: string, itemId: string, delta: number) => void;
  removeItem:     (storeId: string, itemId: string) => void;
  setFulfillment: (storeId: string, mode: FulfillmentMode) => void;
  clearCart:      () => void;
  // Adds one item to the cart (from Product Detail / store pages)
  addItem:        (payload: AddItemPayload) => void;
  // Returns current qty of an item in cart (0 if not in cart)
  getItemQty:     (storeId: string, itemId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

// The row key for a listing. A variant listing keys on the SKU, so Large and
// Medium of the same shirt are two rows — merging them would let the customer
// order "3 shirts" with no way to say which sizes.
export function cartRowId(productId: string, variantId?: string | null): string {
  return variantId ? `${productId}::${variantId}` : productId;
}

// Strip rows a restored cart cannot actually order. Kept as free functions so
// the hydration path below reads as one line.
function keepOrderableRows(store: CartStore): CartStore {
  return { ...store, items: (store.items ?? []).filter((i) => Boolean(i?.productId)) };
}
function hasItems(store: CartStore): boolean {
  // A store whose every row was dropped should not linger as an empty header.
  return store.items.length > 0;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartStore[]>(INITIAL_CART);
  // Until the stored cart is read back, the in-memory [] is not "the cart is
  // empty" — it is "we don't know yet". Screens use this to avoid flashing the
  // empty state over a basket that is about to load.
  const [hydrated, setHydrated] = useState(false);
  const didHydrate = useRef(false);

  useEffect(() => {
    let alive = true;
    // Drop anything written under an older key. Fire-and-forget: failing to
    // clean up must not delay or break hydration of the current cart.
    AsyncStorage.multiRemove(LEGACY_STORAGE_KEYS).catch(() => {});

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!alive) return;
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as CartStore[];
            // `Array.isArray` alone was the whole validation, so ANY stored
            // array was trusted. Rows are now also checked for the one field
            // that makes a line orderable — a row without productId cannot be
            // checked out (services/checkoutService.ts throws on it), so
            // restoring it only builds a cart the customer cannot use and
            // cannot get rid of.
            if (Array.isArray(parsed)) setCart(parsed.map(keepOrderableRows).filter(hasItems));
          } catch {
            // Corrupt payload — start clean rather than crash the app on boot.
          }
        }
      })
      .finally(() => {
        if (!alive) return;
        didHydrate.current = true;
        setHydrated(true);
      });
    return () => { alive = false; };
  }, []);

  // Persist after every change, but never before hydration finishes — an early
  // write would overwrite the stored cart with the empty initial state.
  useEffect(() => {
    if (!didHydrate.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cart)).catch(() => {
      // Storage failure must not break the session; the in-memory cart stands.
    });
  }, [cart]);

  function updateQty(storeId: string, itemId: string, delta: number) {
    setCart(prev => prev.map(store => store.id !== storeId ? store : {
      ...store,
      items: store.items.map(item => {
        if (item.id !== itemId) return item;
        // Never let the stepper climb past the stock captured when the item
        // was added — the customer gets stopped here rather than at checkout
        // with a 409 after they have entered an address.
        const ceiling = item.maxQty != null && item.maxQty > 0 ? item.maxQty : Infinity;
        // A loose line moves in the shop's own increments (50 g at a time), not
        // by 1 gram, and floors at the smallest amount the counter will serve.
        // Stepping by 1 here would build a 501 g order that checkout then 422s.
        const loose = isLooseItem(item);
        const step = loose ? Math.max(1, item.stepMeasure ?? 1) : 1;
        const floor = loose ? Math.max(step, item.minMeasure ?? step) : 1;
        return { ...item, qty: Math.min(ceiling, Math.max(floor, item.qty + delta * step)) };
      }),
    }));
  }

  function removeItem(storeId: string, itemId: string) {
    setCart(prev =>
      prev.map(store => store.id !== storeId ? store : {
        ...store, items: store.items.filter(i => i.id !== itemId),
      }).filter(store => store.items.length > 0)
    );
  }

  function setFulfillment(storeId: string, mode: FulfillmentMode) {
    setCart(prev => prev.map(s => s.id === storeId ? { ...s, fulfillment: mode } : s));
  }

  function clearCart() {
    setCart([]);
  }

  // ── Add item from Product Detail screen ────────────────────
  // If the store already exists in cart, appends/increments item.
  // If new store, creates a new CartStore entry.
  function addItem({ storeId, storeName, storeType, storeTypeColor, storeTypeBg, fulfillment, item }: AddItemPayload) {
    setCart(prev => {
      const storeIdx = prev.findIndex(s => s.id === storeId);
      const ceiling = item.maxQty != null && item.maxQty > 0 ? item.maxQty : Infinity;

      if (storeIdx === -1) {
        // New store — create entry with this item
        return [...prev, { id: storeId, name: storeName, type: storeType, typeColor: storeTypeColor, typeBg: storeTypeBg, fulfillment, items: [{ ...item, qty: Math.min(ceiling, 1) }] }];
      }

      // Existing store — increment if item already in cart, else append
      const store    = prev[storeIdx];
      const itemIdx  = store.items.findIndex(i => i.id === item.id);
      const newItems = itemIdx === -1
        ? [...store.items, { ...item, qty: Math.min(ceiling, 1) }]
        // Re-adding refreshes price/stock from the live listing: the shelf may
        // have moved since this row was first added, and billing yesterday's
        // price is a promise the shop did not make.
        : store.items.map(i =>
            i.id === item.id
              ? { ...i, ...item, qty: Math.min(ceiling, i.qty + 1) }
              : i,
          );

      return prev.map(s => s.id === storeId ? { ...s, items: newItems } : s);
    });
  }

  // ── Get qty of a specific item in cart ─────────────────────
  function getItemQty(storeId: string, itemId: string): number {
    const store = cart.find(s => s.id === storeId);
    if (!store) return 0;
    return store.items.find(i => i.id === itemId)?.qty ?? 0;
  }

  return (
    <CartContext.Provider value={{
      cart, hydrated, updateQty, removeItem, setFulfillment,
      clearCart, addItem, getItemQty,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
