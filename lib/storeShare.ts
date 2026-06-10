// ============================================================
// STORE SHARE — public shareable identity for a storefront so a customer can
// share a store and others can scan/open + follow it. §30 growth loop.
// Frontend-first: links derived from the store id; BE swap = real slug + short
// link. parseStoreId() decodes a scanned QR / opened deep link back to an id.
// ============================================================

const SHARE_BASE = "https://apana.app/s"; // public web fallback (future universal link)
const DEEP_SCHEME = "apanastore://s"; // matches app.json scheme

export interface StoreShare {
  id: string;
  name: string;
  url: string; // shareable https link (WhatsApp-friendly)
  deepLink: string; // apanastore://s/<id> for the installed app
  message: string; // pre-filled share / WhatsApp text (EN + HI)
}

function shareMessage(name: string, url: string): string {
  return (
    `Check out ${name} on Apana — order from this local shop for delivery.\n` +
    `${name} को Apana पर देखें — इस लोकल दुकान से डिलीवरी मँगाएँ।\n\n${url}`
  );
}

export function buildStoreShare(id: string, name: string): StoreShare {
  const safe = encodeURIComponent(id.trim());
  const url = `${SHARE_BASE}/${safe}`;
  return {
    id,
    name,
    url,
    deepLink: `${DEEP_SCHEME}/${safe}`,
    message: shareMessage(name, url),
  };
}

// Extract a store id from a scanned QR value / opened deep link, else null.
// Accepts apanastore://s/<id>, apana://s/<id>, or *apana.app/s/<id>.
export function parseStoreId(value: string | null | undefined): string | null {
  if (!value) return null;
  const m = value
    .trim()
    .match(/(?:apanastore:\/\/s\/|apana:\/\/s\/|apana\.app\/s\/)([A-Za-z0-9._-]+)/i);
  return m ? decodeURIComponent(m[1]) : null;
}
