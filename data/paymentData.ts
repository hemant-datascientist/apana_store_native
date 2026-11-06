// ============================================================
// PAYMENT DATA — Apana Store (Customer App)
//
// The two ways to pay at checkout. Apana saves no card or UPI ID: nothing
// on the server holds one, and the gateway asks for it at the moment of
// paying. A saved-methods list comes back only when a real one exists.
// ============================================================

export type PaymentType = "online" | "cod";

export interface PaymentMethod {
  id:     string;
  type:   PaymentType;
  label:  string;
  detail: string;
  icon:   string;    // Ionicons glyph
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id:     "online",
    type:   "online",
    label:  "UPI or card",
    detail: "Pay now to confirm your order",
    icon:   "flash-outline",
  },
  {
    id:     "cod",
    type:   "cod",
    label:  "Cash on Delivery",
    detail: "Pay when your order arrives",
    icon:   "cash-outline",
  },
];
