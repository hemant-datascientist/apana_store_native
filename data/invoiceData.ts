// ============================================================
// INVOICE DATA — Apana Store (Customer App)
//
// Full GST invoice interfaces + mock data matching the
// standard Indian retail invoice format (CGST + SGST + CSEE).
//
// Mock invoices cover all 5 standard stores (s1–s5) so the
// invoice screen shows the correct store name in every mode.
//
// Backend: GET /api/orders/invoice?storeOrderId=<id>
//          GET /api/orders/invoice?orderId=<id>
// ============================================================

// ── Line item on the invoice ──────────────────────────────
export interface InvoiceItem {
  id:          string;
  name:        string;
  qty:         number;
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
  csee:         number;   // Cess (0 for most categories)
  netAmt:       number;
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
  // Identity
  storeId:        string;   // "s1" – "s5" — used by fetchInvoice stub for lookup
  storeOrderId:   string;   // per-store sub-order ID (pickup)
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
  fssaiNo:        string;
  customerCare:   string;
  // Bill meta
  billNo:         string;
  cashierName:    string;
  placedAt:       string;   // ISO date string
  counter:        string;
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

// ── Look up by storeId (preferred — accurate store name) ──
export function getInvoiceByStoreId(storeId: string): Invoice {
  return (
    MOCK_INVOICES.find(inv => inv.storeId === storeId) ??
    MOCK_INVOICES[0]
  );
}

// ── Look up by storeOrderId or billNo (legacy / order-history) ─
export function getInvoiceByOrderId(id: string): Invoice {
  return (
    MOCK_INVOICES.find(inv => inv.storeOrderId === id) ??
    MOCK_INVOICES.find(inv => inv.billNo        === id) ??
    MOCK_INVOICES[0]
  );
}

// ── Helper: format date for display ──────────────────────
export function formatInvoiceDate(iso: string): string {
  const d    = new Date(iso);
  const dd   = String(d.getDate()).padStart(2, "0");
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const yy   = String(d.getFullYear()).slice(2);
  const hh   = String(d.getHours()).padStart(2, "0");
  const min  = String(d.getMinutes()).padStart(2, "0");
  const ss   = String(d.getSeconds()).padStart(2, "0");
  const ampm = d.getHours() < 12 ? "AM" : "PM";
  return `${dd}/${mm}/${yy}  ${hh}:${min}:${ss} ${ampm}`;
}

// ── Mock invoices — one per store (s1–s5) ─────────────────
export const MOCK_INVOICES: Invoice[] = [

  // ── s1: Sharma General Store (Grocery) ───────────────────
  {
    storeId:        "s1",
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
      { id: "i1", name: "TATA SALT IODISED",          qty: 2, mrp: 22.00,  rate: 20.00,  amount: 40.00,  gstPercent: 5  },
      { id: "i2", name: "DURACELL AA BATTERY PACK 2",  qty: 1, mrp: 120.00, rate: 109.00, amount: 109.00, gstPercent: 18 },
      { id: "i3", name: "PARLE-G GLUCOSE BISCUITS 800G",qty: 1, mrp: 55.00,  rate: 52.00,  amount: 52.00,  gstPercent: 12 },
      { id: "i4", name: "AMUL PURE GHEE 500ML",         qty: 1, mrp: 310.00, rate: 295.00, amount: 295.00, gstPercent: 12 },
      { id: "i5", name: "SURF EXCEL EASY WASH 1KG",     qty: 1, mrp: 199.00, rate: 185.00, amount: 185.00, gstPercent: 18 },
    ],
    totalUniqueItems: 5,
    totalQty:         6,
    amountInMRP:      706.00,
    otherCharges:     0.00,
    netAmount:        681.00,
    payment: { cashReceived: 700.00, cashReturn: 19.00, billAmount: 681.00, cardAmount: 0.00, upiAmount: 0.00 },
    savedAmount:    25.00,
    savedPercent:   3.54,
    gstBreakup: [
      { gstPercent: 5,  taxableValue: 38.10,   cgst: 0.95,  sgst: 0.95,  csee: 0.00, netAmt: 40.00  },
      { gstPercent: 12, taxableValue: 310.36,  cgst: 18.62, sgst: 18.62, csee: 0.00, netAmt: 347.00 },
      { gstPercent: 18, taxableValue: 249.58,  cgst: 26.54, sgst: 26.54, csee: 0.00, netAmt: 294.00 },
    ],
    netTaxableValue: 598.04,
    netCGST:         46.11,
    netSGST:         46.11,
    netCSEE:         0.00,
    thankYouNote:    "Thank You for Shopping with Apana Store!\nVisit Again — Curated Precision.",
  },

