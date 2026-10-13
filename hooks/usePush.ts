// Registers this phone for push once a customer is signed in (mounted from the
// tabs layout). A guest has no token, so nothing is registered. A tap on an
// order update opens that order's tracking screen.
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
          router.push(orderId ? { pathname: "/order-tracking", params: { serverOrderId: orderId } } : "/(info)/notifications");
        },
      ),
    [router],
  );
}
