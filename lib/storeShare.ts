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
// ============================================================

const DEEP_SCHEME = "apanastore://s"; // matches app.json scheme

export interface StoreShare {
  id: string;
  name: string;
  /**
   * apanastore://s/<id> — opens this store in the Apana app.
   *
   * ⚠ NOT an https URL. WhatsApp and most chat apps only turn http(s) into a
   * tappable link, so this travels as plain text there; the QR is the path
   * that actually works today. A `url` comes back the day public store pages
   * exist, and callers pick it up.
   */
  deepLink: string;
  message: string; // pre-filled share / WhatsApp text (EN + HI)
}

// Names the app requirement rather than carrying a link that resolves for
// nobody — a message promising a page that does not exist makes the SHOP look
// broken to whoever it was forwarded to.
function shareMessage(name: string, deepLink: string): string {
  return (
    `Check out ${name} on Apana — order from this local shop for delivery.\n` +
    `${name} को Apana पर देखें — इस लोकल दुकान से डिलीवरी मँगाएँ।\n\n` +
    `Open in the Apana app:\n${deepLink}`
  );
}

export function buildStoreShare(id: string, name: string): StoreShare {
  const safe = encodeURIComponent(id.trim());
  const deepLink = `${DEEP_SCHEME}/${safe}`;
  return { id, name, deepLink, message: shareMessage(name, deepLink) };
}

// Extract a store id from a scanned QR value / opened deep link, else null.
// Accepts apanastore://s/<id>, apana://s/<id>, or *apana.app/s/<id> — the last
// one for codes already printed before the domain was dropped (see header).
export function parseStoreId(value: string | null | undefined): string | null {
  if (!value) return null;
  const m = value
    .trim()
    .match(/(?:apanastore:\/\/s\/|apana:\/\/s\/|apana\.app\/s\/)([A-Za-z0-9._-]+)/i);
  return m ? decodeURIComponent(m[1]) : null;
}
