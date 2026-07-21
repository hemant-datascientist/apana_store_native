// ============================================================
// useDishBasket — the per-kitchen dish basket.
//
// Deliberately NOT part of the global CartContext. That cart is goods-shaped
// (stock, units, multi-store split); a dish basket belongs to one kitchen for
// one sitting, and mixing them would let a customer "checkout" a plate of dal
// down the stock ledger. One kitchen, one basket, cleared on order.
//
// Quantities are held immutably — every change returns a new map, so a stale
// render can never mutate the live basket underneath it.
// ============================================================

import { useCallback, useMemo, useState } from "react";
import type { Dish } from "../services/menuService";

export interface BasketLine {
  dish: Dish;
  qty: number;
}

export interface DishBasket {
  lines: BasketLine[];
  itemCount: number;
  total: number; // rupees, everyday price (deals resolve server-side)
  qtyOf: (dishId: string) => number;
  add: (dish: Dish) => void;
  remove: (dish: Dish) => void;
  clear: () => void;
}

export function useDishBasket(): DishBasket {
  const [byId, setById] = useState<Record<string, BasketLine>>({});

  const add = useCallback((dish: Dish) => {
    setById((prev) => {
      const existing = prev[dish.id];
      return { ...prev, [dish.id]: { dish, qty: (existing?.qty ?? 0) + 1 } };
    });
  }, []);

  const remove = useCallback((dish: Dish) => {
    setById((prev) => {
      const existing = prev[dish.id];
      if (!existing) return prev;
      if (existing.qty <= 1) {
        const { [dish.id]: _dropped, ...rest } = prev;
        return rest;
      }
      return { ...prev, [dish.id]: { dish, qty: existing.qty - 1 } };
    });
  }, []);

  const clear = useCallback(() => setById({}), []);

  const lines = useMemo(() => Object.values(byId), [byId]);
  const itemCount = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
  const total = useMemo(() => lines.reduce((s, l) => s + l.dish.price * l.qty, 0), [lines]);

  const qtyOf = useCallback((dishId: string) => byId[dishId]?.qty ?? 0, [byId]);

  return { lines, itemCount, total, qtyOf, add, remove, clear };
}