  // ── s2: TechZone Electronics ──────────────────────────────
  {
    storeId:        "s2",
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
      { id: "j1", name: "BOULT AUDIO BASSBUDS X1 EARBUDS",   qty: 1, mrp: 1999.00, rate: 1299.00, amount: 1299.00, gstPercent: 18 },
      { id: "j2", name: "ANKER USB-C FAST CHARGING CABLE 1M", qty: 2, mrp: 499.00,  rate: 399.00,  amount: 798.00,  gstPercent: 18 },
    ],
    totalUniqueItems: 2,
    totalQty:         3,
    amountInMRP:      2997.00,
    otherCharges:     0.00,
    netAmount:        2097.00,
    payment: { cashReceived: 0.00, cashReturn: 0.00, billAmount: 2097.00, cardAmount: 0.00, upiAmount: 2097.00 },
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

  // ── s3: Gupta Medical Store (Pharmacy) ───────────────────
  {
    storeId:        "s3",
    storeOrderId:   "APX-MOCK-S3",
    masterOrderId:  "APX-MOCK",
    storeName:      "Gupta Medical Store",
    storeLogo:      "medkit-outline",
    storeLogoColor: "#0F5132",
    storeAddress:   "Plot 12, Tilak Road, Near Civil Hospital",
    storeCity:      "Pune",
    storeState:     "Maharashtra",
    storePincode:   "411030",
    gstNo:          "27KLMNO9012P3Z1",
    fssaiNo:        "",
    customerCare:   "+91 97654 32109",
    billNo:         "APX100125",
    cashierName:    "SURESH",
    placedAt:       "2026-04-19T09:45:10.000Z",
    counter:        "Counter-2",
    items: [
      { id: "k1", name: "DOLO 650 PARACETAMOL 15 TABS",     qty: 2, mrp: 32.00,  rate: 30.00,  amount: 60.00,  gstPercent: 12 },
      { id: "k2", name: "VOLINI PAIN RELIEF SPRAY 100G",     qty: 1, mrp: 195.00, rate: 175.00, amount: 175.00, gstPercent: 12 },
      { id: "k3", name: "BAND-AID FLEXIBLE FABRIC 10 STRIPS",qty: 1, mrp: 75.00,  rate: 68.00,  amount: 68.00,  gstPercent: 12 },
    ],
    totalUniqueItems: 3,
    totalQty:         4,
    amountInMRP:      334.00,
    otherCharges:     0.00,
    netAmount:        303.00,
    payment: { cashReceived: 310.00, cashReturn: 7.00, billAmount: 303.00, cardAmount: 0.00, upiAmount: 0.00 },
    savedAmount:    31.00,
    savedPercent:   9.28,
    gstBreakup: [
      { gstPercent: 12, taxableValue: 270.54, cgst: 16.23, sgst: 16.23, csee: 0.00, netAmt: 303.00 },
    ],
    netTaxableValue: 270.54,
    netCGST:         16.23,
    netSGST:         16.23,
    netCSEE:         0.00,
    thankYouNote:    "Stay Healthy! Thank You for Trusting Gupta Medical.\nApana Store — Curated Precision.",
  },

