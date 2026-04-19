// ============================================================
// ADD PAYMENT DATA — Apana Store (Customer App)
//
// Static data for the Add Payment Method screen:
//   UPI apps, Indian banks (popular + full list), wallet apps.
//
// Backend:
//   POST /customer/payment-methods  → PaymentMethod
// ============================================================

// ── UPI apps ──────────────────────────────────────────────
export interface UpiApp {
  id:     string;
  name:   string;
  icon:   string;   // Ionicons glyph
  color:  string;
  suffix: string;   // VPA suffix auto-filled in input, e.g. "@okaxis"
}

export const UPI_APPS: UpiApp[] = [
  { id: "gpay",    name: "Google Pay",  icon: "logo-google",      color: "#4285F4", suffix: "@okaxis" },
  { id: "phonepe", name: "PhonePe",     icon: "flash-outline",    color: "#5B21B6", suffix: "@ybl"    },
  { id: "paytm",   name: "Paytm",       icon: "wallet-outline",   color: "#00BAF2", suffix: "@paytm"  },
  { id: "bhim",    name: "BHIM UPI",    icon: "shield-outline",   color: "#E65C00", suffix: "@upi"    },
  { id: "amazon",  name: "Amazon Pay",  icon: "bag-handle-outline",color:"#FF9900", suffix: "@apl"    },
  { id: "other",   name: "Other UPI",   icon: "qr-code-outline",  color: "#6B7280", suffix: ""        },
];

// ── Banks for Net Banking ──────────────────────────────────
export interface Bank {
  id:      string;
  name:    string;
  abbr:    string;   // Short name for the chip
  color:   string;   // Brand color
  popular: boolean;
}

export const BANKS: Bank[] = [
  // Popular banks (shown as chips at top)
  { id: "sbi",     name: "State Bank of India",   abbr: "SBI",     color: "#0F4C81", popular: true  },
  { id: "hdfc",    name: "HDFC Bank",             abbr: "HDFC",    color: "#004C8F", popular: true  },
  { id: "icici",   name: "ICICI Bank",            abbr: "ICICI",   color: "#F58220", popular: true  },
  { id: "axis",    name: "Axis Bank",             abbr: "Axis",    color: "#800000", popular: true  },
  { id: "kotak",   name: "Kotak Mahindra Bank",   abbr: "Kotak",   color: "#EE3124", popular: true  },
  { id: "pnb",     name: "Punjab National Bank",  abbr: "PNB",     color: "#1B4B8A", popular: true  },
  // Full list (shown in search)
  { id: "bob",     name: "Bank of Baroda",        abbr: "BoB",     color: "#FF6600", popular: false },
  { id: "canara",  name: "Canara Bank",           abbr: "Canara",  color: "#0066B3", popular: false },
  { id: "union",   name: "Union Bank of India",   abbr: "Union",   color: "#003087", popular: false },
  { id: "indian",  name: "Indian Bank",           abbr: "Indian",  color: "#0066CC", popular: false },
  { id: "central", name: "Central Bank of India", abbr: "CBI",     color: "#CC0000", popular: false },
  { id: "idfc",    name: "IDFC FIRST Bank",       abbr: "IDFC",    color: "#8B0000", popular: false },
  { id: "yes",     name: "Yes Bank",              abbr: "Yes",     color: "#0052CC", popular: false },
  { id: "indusind",name: "IndusInd Bank",         abbr: "IndusInd",color: "#00529B", popular: false },
  { id: "federal", name: "Federal Bank",          abbr: "Federal", color: "#003366", popular: false },
  { id: "rbl",     name: "RBL Bank",              abbr: "RBL",     color: "#003366", popular: false },
  { id: "iob",     name: "Indian Overseas Bank",  abbr: "IOB",     color: "#003399", popular: false },
  { id: "boi",     name: "Bank of India",         abbr: "BOI",     color: "#004080", popular: false },
];

// ── Wallet apps ────────────────────────────────────────────
export interface WalletApp {
  id:    string;
  name:  string;
  icon:  string;
  color: string;
  desc:  string;
}

export const WALLET_APPS: WalletApp[] = [
  { id: "paytm",    name: "Paytm Wallet",    icon: "wallet-outline",    color: "#00BAF2", desc: "Paytm balance & cashback" },
  { id: "amazon",   name: "Amazon Pay",      icon: "bag-handle-outline",color: "#FF9900", desc: "Amazon Pay balance"       },
  { id: "mobikwik", name: "MobiKwik",        icon: "phone-portrait-outline", color: "#CC0066", desc: "Wallet & ZIP credit"  },
  { id: "airtel",   name: "Airtel Money",    icon: "radio-outline",     color: "#E4003B", desc: "Airtel Payments Bank"    },
  { id: "jio",      name: "JioMoney",        icon: "cellular-outline",  color: "#0066CC", desc: "Reliance Jio wallet"     },
  { id: "freecharge",name:"FreeCharge",      icon: "flash-outline",     color: "#F26522", desc: "Axis Bank wallet"         },
];

// ── Card brand detection (from first digit) ───────────────
export type CardBrand = "visa" | "mastercard" | "rupay" | "amex" | "unknown";

export function detectCardBrand(number: string): CardBrand {
  const clean = number.replace(/\s/g, "");
  if (clean.startsWith("4"))          return "visa";
  if (clean.startsWith("5"))          return "mastercard";
  if (clean.startsWith("6"))          return "rupay";
  if (clean.startsWith("34") || clean.startsWith("37")) return "amex";
  return "unknown";
}

export const CARD_BRAND_META: Record<CardBrand, { label: string; color: string; icon: string; cvvLen: number }> = {
  visa:       { label: "Visa",        color: "#1A1F71", icon: "card-outline",  cvvLen: 3 },
  mastercard: { label: "Mastercard",  color: "#EB001B", icon: "card-outline",  cvvLen: 3 },
  rupay:      { label: "RuPay",       color: "#2E5FAC", icon: "card-outline",  cvvLen: 3 },
  amex:       { label: "Amex",        color: "#2E77BC", icon: "card-outline",  cvvLen: 4 },
  unknown:    { label: "",            color: "#6B7280", icon: "card-outline",  cvvLen: 3 },
};

// ── Card number formatter: "1234 5678 9012 3456" ──────────
export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

// ── Expiry formatter: "12/26" ─────────────────────────────
export function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

// ── UPI ID validator: must contain exactly one @ ──────────
export function isValidUpiId(id: string): boolean {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/.test(id.trim());
}
