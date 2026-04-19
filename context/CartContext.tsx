// ============================================================
// CART CONTEXT — Apana Store (Customer App)
//
// Single source of truth for the multi-store cart.
// Shared between CartScreen and CheckoutScreen so both always
// see the same data — changes on the cart page are instantly
// visible to checkout (and vice versa when backend is wired).
//
// Backend swap: replace INITIAL_CART with a GET /cart API call
// inside the provider, and call POST /cart for mutations.
// ============================================================

import React, { createContext, useContext, useState } from "react";
import {
  INITIAL_CART, CartStore, CartItem, FulfillmentMode,
} from "../data/cartData";

// ── Context shape ─────────────────────────────────────────────

interface CartContextValue {
  cart:            CartStore[];
  updateQty:       (storeId: string, itemId: string, delta: number) => void;
  removeItem:      (storeId: string, itemId: string) => void;
  setFulfillment:  (storeId: string, mode: FulfillmentMode)  => void;
  clearCart:       () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialise from mock data.
  // Backend swap: useState(await fetchCart()) inside a useEffect.
  const [cart, setCart] = useState<CartStore[]>(INITIAL_CART);

  function updateQty(storeId: string, itemId: string, delta: number) {
    setCart(prev => prev.map(store => store.id !== storeId ? store : {
      ...store,
      items: store.items.map(item =>
        item.id !== itemId ? item : { ...item, qty: Math.max(1, item.qty + delta) }
      ),
    }));
  }

  // Removes item; drops the store card when its last item is gone
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

  return (
    <CartContext.Provider value={{ cart, updateQty, removeItem, setFulfillment, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
