// bun run lib/storeHours.check.ts
import { to12h, weeklyHours } from "./storeHours";

let fail = 0;
function eq(got: unknown, want: unknown, what: string) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fail++;
  console.log(`${ok ? "ok  " : "FAIL"} ${what}${ok ? "" : ` — want ${JSON.stringify(want)} got ${JSON.stringify(got)}`}`);
}

eq(to12h("09:00"), "9:00 AM", "morning");
eq(to12h("21:30"), "9:30 PM", "evening");
eq(to12h("00:00"), "12:00 AM", "midnight is 12 AM, not 0");
eq(to12h("12:05"), "12:05 PM", "noon is 12 PM");

// Never set ⇒ no table: that shop is open whenever it is online.
eq(weeklyHours(null), null, "no hours set ⇒ no table, never invented times");

const plain = weeklyHours({ open: "09:00", close: "21:00", closed_days: [0] })!;
eq(plain.length, 7, "all seven days");
eq(plain[0], { day: "Monday", open: "9:00 AM", close: "9:00 PM" }, "Monday first");
eq(plain[6], { day: "Sunday", open: "Closed", close: "" }, "weekly off shows Closed");

const split = weeklyHours({ open: "09:00", close: "21:00", break: { start: "14:00", end: "16:00" } })!;
eq(split[2].open, "9:00 AM – 2:00 PM, 4:00 PM – 9:00 PM", "afternoon break splits the day");

const allDay = weeklyHours({ open: "00:00", close: "00:00", is_24_hours: true, closed_days: [3] })!;
eq(allDay[0].open, "Open 24 hours", "24/7 shop");
eq(allDay[2].open, "Closed", "a closed day beats 24 hours");

// Night shop: close before open on the clock is still one shift.
eq(weeklyHours({ open: "22:00", close: "02:00" })![0], { day: "Monday", open: "10:00 PM", close: "2:00 AM" }, "night shift past midnight");

if (fail) { console.log(`${fail} failed`); process.exit(1); }
console.log("storeHours: all passed");
