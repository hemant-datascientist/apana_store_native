// bun run lib/cartLimit.check.ts
import { limitCartLine } from "./cartLimit";

let fails = 0;
const ok = (c: boolean, m: string) => { if (!c) { fails++; console.error("FAIL", m); } else console.log("ok  ", m); };
const item = (id: string, productId: string, variantId: string | null, qty: number) =>
  ({ id, productId, variantId, qty, maxQty: 99, name: id, price: 1 }) as never;
const cart = [
  { id: "shopA", items: [item("tee-L", "tee", "L", 3), item("tee-M", "tee", "M", 2)] },
  { id: "shopB", items: [item("soap", "soap", null, 4)] },
] as never;

let out = limitCartLine(cart, "tee", "L", 1);
const a = (out as any)[0].items;
ok(a.find((i: any) => i.id === "tee-L").qty === 1, "only 1 Large left: Large becomes 1");
ok(a.find((i: any) => i.id === "tee-L").maxQty === 1, "…and its stepper is capped at 1");
ok(a.find((i: any) => i.id === "tee-M").qty === 2, "…the Medium beside it is untouched");

out = limitCartLine(cart, "soap", null, 0);
ok((out as any).length === 1 && (out as any)[0].id === "shopA", "sold out: the line goes, and its now-empty shop too");

out = limitCartLine(cart, "soap", null, 9);
ok((out as any)[1].items[0].qty === 4, "more left than wanted: the quantity stays");

if (fails) { console.error(`${fails} failed`); process.exit(1); }
console.log("cartLimit: all passed");
