// ============================================================
// brandContent — the brand-entered merchandising text on a product
// (registry nutrition JSON: top_reasons_to_buy · bento_showcase · faqs).
//
// Pure, no React Native, so brandContent.check.ts can run under bun.
// Rule: return what the brand wrote, or nothing. Never a category guess.
// ============================================================

export interface BrandReason {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export interface BrandFAQ {
  id: string;
  question: string;
  answer: string;
  badge?: string;
}

export function brandReasons(attributes?: Record<string, unknown>): BrandReason[] {
  // 1. If explicit top_reasons_to_buy or topReasonsToBuy string/array exists:
  const raw = (attributes?.top_reasons_to_buy ?? attributes?.topReasonsToBuy) as unknown;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw
      .map((item, idx) => ({
        id: `custom-${idx}`,
        title: typeof item === "string" ? item : String(item?.title ?? ""),
        subtitle: typeof item === "object" ? item?.subtitle : undefined,
        imageUrl: typeof item === "object" ? item?.imageUrl : undefined,
      }))
      .filter((r) => r.title.trim().length > 0);
  }
  if (typeof raw === "string" && raw.trim().length > 0) {
    const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      return lines.slice(0, 9).map((line, idx) => ({
        id: `line-${idx}`,
        title: line.replace(/^\d+[\.\)]\s*/, ""),
      }));
    }
  }

  // Nothing entered = nothing shown. A category guess here would print
  // claims (FSSAI, veg mark, battery size, returns) the product never made.
  return [];
}

export function brandFAQs(attributes?: Record<string, unknown>): BrandFAQ[] {
  // 1. Check if brand entered custom FAQs in attributes
  const rawFaqs = (attributes?.faqs ?? attributes?.frequently_asked_questions) as unknown;
  if (typeof rawFaqs === "string" && rawFaqs.trim().length > 0) {
    const blocks = rawFaqs.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
    const parsed: BrandFAQ[] = [];

    for (let i = 0; i < blocks.length; i++) {
      const lines = blocks[i].split("\n").map((l) => l.trim()).filter(Boolean);
      let q = "";
      let a = "";
      for (const line of lines) {
        if (/^Q(?:uestion)?\s*[:\.]\s*/i.test(line)) {
          q = line.replace(/^Q(?:uestion)?\s*[:\.]\s*/i, "");
        } else if (/^A(?:nswer)?\s*[:\.]\s*/i.test(line)) {
          a = line.replace(/^A(?:nswer)?\s*[:\.]\s*/i, "");
        } else if (!q) {
          q = line;
        } else {
          a += (a ? " " : "") + line;
        }
      }
      if (q && a) {
        parsed.push({
          id: `custom-faq-${i}`,
          question: q,
          answer: a,
          badge: "From the brand",
        });
      }
    }

    if (parsed.length > 0) {
      return parsed;
    }
  }

  // Nothing entered = nothing shown. Invented answers about warranty,
  // what is in the box or FSSAI status would be claims nobody made.
  return [];
}

const MAX_CARDS = 6;

export function brandBentoLines(attributes?: Record<string, unknown>): string[] {
  const raw = attributes?.bento_showcase ?? attributes?.bentoShowcase;
  if (typeof raw !== "string") return [];
  return raw
    .split("\n")
    .map((l) => l.replace(/^card\s*\d+\s*[:.\-)]\s*/i, "").trim())
    .filter(Boolean)
    .slice(0, MAX_CARDS);
}