  // ── s4: Style Hub Fashion ─────────────────────────────────
  {
    storeId:        "s4",
    storeOrderId:   "APX-MOCK-S4",
    masterOrderId:  "APX-MOCK",
    storeName:      "Style Hub Fashion",
    storeLogo:      "shirt-outline",
    storeLogoColor: "#6D28D9",
    storeAddress:   "2nd Floor, Mariplex Mall, Viman Nagar",
    storeCity:      "Pune",
    storeState:     "Maharashtra",
    storePincode:   "411014",
    gstNo:          "27PQRST3456U4Z7",
    fssaiNo:        "",
    customerCare:   "+91 88001 22334",
    billNo:         "APX100126",
    cashierName:    "KAVITA",
    placedAt:       "2026-04-19T16:20:00.000Z",
    counter:        "POS-3",
    items: [
      { id: "l1", name: "LEVIS 511 SLIM FIT JEANS NAVY 32",  qty: 1, mrp: 3499.00, rate: 2799.00, amount: 2799.00, gstPercent: 5 },
      { id: "l2", name: "H&M OVERSIZED COTTON TEE WHITE M",  qty: 2, mrp: 799.00,  rate: 649.00,  amount: 1298.00, gstPercent: 5 },
    ],
    totalUniqueItems: 2,
    totalQty:         3,
    amountInMRP:      5097.00,
    otherCharges:     0.00,
    netAmount:        4097.00,
    payment: { cashReceived: 0.00, cashReturn: 0.00, billAmount: 4097.00, cardAmount: 4097.00, upiAmount: 0.00 },
    savedAmount:    1000.00,
    savedPercent:   19.62,
    gstBreakup: [
      { gstPercent: 5, taxableValue: 3902.86, cgst: 97.07, sgst: 97.07, csee: 0.00, netAmt: 4097.00 },
    ],
    netTaxableValue: 3902.86,
    netCGST:         97.07,
    netSGST:         97.07,
    netCSEE:         0.00,
    thankYouNote:    "Thank You for Shopping at Style Hub!\nWear it well — Apana Store, Curated Precision.",
  },

  // ── s5: Fresh Bakes (Food & Drink) ───────────────────────
  {
    storeId:        "s5",
    storeOrderId:   "APX-MOCK-S5",
    masterOrderId:  "APX-MOCK",
    storeName:      "Fresh Bakes",
    storeLogo:      "cafe-outline",
    storeLogoColor: "#92400E",
    storeAddress:   "Shop 7, Baner Road, Near Orchid Hotel",
    storeCity:      "Pune",
    storeState:     "Maharashtra",
    storePincode:   "411045",
    gstNo:          "27UVWXY7890Z5A2",
    fssaiNo:        "21524031000177",
    customerCare:   "+91 77001 88990",
    billNo:         "APX100127",
    cashierName:    "ANITA",
    placedAt:       "2026-04-19T08:15:30.000Z",
    counter:        "Counter-1",
    items: [
      { id: "m1", name: "CROISSANT BUTTER FRESH BAKED",    qty: 3, mrp: 80.00,  rate: 75.00,  amount: 225.00, gstPercent: 5  },
      { id: "m2", name: "COLD BREW COFFEE 250ML",          qty: 2, mrp: 150.00, rate: 130.00, amount: 260.00, gstPercent: 5  },
      { id: "m3", name: "BANANA WALNUT MUFFIN",            qty: 2, mrp: 90.00,  rate: 80.00,  amount: 160.00, gstPercent: 5  },
    ],
    totalUniqueItems: 3,
    totalQty:         7,
    amountInMRP:      970.00,
    otherCharges:     0.00,
    netAmount:        645.00,
    payment: { cashReceived: 0.00, cashReturn: 0.00, billAmount: 645.00, cardAmount: 0.00, upiAmount: 645.00 },
    savedAmount:    325.00,
    savedPercent:   33.51,
    gstBreakup: [
      { gstPercent: 5, taxableValue: 614.29, cgst: 15.36, sgst: 15.36, csee: 0.00, netAmt: 645.00 },
    ],
    netTaxableValue: 614.29,
    netCGST:         15.36,
    netSGST:         15.36,
    netCSEE:         0.00,
    thankYouNote:    "Thank You for Visiting Fresh Bakes!\nBaked fresh every morning — Apana Store, Curated Precision.",
  },
];
