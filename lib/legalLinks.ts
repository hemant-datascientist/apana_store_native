// Terms of Service and Privacy Policy pages, set at build time (EXPO_PUBLIC_TERMS_URL,
// EXPO_PUBLIC_PRIVACY_URL). Play Store requires a reachable privacy policy. https only:
// a typo or an http page must not become the legal document a customer agrees to.
import { Linking } from "react-native";

const httpsOnly = (v: string | undefined) => (v && /^https:\/\/\S+$/i.test(v.trim()) ? v.trim() : null);

export const TERMS_URL = httpsOnly(process.env.EXPO_PUBLIC_TERMS_URL);
export const PRIVACY_URL = httpsOnly(process.env.EXPO_PUBLIC_PRIVACY_URL);

/** Open a legal page; a no-op when it is not set (the text then stays plain). */
export function openLegal(url: string | null): void {
  if (url) void Linking.openURL(url);
}
