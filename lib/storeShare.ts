// ============================================================
// STORE SHARE — shareable identity for a storefront so a customer can share a
// shop and others can scan/open + follow it. §30 growth loop.
// parseStoreId() decodes a scanned QR / opened deep link back to an id.
//
// 🔴 THERE IS NO https LINK, AND THE ONE THAT WAS HERE BELONGED TO SOMEBODY
// ELSE. SHARE_BASE was "https://apana.app/s". Apana does not own apana.app —
// it serves "Apana Technologies", an unrelated company — and /s/<id> is a 404
// there. So a customer sharing a local shop with a friend sent them to a
// different business under that shop's name. Same trap already recorded for
// apana.in, which is not Apana's either and serves "Range Cotton Official Site".
//
// ⚠ ASYMMETRIC ON PURPOSE: parseStoreId below still ACCEPTS apana.app/s/<id>.
// Links and printed posters carrying it are already out in the world, and
// continuing to READ them costs nothing, while refusing them would strand a
// shop's printed QR. Stop emitting it; keep understanding it.
//
// A real public store page now exists (apana_registry_web app/s/[id]) — but
// this file still does NOT hardcode a domain for it. Unlike apana.app/apana.in,
// the deploy origin for that page genuinely isn't known from inside this app,
// and guessing one is exactly the mistake this file exists to document. Set
// EXPO_PUBLIC_STORE_WEB_URL to the real deployed origin once it's known; until
// then `url` stays undefined and only the deep link is offered, same as before.
// ============================================================

const DEEP_SCHEME = "apanastore://s"; // matches app.json scheme
const WEB_BASE = (process.env.EXPO_PUBLIC_STORE_WEB_URL ?? "").replace(/\/+$/, "");

export interface StoreShare {
  id: string;
  name: string;
  /**
   * apanastore://s/<id> — opens this store in the Apana app.
   *
   * ⚠ NOT an https URL. WhatsApp and most chat apps only turn http(s) into a
   * tappable link, so this travels as plain text there; the QR is the path
   * that actually works today.
   */
  deepLink: string;
  /**
   * https://<web origin>/s/<id> — the real public store page, only when
   * EXPO_PUBLIC_STORE_WEB_URL is configured. undefined otherwise, never a
   * guessed domain.
   */
  url?: string;
  message: string; // pre-filled share / WhatsApp text (EN + HI)
}

// Names the app requirement rather than carrying a link that resolves for
// nobody — a message promising a page that does not exist makes the SHOP look
// broken to whoever it was forwarded to.
function shareMessage(name: string, deepLink: string, url: string | undefined): string {
  const openLine = url
    ? `View online:\n${url}\n\nOpen in the Apana app:\n${deepLink}`
    : `Open in the Apana app:\n${deepLink}`;
  return (
    `Check out ${name} on Apana — order from this local shop for delivery.\n` +
    `${name} को Apana पर देखें — इस लोकल दुकान से डिलीवरी मँगाएँ।\n\n` +
    openLine
  );
}

export function buildStoreShare(id: string, name: string): StoreShare {
  const safe = encodeURIComponent(id.trim());
  const deepLink = `${DEEP_SCHEME}/${safe}`;
  const url = WEB_BASE ? `${WEB_BASE}/s/${safe}` : undefined;
  return { id, name, deepLink, url, message: shareMessage(name, deepLink, url) };
}

// Extract a store id from a scanned QR value / opened deep link, else null.
// Accepts apanastore://s/<id>, apana://s/<id>, *apana.app/s/<id> (legacy
// printed codes), or the generic .../s/<id> suffix any real web origin will
// carry — matched by SHAPE rather than a hardcoded host, since that origin
// isn't known here (see header).
export function parseStoreId(value: string | null | undefined): string | null {
  if (!value) return null;
  const m = value
    .trim()
    .match(/(?:apanastore:\/\/s\/|apana:\/\/s\/|(?:https?:\/\/)?[^/\s]+\/s\/)([A-Za-z0-9._-]+)/i);
  return m ? decodeURIComponent(m[1]) : null;
}
