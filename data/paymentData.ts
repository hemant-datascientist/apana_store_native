// ============================================================
// PAYMENT DATA — Apana Store (Customer App)
//
// Mock saved payment methods for the Payment Methods screen.
// Backend: GET  /customer/payment-methods
//          POST /customer/payment-methods      { type, token, … }
//          DELETE /customer/payment-methods/:id
//          PATCH /customer/payment-methods/:id/default
// ============================================================

export type PaymentType = "upi" | "card" | "netbanking" | "cod";

export interface PaymentMethod {
  id:        string;
  type:      PaymentType;
  label:     string;    // e.g. "GPay UPI", "HDFC Debit Card"
  detail:    string;    // e.g. "hemant@okaxis", "•••• •••• •••• 4321"
  icon:      string;    // Ionicons glyph
  color:     string;    // accent color for icon circle
  isDefault: boolean;
}

// ── Type display meta ─────────────────────────────────────────

export interface PaymentTypeMeta {
  label: string;
  icon:  string;
  color: string;
}

export const PAYMENT_TYPE_META: Record<PaymentType, PaymentTypeMeta> = {
  upi:        { label: "UPI",          icon: "flash-outline",    color: "#7C3AED" },
  card:       { label: "Card",         icon: "card-outline",     color: "#3B82F6" },
  netbanking: { label: "Net Banking",  icon: "globe-outline",    color: "#059669" },
  cod:        { label: "Cash",         icon: "cash-outline",     color: "#D97706" },
};

// ── Mock data ─────────────────────────────────────────────────

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id:        "pm_001",
    type:      "upi",
    label:     "GPay UPI",
    detail:    "hemant@okaxis",
    icon:      "flash-outline",
    color:     "#7C3AED",
    isDefault: true,
  },
  {
    id:        "pm_002",
    type:      "upi",
    label:     "PhonePe UPI",
    detail:    "hemant@ybl",
    icon:      "flash-outline",
    color:     "#5B21B6",
    isDefault: false,
  },
  {
    id:        "pm_003",
    type:      "card",
    label:     "HDFC Debit Card",
    detail:    "•••• •••• •••• 4321",
    icon:      "card-outline",
    color:     "#3B82F6",
    isDefault: false,
  },
  {
    id:        "pm_004",
    type:      "card",
    label:     "SBI Credit Card",
    detail:    "•••• •••• •••• 8876",
    icon:      "card-outline",
    color:     "#1D4ED8",
    isDefault: false,
  },
  {
    id:        "pm_005",
    type:      "cod",
    label:     "Cash on Delivery",
    detail:    "Pay when your order arrives",
    icon:      "cash-outline",
    color:     "#D97706",
    isDefault: false,
  },
];
