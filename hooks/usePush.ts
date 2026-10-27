// Registers this phone for push once a customer is signed in (mounted from the
// tabs layout). A guest has no token, so nothing is registered. A tap opens
// the order's tracking screen, or the product for a back-in-stock alert.
import { useEffect, useRef } from "react";
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
  // The router is a new object as screens change. As an effect dependency it
  // tore down and re-registered the push token dozens of times a second, so
  // it is read through a ref and the effect runs once per sign-in.
  const routerRef = useRef(router);
  routerRef.current = router;
  useEffect(
    () =>
      startPush(
        (token) => pushTokenRequest("POST", token),
        (data) => {
          const orderId = typeof data.order_id === "string" ? data.order_id : null;
          const productId = typeof data.product_id === "string" ? data.product_id : null;
          if (orderId) routerRef.current.push({ pathname: "/order-tracking", params: { serverOrderId: orderId } });
          // "Back in stock" opens the product, where it can be added again.
          else if (productId) routerRef.current.push({ pathname: "/live-product-detail", params: { id: productId } });
          else routerRef.current.push("/(info)/notifications");
        },
      ),
    [],
  );
}
