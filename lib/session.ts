// ============================================================
// SESSION — is the stored token still worth anything?
//
// 🔴 Every app decided "this person is signed in" by checking that a token
// STRING existed in storage. A token has a fixed lifetime and there is no
// refresh flow (/auth/refresh is still a stub), so once it lapsed the string
// was still a perfectly good string — the launch gate read it, routed the user
// into the app as a returning user, and every request then failed with 401.
// No screen offered a way back to sign-in.
//
// From the shop counter that looks exactly like "I can't log in": they are
// never shown the login screen at all. Reading `exp` here turns a dead session
// into a normal sign-in instead of a broken app.
//
// This does NOT verify the signature — it cannot, the secret is server-side,
// and it must not try. The server is the only thing that decides whether a
// token is genuine. This is purely "don't bother sending one that is already
// past its own expiry", which is a UX decision, not a security check.
// ============================================================

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// Hand-rolled rather than atob(): atob's availability varies across the Hermes
// versions these three apps run on, and a missing global here would not fail
// loudly — it would throw on every launch and lock everyone out of their own
// shop. Eight lines is cheaper than that risk.
function decodeBase64Url(input: string): string {
  const s = input.replace(/-/g, "+").replace(/_/g, "/");
  let out = "";
  let buffer = 0;
  let bits = 0;
  for (const ch of s) {
    if (ch === "=") break;
    const v = B64.indexOf(ch);
    if (v === -1) continue; // skip anything that is not base64 (newlines etc.)
    buffer = (buffer << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }
  return out;
}

/**
 * Seconds remaining on a JWT, or null when the token cannot be read.
 * Null is NOT "expired" — see isSessionUsable for why that distinction matters.
 */
export function secondsUntilExpiry(token: string | null | undefined): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3 || !parts[1]) return null;
  try {
    const claims = JSON.parse(decodeBase64Url(parts[1])) as { exp?: unknown };
    if (typeof claims.exp !== "number") return null;
    return claims.exp - Math.floor(Date.now() / 1000);
  } catch {
    return null;
  }
}

/**
 * Should the app treat this stored token as a live session?
 *
 * A token we cannot parse is treated as USABLE, deliberately. The server is the
 * real authority and will 401 it a moment later; guessing "expired" here would
 * mean that any future change to the token format silently signs out every
 * user on every device, which is a far worse failure than one wasted request.
 *
 * The 60-second skew guard stops a token that expires mid-launch from routing
 * someone into the app one second before it dies.
 */
export function isSessionUsable(token: string | null | undefined): boolean {
  if (!token) return false;
  // A string that is not even three dot-separated parts is not a JWT and never
  // will be — no future format change makes it one. That is a different fact
  // from "a JWT whose exp we could not read", which is the case the rule above
  // is about, so it is refused outright rather than sent to the server.
  if (token.split(".").length !== 3) return false;
  const left = secondsUntilExpiry(token);
  if (left === null) return true;
  return left > 60;
}
