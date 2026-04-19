// ============================================================
// PAYMENT SERVICE — Apana Store (Customer App)
//
// Stub functions for payment method management.
// All functions return mock data now; swap TODO blocks for
// real fetch() calls when backend is ready.
//
// Backend base: POST   /customer/payment-methods
//               GET    /customer/payment-methods
//               PATCH  /customer/payment-methods/:id/default
//               DELETE /customer/payment-methods/:id
// ============================================================

export interface AddPaymentPayload {
  type:   "upi" | "card" | "netbanking" | "wallet";
  label:  string;   // Display name e.g. "Google Pay" / "Visa Card"
  detail: string;   // Masked detail e.g. "name@okaxis" / "•••• 4321"
}

export interface AddPaymentResponse {
  success: boolean;
  id:      string;   // Server-assigned payment method ID
  message: string;
}

// ── Add a new payment method ──────────────────────────────
export async function addPaymentMethod(
  payload: AddPaymentPayload,
): Promise<AddPaymentResponse> {
  // TODO: replace with real API call:
  // const res = await fetch(`${API_BASE}/customer/payment-methods`, {
  //   method:  "POST",
  //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  //   body:    JSON.stringify(payload),
  // });
  // return res.json() as Promise<AddPaymentResponse>;

  await new Promise(resolve => setTimeout(resolve, 900));   // Simulate network
  return {
    success: true,
    id:      `pm_${Date.now()}`,
    message: `${payload.label} added successfully`,
  };
}

// ── Set a payment method as default ──────────────────────
export async function setDefaultPaymentMethod(id: string): Promise<void> {
  // TODO: replace with:
  // await fetch(`${API_BASE}/customer/payment-methods/${id}/default`, {
  //   method: "PATCH", headers: { Authorization: `Bearer ${token}` },
  // });

  await new Promise(resolve => setTimeout(resolve, 400));
}

// ── Remove a payment method ───────────────────────────────
export async function removePaymentMethod(id: string): Promise<void> {
  // TODO: replace with:
  // await fetch(`${API_BASE}/customer/payment-methods/${id}`, {
  //   method: "DELETE", headers: { Authorization: `Bearer ${token}` },
  // });

  await new Promise(resolve => setTimeout(resolve, 400));
}
