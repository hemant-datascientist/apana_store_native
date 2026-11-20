// One way to print rupees. Whole amounts as "₹1,234"; anything with paise always shows two
// digits ("₹25.90", never "₹25.9"), and a total is never rounded away from what is charged.
const IN = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
const IN2 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

export function rupees(amount: number): string {
  const r = Math.round(amount * 100) / 100;
  return `₹${Number.isInteger(r) ? IN.format(r) : IN2.format(r)}`;
}
