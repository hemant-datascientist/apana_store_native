// ============================================================
// INVOICE DATA — Apana Store (Customer App)
//
// Full GST invoice interfaces + mock data matching the
// standard Indian retail invoice format (CGST + SGST + CSEE).
//
// Backend: GET /orders/:id/invoice → Invoice
// ============================================================

// ── Line item on the invoice ──────────────────────────────
export interface InvoiceItem {
  id:          string;
  name:        string;    // product name (can be multi-line)
  qty:         number;    // pieces
  mrp:         number;    // maximum retail price per unit
  rate:        number;    // actual selling rate per unit
  amount:      number;    // qty × rate
  gstPercent:  number;    // 0 | 5 | 12 | 18 | 28
}

// ── GST breakup row (one per GST slab) ───────────────────
export interface GSTBreakupRow {
  gstPercent:   number;
  taxableValue: number;   // pre-tax value
  cgst:         number;   // Central GST
  sgst:         number;   // State GST
  csee:         number;   // Cess (usually 0 for grocery/electronics)
  netAmt:       number;   // taxableValue + cgst + sgst + csee
}

// ── Payment breakdown ─────────────────────────────────────
export interface InvoicePayment {
  cashReceived: number;
  cashReturn:   number;
  billAmount:   number;
  cardAmount:   number;
  upiAmount:    number;
}

// ── Full invoice ──────────────────────────────────────────
export interface Invoice {
  // Identity — storeOrderId links to a specific store's sub-order
  storeOrderId:   string;   // e.g. "APX-...-S1" — unique per store
  masterOrderId:  string;   // master order grouping all stores
  // Store info
  storeName:      string;
  storeLogo:      string;   // Ionicons glyph placeholder
  storeLogoColor: string;
  storeAddress:   string;
  storeCity:      string;
  storeState:     string;
  storePincode:   string;
  gstNo:          string;
  fssaiNo:        string;   // empty string if N/A
  customerCare:   string;
  // Bill meta
  billNo:         string;
  cashierName:    string;
  placedAt:       string;   // ISO date string
  counter:        string;   // "POS-1" | "COUNTER-2" | "Online" etc.
  // Items
  items:          InvoiceItem[];
  totalUniqueItems: number;
  totalQty:       number;
  // Totals
  amountInMRP:    number;
  otherCharges:   number;
  netAmount:      number;
  // Payment
  payment:        InvoicePayment;
  // Savings
  savedAmount:    number;
  savedPercent:   number;
  // GST breakup
  gstBreakup:     GSTBreakupRow[];
  netTaxableValue:number;
  netCGST:        number;
  netSGST:        number;
  netCSEE:        number;
  // Footer
  thankYouNote:   string;
}

// ── Helper: look up invoice by storeOrderId or billNo ────
// storeOrderId is the per-store sub-order ID (preferred for pickup).
// billNo is the human-readable invoice number (fallback / legacy).
export function getInvoiceByOrderId(id: string): Invoice {
  return (
    MOCK_INVOICES.find(inv => inv.storeOrderId === id) ??
    MOCK_INVOICES.find(inv => inv.billNo        === id) ??
    MOCK_INVOICES[0]
  );
}

// ── Helper: format date for display ──────────────────────
export function formatInvoiceDate(iso: string): string {
  const d = new Date(iso);
  const dd   = String(d.getDate()).padStart(2, "0");
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const yy   = String(d.getFullYear()).slice(2);
  const hh   = String(d.getHours()).padStart(2, "0");
  const min  = String(d.getMinutes()).padStart(2, "0");
  const ss   = String(d.getSeconds()).padStart(2, "0");
  const ampm = d.getHours() < 12 ? "AM" : "PM";
  return `${dd}/${mm}/${yy}  ${hh}:${min}:${ss} ${ampm}`;
}

