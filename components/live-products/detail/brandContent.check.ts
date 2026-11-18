// bun run components/live-products/detail/brandContent.check.ts
// The three "brand content" sections must show what the brand entered and
// NOTHING when it entered nothing. A category guess here printed "FSSAI
// Certified", a veg mark and "5000 mAh" on products that never claimed them.
import { brandBentoLines, brandFAQs, brandReasons } from "./brandContent";

let fail = 0;
const ok = (what: string, cond: boolean) => { if (!cond) fail++; console.log(`${cond ? "ok  " : "FAIL"} ${what}`); };

// A food product with no brand content: every section empty.
const food = { net_weight_g: 500 };
ok("no reasons entered -> no reasons", brandReasons(food).length === 0);
ok("no FAQs entered -> no FAQs", brandFAQs(food).length === 0);
ok("no bento entered -> no cards", brandBentoLines(food).length === 0);
ok("no attributes at all -> nothing", brandReasons().length + brandFAQs().length + brandBentoLines().length === 0);

// What the brand entered comes back as written.
const r = brandReasons({ top_reasons_to_buy: "1. Cold pressed\n2) Glass bottle" });
ok("reasons keep the brand's text, numbering stripped", r.length === 2 && r[0].title === "Cold pressed" && r[1].title === "Glass bottle");
ok("an array item with no title is dropped, not renamed 'Reason N'",
  brandReasons({ top_reasons_to_buy: [{ title: "" }, "Real one"] }).map((x) => x.title).join("|") === "Real one");

const f = brandFAQs({ faqs: "Q: Is it vegan?\nA: Yes.\n\nQ: Shelf life?\nA: 9 months." });
ok("FAQs parse Q/A blocks", f.length === 2 && f[1].answer === "9 months.");
ok("FAQ badge does not claim verification", f.every((x) => x.badge === "From the brand"));
ok("a question with no answer is not shown", brandFAQs({ faqs: "Q: Warranty?" }).length === 0);

const b = brandBentoLines({ bento_showcase: "Card 1: A2 milk\nCard 2: Grass fed\n\n" });
ok("bento: one card per line, 'Card N:' stripped", b.join("|") === "A2 milk|Grass fed");

console.log(fail ? `${fail} FAILED` : "brandContent: all passed");
process.exit(fail ? 1 : 0);
