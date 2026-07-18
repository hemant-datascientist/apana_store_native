// ============================================================
// buildTabs — turn a ProductDetail into the ordered TabDef[] the tab bar
// renders. Only tabs with data appear. GTIN-scrape tabs (rawTabs) are shown
// verbatim except the ones the synthesized Company tab already covers.
// ============================================================

import { Ionicons } from "@expo/vector-icons";
import type { ProductDetail } from "../../../services/liveCatalogService";
import type { TabDef, KVRow } from "./DetailTabs";

type IoniconName = keyof typeof Ionicons.glyphMap;

// rawTabs labels folded into the synthesized Company tab — don't repeat them.
const COMPANY_COVERED = new Set(["Company Details", "Customer Care"]);

function iconForLabel(label: string): IoniconName {
  const l = label.toLowerCase();
  if (l.includes("regulat")) return "shield-checkmark-outline";
  if (l.includes("nutri")) return "nutrition-outline";
  if (l.includes("ingredient")) return "leaf-outline";
  if (l.includes("product")) return "reader-outline";
  return "information-circle-outline";
}

function push(rows: KVRow[], k: string, v: string | null | undefined) {
  if (v != null && String(v).trim() !== "") rows.push({ k, v: String(v) });
}

export function buildTabs(detail: ProductDetail): TabDef[] {
  const { product, enrichment, stores } = detail;
  const tabs: TabDef[] = [];

  // 1 · Details — core identity fields.
  const details: KVRow[] = [];
  push(details, "Brand", product.brand);
  push(details, "GTIN", enrichment?.gtin ?? null);
  push(details, "Category", product.category);
  push(details, "Sub Category", product.subCategory);
  push(details, "Product Country", enrichment?.country ?? null);
  push(details, "Net Content", enrichment?.netContent ?? null);
  push(details, "Packaging", enrichment?.packagingType ?? null);
  push(details, "Shelf Life", enrichment?.shelfLife ?? null);
  if (details.length > 0) {
    tabs.push({ key: "details", label: "Details", icon: "document-text-outline", kind: "kv", rows: details });
  }

  // 2 · Availability — every stocking store.
  tabs.push({ key: "availability", label: "Availability", icon: "storefront-outline", kind: "stores", stores });

  // 3 · MRP.
  const mrp = enrichment?.mrp ?? product.mrp ?? null;
  if (mrp != null) {
    tabs.push({
      key: "mrp",
      label: "MRP",
      icon: "pricetag-outline",
      kind: "kv",
      rows: [{ k: "MRP", v: `₹ ${mrp % 1 === 0 ? mrp.toFixed(0) : mrp.toFixed(2)}` }],
    });
  }

  // 4 · Company — name/address + customer care.
  if (enrichment) {
    const co: KVRow[] = [];
    push(co, "Company", enrichment.company.name);
    push(co, "Address", enrichment.company.address);
    if (enrichment.customerCare) {
      push(co, "Care Contact", enrichment.customerCare.contactPerson);
      push(co, "Care Phone", enrichment.customerCare.phone);
      push(co, "Care Email", enrichment.customerCare.email);
    }
    if (co.length > 0) {
      tabs.push({ key: "company", label: "Company Details", icon: "business-outline", kind: "kv", rows: co });
    }
  }

  // 5 · Remaining GTIN-scrape tabs verbatim (Regulatory, Other, Product Info…).
  if (enrichment) {
    for (const [label, kv] of Object.entries(enrichment.tabs)) {
      if (COMPANY_COVERED.has(label)) continue;
      const rows: KVRow[] = Object.entries(kv).map(([k, v]) => ({ k, v: String(v) }));
      if (rows.length === 0) continue;
      tabs.push({ key: `tab-${label}`, label, icon: iconForLabel(label), kind: "kv", rows });
    }
  }

  return tabs;
}
