// ============================================================
// friendlyError — what to tell a person when a request fails.
//
// A server refusal is written for a person ("Too many codes, try in 10 min")
// and is shown as-is. A transport failure arrives as a TypeError or as the
// platform's own text ("java.net.ConnectException", "CLEARTEXT communication
// … not permitted") — meaningless to a shopper, so it becomes one plain line.
// ============================================================

const TRANSPORT = /java\.|exception|cleartext|network request failed|failed to connect|timeout|timed out|unable to resolve host|abort/i;

export function friendlyError(e: unknown): string {
  if (e instanceof TypeError) return "Can't reach Apana. Check your internet and try again.";
  const msg = e instanceof Error ? e.message : "";
  if (!msg || TRANSPORT.test(msg) || (e as Error)?.name === "AbortError") {
    return "Can't reach Apana. Check your internet and try again.";
  }
  return msg;
}
