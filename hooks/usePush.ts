// Registers this phone for push once a customer is signed in (mounted from the
// tabs layout). A guest has no token, so nothing is registered. A tap opens
// the order's tracking screen, or the product for a back-in-stock alert.
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../services/api/client";
import { startPush } from "../lib/push";

const TOKEN_KEY = "apana_access_token";

export async function pushTokenRequest(method: "POST" | "DELETE", token: string): Promise<void> {
  const auth = await AsyncStorage.getItem(TOKEN_KEY);
  if (!auth) return;
  const res = await fetch(`${API_BASE_URL}/notifications/device-tokens`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth}` },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error(`device-tokens HTTP ${res.status}`);
}

export default function usePush(): void {
  const router = useRouter();
  useEffect(
    () =>
      startPush(
        (token) => pushTokenRequest("POST", token),
        (data) => {
          const orderId = typeof data.order_id === "string" ? data.order_id : null;
          const productId = typeof data.product_id === "string" ? data.product_id : null;
          if (orderId) router.push({ pathname: "/order-tracking", params: { serverOrderId: orderId } });
          // "Back in stock" opens the product, where it can be added again.
          else if (productId) router.push({ pathname: "/live-product-detail", params: { id: productId } });
          else router.push("/(info)/notifications");
        },
      ),
    [router],
  );
}
