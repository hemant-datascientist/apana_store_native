// "Only 2 left" / "Sold out" — what checkout offers instead of a dead end.
//
// The server refuses an order for more than the shelf holds and says how many
// ARE left (insufficient_stock + details.available). With some left, the
// shopper can take those. With none, they can drop it and ask to be told when
// it is back — the server's back-in-stock trigger then rings them.

import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../services/api/client";
import type { StockShortError } from "../services/checkoutService";

/** "Tell me when it's back". Best-effort: failing to watch must not block checkout. */
async function watchStock(productId: string, phone: string): Promise<void> {
  const auth = await AsyncStorage.getItem("apana_access_token");
  await fetch(`${API_BASE_URL}/notifications/stock-watch?customer_id=${encodeURIComponent(phone)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(auth ? { Authorization: `Bearer ${auth}` } : {}) },
    body: JSON.stringify({ product_id: productId }),
  }).catch(() => undefined);
}

export function offerStockShort(
  err: StockShortError,
  itemName: string,
  phone: string,
  limitItem: (productId: string, variantId: string | null, available: number) => void,
  onCartChanged: (note: string) => void,
): void {
  const { productId, variantId, available } = err;
  if (available > 0) {
    Alert.alert(`Only ${available} left`, `${itemName}: only ${available} left at this shop.`, [
      { text: "Not now", style: "cancel" },
      {
        text: `Take ${available}`,
        onPress: () => {
          limitItem(productId, variantId, available);
          onCartChanged(`${itemName} changed to ${available}. Tap Pay again to place the order.`);
        },
      },
    ]);
    return;
  }
  Alert.alert("Sold out", `${itemName} just sold out at this shop.`, [
    {
      text: "Remove it",
      onPress: () => {
        limitItem(productId, variantId, 0);
        onCartChanged(`${itemName} was removed. Tap Pay again to order the rest.`);
      },
    },
    {
      text: "Remove & tell me when it's back",
      onPress: () => {
        void watchStock(productId, phone);
        limitItem(productId, variantId, 0);
        onCartChanged(`${itemName} was removed — we'll notify you when it's back. Tap Pay again to order the rest.`);
      },
    },
  ]);
}
