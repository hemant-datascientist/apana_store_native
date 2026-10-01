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
// A real public store page now exists: apana_store_web, at "/@<handle>" — a
// human-readable slug per shop (modules/seller/src/handle.ts), the YouTube-
// channel shape, chosen over a custom subdomain per seller specifically
// because a subdomain needs DNS/certs per shop and this needs none. It rides
// the BACKEND's own origin — the API server reverse-proxies /@<handle> and
// /_next/* to the Next dev server (apps/api/src/index.ts) — rather than a
// second EXPO_PUBLIC_STORE_WEB_URL and a second cloudflared tunnel to keep
// alive. The backend's tunnel is the one everything else already depends on
// and gets tested every request, so the website piggybacks on it.
//
// 🔴 THE DEEP LINK AND THE WEB URL ARE KEYED DIFFERENTLY, ON PURPOSE. The
// native deep link (apanastore://s/<id>) is this app's own routing and stays
// id-based — changing it would mean touching the app's own route table for
// no reason. The web URL is handle-based because a human reads it. One
// function building both now needs both inputs.
//
// Same base-URL computation every services/*.ts file already uses — no new
// convention, just reused here for one more purpose.
// ============================================================

const DEEP_SCHEME = "apanastore://s"; // matches app.json scheme
const TOWER_IP = process.env.EXPO_PUBLIC_TOWER_IP ?? "10.153.78.94";
const WEB_BASE = (process.env.EXPO_PUBLIC_BE_BASE_URL ?? "").replace(/\/+$/, "") || `http://${TOWER_IP}:8000`;

export interface StoreShare {
  id: string;
  handle: string;
  name: string;
  /**
   * apanastore://s/<id> — opens this store in the Apana app.
   *
   * ⚠ NOT an https URL. WhatsApp and most chat apps only turn http(s) into a
   * tappable link, so this travels as plain text there; the QR is the path
   * that actually works today.
   */
  deepLink: string;
  /** <backend origin>/@<handle> — the real public store page, served by the
   *  same backend the rest of the app already talks to. */
  url: string;
  message: string; // pre-filled share / WhatsApp text (EN + HI)
}

function shareMessage(name: string, deepLink: string, url: string): string {
  return (
    `Check out ${name} on Apana — order from this local shop for delivery.\n` +
    `${name} को Apana पर देखें — इस लोकल दुकान से डिलीवरी मँगाएँ।\n\n` +
    `View online:\n${url}\n\nOpen in the Apana app:\n${deepLink}`
  );
}

/**
 * <backend origin>/@<handle>. Exported so callers that only need the URL
 * (e.g. a Website button) don't build a full StoreShare just to read one
 * field.
 */
export function storeWebUrl(handle: string): string {
  return `${WEB_BASE}/@${encodeURIComponent(handle.trim())}`;
}

export function buildStoreShare(id: string, handle: string, name: string): StoreShare {
  const safeId = encodeURIComponent(id.trim());
  const deepLink = `${DEEP_SCHEME}/${safeId}`;
  const url = storeWebUrl(handle);
  return { id, handle, name, deepLink, url, message: shareMessage(name, deepLink, url) };
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
