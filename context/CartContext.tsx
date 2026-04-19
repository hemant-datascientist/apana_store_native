// ============================================================
// CART CONTEXT — Apana Store (Customer App)
//
// Single source of truth for the multi-store cart.
// Shared between CartScreen, CheckoutScreen, and ProductDetail.
//
// Backend swap: replace INITIAL_CART with a GET /cart API call
// and call POST /cart for mutations.
// ============================================================

import React, { createContext, useContext, useState } from "react";
import {
  INITIAL_CART, CartStore, CartItem, FulfillmentMode,
} from "../data/cartData";

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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartStore[]>(INITIAL_CART);

  function updateQty(storeId: string, itemId: string, delta: number) {
    setCart(prev => prev.map(store => store.id !== storeId ? store : {
      ...store,
      items: store.items.map(item =>
        item.id !== itemId ? item : { ...item, qty: Math.max(1, item.qty + delta) }
      ),
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

      if (storeIdx === -1) {
        // New store — create entry with this item
        return [...prev, { id: storeId, name: storeName, type: storeType, typeColor: storeTypeColor, typeBg: storeTypeBg, fulfillment, items: [{ ...item, qty: 1 }] }];
      }

      // Existing store — increment if item already in cart, else append
      const store    = prev[storeIdx];
      const itemIdx  = store.items.findIndex(i => i.id === item.id);
      const newItems = itemIdx === -1
        ? [...store.items, { ...item, qty: 1 }]
        : store.items.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);

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
      cart, updateQty, removeItem, setFulfillment,
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
