// ============================================================
// STORE ADDRESS — compose the shop's address from the parts that exist.
//
// A shop address arrives in pieces and any piece can be absent: a kirana in a
// market row genuinely has no shop number, a pin may not have resolved yet, and
// a store registered before migration 0051 has none of it at all.
//
// The card used to join them unconditionally —
//   `${address}, ${city}, ${state} – ${pincode}`
// — which prints ", , – " for a shop that has none of them, and a dangling
// dash for one that merely lacks a pincode. Worse, before the seller app could
// save an address those values came from the BUNDLED SAMPLE, so a real shop's
// page showed a demo store's street.
//
// `door` leads, because it is the part a customer collecting a self-pickup
// order actually navigates by, and the part no map lookup can supply.
// ============================================================

export interface StoreAddressParts {
  door?: string | null;
  address?: string | null;
  landmark?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
}

const clean = (v?: string | null): string => (typeof v === "string" ? v.trim() : "");

/**
 * A one-line address, or "" when nothing is known.
 *
 * Returns an EMPTY STRING rather than a placeholder: the caller decides whether
 * to hide the row or say "address not added yet". Inventing "Address not
 * available" here would put those words on a storefront as though the shop had
 * written them.
 */
export function formatStoreAddress(parts: StoreAddressParts): string {
  const door = clean(parts.door);
  const street = clean(parts.address);
  const city = clean(parts.city);
  const state = clean(parts.state);
  const pincode = clean(parts.pincode);

  // Mappls returns a full formatted string that usually ALREADY ends
  // "…, Pune, Maharashtra. Pin-411030 (India)". Appending city/state/pincode
  // to that prints each of them twice — the same de-duplication the rider's
  // card needed (see formatDrop in the delivery task bridge).
  const out: string[] = [];
  const push = (v: string) => {
    if (!v) return;
    const sofar = out.join(", ").toLowerCase();
    if (sofar.includes(v.toLowerCase())) return;
    out.push(v);
  };

  push(door);
  push(street);
  push(city);
  push(state);

  const line = out.join(", ");
  // The pincode joins with an en dash only when there is something to attach
  // it to; alone, it is just the number.
  if (pincode && !line.toLowerCase().includes(pincode.toLowerCase())) {
    return line ? `${line} – ${pincode}` : pincode;
  }
  return line;
}

/** The landmark, phrased as a shopkeeper would. "" when there is none. */
export function formatLandmark(parts: StoreAddressParts): string {
  const l = clean(parts.landmark);
  return l ? `Near ${l}` : "";
}
