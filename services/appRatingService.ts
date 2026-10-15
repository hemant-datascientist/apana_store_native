// POST {API}/customer/me/app-rating — "Rate the App" is stored (migration 0112).
// The screen used to say thank you and send nothing.
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { API_BASE_URL } from "./api/client";

export async function submitAppRating(input: {
  rating: number;
  tags: string[];
  feedback: string;
  phone: string | null;
}): Promise<void> {
  const token = await AsyncStorage.getItem("apana_access_token");
  // ?customer_id= is honoured only off production (the server ignores it there).
  const q = input.phone ? `?customer_id=${encodeURIComponent(input.phone)}` : "";
  const res = await fetch(`${API_BASE_URL}/me/app-rating${q}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({
      rating: input.rating,
      tags: input.tags,
      feedback: input.feedback.trim() || null,
      app_version: Constants.expoConfig?.version ?? undefined,
    }),
  });
  if (!res.ok) throw new Error(res.status === 401 ? "Sign in to rate the app." : `Could not send (${res.status}).`);
}
