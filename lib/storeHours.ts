// ============================================================
// storeHours — a shop's own weekly hours (GET /customer/stores/:id
// business_hours) → the rows StoreHoursCard draws.
//
// Before this, a real shop's page showed no weekly hours at all (the only
// table available was the bundled demo store's Mon-Sun 8-9). null in ⇒ null
// out: a shop that never set hours is open whenever it is online, so a table
// of invented times — or of "Closed" — would both be false.
// ============================================================

import { DAY_NAMES, StoreHours } from "../data/storeDetailData";

export interface BusinessHours {
  open: string;   // "HH:MM", 24h
  close: string;
  closed_days?: number[];          // 0 = Sunday … 6 = Saturday
  is_24_hours?: boolean;
  break?: { start: string; end: string } | null;
}

/** "09:00" → "9:00 AM", "21:30" → "9:30 PM", "00:00" → "12:00 AM". */
export function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Monday-first rows, the order people read a week in. */
export function weeklyHours(bh: BusinessHours | null | undefined): StoreHours[] | null {
  if (!bh) return null;
  const closed = new Set(bh.closed_days ?? []);
  const order = [1, 2, 3, 4, 5, 6, 0];
  return order.map((d) => {
    const day = DAY_NAMES[d];
    if (closed.has(d)) return { day, open: "Closed", close: "" };
    if (bh.is_24_hours) return { day, open: "Open 24 hours", close: "" };
    if (bh.break) {
      // One line for a split day: a shop shut 2-4 PM is genuinely closed then.
      return {
        day,
        open: `${to12h(bh.open)} – ${to12h(bh.break.start)}, ${to12h(bh.break.end)} – ${to12h(bh.close)}`,
        close: "",
      };
    }
    return { day, open: to12h(bh.open), close: to12h(bh.close) };
  });
}
