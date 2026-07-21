// ============================================================
// Slot generation for service booking.
//
// The seller's own opening-hours/slot settings are not on the backend yet
// (SlotSettingsModal in the seller app is still local-only), so the app does
// NOT pretend to know a shop's real availability. It offers a plain daytime
// window as a REQUEST, and the booking lands as `pending` until the shop
// confirms — which is exactly what the §16.11 status machine is for.
//
// Two rules that are not cosmetic:
//   - never offer a slot in the past (the backend rejects it with a 422, so
//     showing it would be a guaranteed error the customer walks into)
//   - step by the offering's own duration when it has one, so two bookings
//     the shop cannot physically serve back-to-back aren't suggested
// ============================================================

const DAY_MS = 24 * 60 * 60 * 1000;
const OPEN_HOUR = 9;
const CLOSE_HOUR = 20; // last slot starts before this
const DEFAULT_STEP_MIN = 30;
const DAYS_AHEAD = 7;

export interface SlotDay {
  date: Date; // local midnight
  label: string; // "Today" | "Tomorrow" | "Wed 23"
  slots: Date[];
}

function dayLabel(d: Date, today: Date): string {
  const diff = Math.round((startOfDay(d).getTime() - startOfDay(today).getTime()) / DAY_MS);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" });
}

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export function formatSlotTime(d: Date): string {
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

// Days that still have at least one bookable slot. A day with none is dropped
// entirely rather than shown empty — an empty day is not a choice.
export function buildSlotDays(durationMin: number | null, now = new Date()): SlotDay[] {
  const step = durationMin && durationMin > 0 ? durationMin : DEFAULT_STEP_MIN;
  const days: SlotDay[] = [];

  for (let i = 0; i < DAYS_AHEAD; i++) {
    const day = startOfDay(new Date(now.getTime() + i * DAY_MS));
    const slots: Date[] = [];

    for (let min = OPEN_HOUR * 60; min < CLOSE_HOUR * 60; min += step) {
      const slot = new Date(day);
      slot.setHours(Math.floor(min / 60), min % 60, 0, 0);
      // A slot must be far enough out that the shop can actually see it.
      if (slot.getTime() <= now.getTime() + 30 * 60 * 1000) continue;
      slots.push(slot);
    }

    if (slots.length > 0) days.push({ date: day, label: dayLabel(day, now), slots });
  }

  return days;
}