// ── Mock invoices ─────────────────────────────────────────
export const MOCK_INVOICES: Invoice[] = [

  // ── INV-001: Sharma General Store (Grocery + Electronics) ─
  {
    storeOrderId:   "APX-MOCK-S1",
    masterOrderId:  "APX-MOCK",
    storeName:      "Sharma General Store",
    storeLogo:      "storefront-outline",
    storeLogoColor: "#166534",
    storeAddress:   "Shop No. 4, Ganesh Market, MG Road",
    storeCity:      "Pune",
    storeState:     "Maharashtra",
    storePincode:   "411001",
    gstNo:          "27ABCDE1234F1Z5",
    fssaiNo:        "11524031000099",
    customerCare:   "+91 98765 43210",
    billNo:         "APX100123",
    cashierName:    "RAHUL",
    placedAt:       "2026-04-19T14:35:22.000Z",
    counter:        "POS-1",
    items: [
      {
        id:         "i1",
        name:       "TATA SALT IODISED",
        qty:        2,
        mrp:        22.00,
        rate:       20.00,
        amount:     40.00,
        gstPercent: 5,
      },
      {
        id:         "i2",
        name:       "DURACELL AA BATTERY PACK OF 2",
        qty:        1,
        mrp:        120.00,
        rate:       109.00,
        amount:     109.00,
        gstPercent: 18,
      },
      {
        id:         "i3",
        name:       "PARLE-G GLUCOSE BISCUITS 800G",
        qty:        1,
        mrp:        55.00,
        rate:       52.00,
        amount:     52.00,
        gstPercent: 12,
      },
      {
        id:         "i4",
        name:       "AMUL PURE GHEE 500ML",
        qty:        1,
        mrp:        310.00,
        rate:       295.00,
        amount:     295.00,
        gstPercent: 12,
      },
      {
        id:         "i5",
        name:       "SURF EXCEL EASY WASH 1KG",
        qty:        1,
        mrp:        199.00,
        rate:       185.00,
        amount:     185.00,
        gstPercent: 18,
      },
    ],
    totalUniqueItems: 5,
    totalQty:         6,
    amountInMRP:      706.00,
    otherCharges:     0.00,
    netAmount:        681.00,
    payment: {
      cashReceived: 700.00,
      cashReturn:   19.00,
      billAmount:   681.00,
      cardAmount:   0.00,
      upiAmount:    0.00,
    },
    savedAmount:    25.00,
    savedPercent:   3.54,
    gstBreakup: [
      { gstPercent: 5,  taxableValue: 38.10, cgst: 0.95, sgst: 0.95, csee: 0.00, netAmt: 40.00  },
      { gstPercent: 12, taxableValue: 310.36, cgst: 18.62, sgst: 18.62, csee: 0.00, netAmt: 347.00 },
      { gstPercent: 18, taxableValue: 249.58, cgst: 26.54, sgst: 26.54, csee: 0.00, netAmt: 294.00 },
    ],
    netTaxableValue: 598.04,
    netCGST:         46.11,
    netSGST:         46.11,
    netCSEE:         0.00,
    thankYouNote:    "Thank You for Shopping with Apana Store!\nVisit Again — Curated Precision.",
  },

  // ── INV-002: TechZone Electronics ─────────────────────────
  {
    storeOrderId:   "APX-MOCK-S2",
    masterOrderId:  "APX-MOCK",
    storeName:      "TechZone Electronics",
    storeLogo:      "hardware-chip-outline",
    storeLogoColor: "#1E3A5F",
    storeAddress:   "Ground Floor, Nucleus Mall, FC Road",
    storeCity:      "Pune",
    storeState:     "Maharashtra",
    storePincode:   "411004",
    gstNo:          "27FGHIJ5678K2Z9",
    fssaiNo:        "",
    customerCare:   "+91 90000 11223",
    billNo:         "APX100124",
    cashierName:    "PRIYA",
    placedAt:       "2026-04-19T11:10:05.000Z",
    counter:        "Online",
    items: [
      {
        id:         "j1",
        name:       "BOULT AUDIO BASSBUDS X1 EARBUDS",
        qty:        1,
        mrp:        1999.00,
        rate:       1299.00,
        amount:     1299.00,
        gstPercent: 18,
      },
      {
        id:         "j2",
        name:       "ANKER USB-C FAST CHARGING CABLE 1M",
        qty:        2,
        mrp:        499.00,
        rate:       399.00,
        amount:     798.00,
        gstPercent: 18,
      },
    ],
    totalUniqueItems: 2,
    totalQty:         3,
    amountInMRP:      2997.00,
    otherCharges:     0.00,
    netAmount:        2097.00,
    payment: {
      cashReceived: 0.00,
      cashReturn:   0.00,
      billAmount:   2097.00,
      cardAmount:   0.00,
      upiAmount:    2097.00,
    },
    savedAmount:    900.00,
    savedPercent:   30.03,
    gstBreakup: [
      { gstPercent: 18, taxableValue: 1776.27, cgst: 160.37, sgst: 160.37, csee: 0.00, netAmt: 2097.00 },
    ],
    netTaxableValue: 1776.27,
    netCGST:         160.37,
    netSGST:         160.37,
    netCSEE:         0.00,
    thankYouNote:    "Thank You for Choosing TechZone!\nFor warranty & support call our helpline.",
  },
];
