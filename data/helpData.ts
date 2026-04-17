// ============================================================
// HELP DATA — Apana Store (Customer App)
//
// Quick contact actions and categorised FAQ items for the
// Help & Support screen.
//
// Backend:
//   GET /app/faqs              → FaqCategory[]
//   POST /support/ticket       { subject, message, order_id? }
//   GET /support/ticket/:id    → ticket status
// ============================================================

// ── Quick contact actions ─────────────────────────────────────

export interface QuickAction {
  key:      string;
  label:    string;
  sub:      string;        // short description
  icon:     string;        // Ionicons glyph
  color:    string;        // accent color
  action:   "whatsapp" | "call" | "email" | "chat";
  target:   string;        // phone / email / URL
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    key:    "whatsapp",
    label:  "Chat on WhatsApp",
    sub:    "Usually replies in minutes",
    icon:   "logo-whatsapp",
    color:  "#25D366",
    action: "whatsapp",
    target: "919876543210",   // TODO: replace with real support number
  },
  {
    key:    "call",
    label:  "Call Us",
    sub:    "Mon – Sat, 9 AM – 7 PM",
    icon:   "call-outline",
    color:  "#3B82F6",
    action: "call",
    target: "tel:+911800123456",  // TODO: replace with real helpline
  },
  {
    key:    "email",
    label:  "Email Support",
    sub:    "Response within 24 hours",
    icon:   "mail-outline",
    color:  "#F59E0B",
    action: "email",
    target: "mailto:support@apanastore.in",
  },
];

// ── FAQ ───────────────────────────────────────────────────────

export interface FaqItem {
  id:       string;
  question: string;
  answer:   string;
}

export interface FaqCategory {
  key:   string;
  title: string;
  icon:  string;   // Ionicons glyph
  items: FaqItem[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    key:   "orders",
    title: "Orders",
    icon:  "bag-outline",
    items: [
      {
        id: "o1",
        question: "How do I place an order?",
        answer:   "Open a store, browse products, and tap 'Add to Cart'. Once you're ready, go to your cart, review items, choose a delivery address and payment method, then tap 'Place Order'.",
      },
      {
        id: "o2",
        question: "Can I order from multiple stores at once?",
        answer:   "Yes! Apana Store supports multi-store carts. Add items from different stores — each store will be processed as a separate order with its own delivery.",
      },
      {
        id: "o3",
        question: "How do I cancel an order?",
        answer:   "Go to Order History → tap the order → tap 'Cancel Order'. Orders can be cancelled before the store confirms them. Once confirmed, cancellation depends on the store's policy.",
      },
      {
        id: "o4",
        question: "Where can I see my past orders?",
        answer:   "Go to Profile → Order History. You'll find all your past and current orders there with live status updates.",
      },
    ],
  },
  {
    key:   "delivery",
    title: "Delivery",
    icon:  "bicycle-outline",
    items: [
      {
        id: "d1",
        question: "How long does delivery take?",
        answer:   "Delivery time depends on your distance from the store and partner availability. Most local orders are delivered within 20–45 minutes. You'll see an estimated time when you place your order.",
      },
      {
        id: "d2",
        question: "Can I track my delivery in real time?",
        answer:   "Yes. Once a delivery partner picks up your order, you'll see their live location on the map. You'll also receive push notifications at each stage.",
      },
      {
        id: "d3",
        question: "What if my delivery partner doesn't arrive?",
        answer:   "If your order is delayed significantly, tap 'Contact Partner' in the active order screen. If unreachable, contact our support and we'll resolve it immediately.",
      },
      {
        id: "d4",
        question: "Is there a delivery charge?",
        answer:   "Delivery charges vary by store and distance. The exact charge is shown on the order summary before you confirm. Some stores offer free delivery above a minimum order value.",
      },
    ],
  },
  {
    key:   "payments",
    title: "Payments",
    icon:  "card-outline",
    items: [
      {
        id: "p1",
        question: "What payment methods are accepted?",
        answer:   "We accept UPI (GPay, PhonePe, Paytm), debit/credit cards, net banking, and Cash on Delivery for eligible orders.",
      },
      {
        id: "p2",
        question: "My payment failed but money was deducted. What do I do?",
        answer:   "Don't worry — failed payment deductions are automatically refunded within 5–7 business days by your bank. If the amount isn't reversed in 7 days, contact us with your transaction ID.",
      },
      {
        id: "p3",
        question: "How do refunds work?",
        answer:   "Refunds are credited back to your original payment method within 5–7 business days after the return/cancellation is approved. UPI refunds are usually instant.",
      },
      {
        id: "p4",
        question: "Is my payment information stored securely?",
        answer:   "Apana Store does not store your card details. All payments are processed through PCI-DSS compliant payment gateways.",
      },
    ],
  },
  {
    key:   "account",
    title: "Account",
    icon:  "person-outline",
    items: [
      {
        id: "a1",
        question: "How do I change my phone number?",
        answer:   "Phone numbers are linked to OTP authentication and cannot be changed in-app currently. Please contact support and we'll help you transfer your account to a new number.",
      },
      {
        id: "a2",
        question: "How do I update my delivery address?",
        answer:   "Go to Profile → Saved Addresses. You can add, edit or remove addresses. The address you select at checkout is where your order is delivered.",
      },
      {
        id: "a3",
        question: "How do I delete my account?",
        answer:   "Go to Profile → Edit Profile → scroll to Danger Zone → tap 'Delete Account'. This permanently removes all your data and cannot be undone.",
      },
      {
        id: "a4",
        question: "I can't log in. What should I do?",
        answer:   "Make sure you're using the correct phone number or email. Check that you have good mobile signal for receiving the OTP. If OTP doesn't arrive within 60 seconds, tap 'Resend OTP'. Still stuck? Contact our support.",
      },
    ],
  },
  {
    key:   "returns",
    title: "Returns & Refunds",
    icon:  "return-up-back-outline",
    items: [
      {
        id: "r1",
        question: "How do I return an item?",
        answer:   "Return eligibility depends on the store's policy. Go to Order History → tap the order → tap 'Return Item'. If the option is available, follow the on-screen steps to schedule a pickup.",
      },
      {
        id: "r2",
        question: "What items cannot be returned?",
        answer:   "Perishable goods (fresh produce, dairy, cooked food), personalised items, and items marked 'Non-returnable' by the store cannot be returned once delivered.",
      },
      {
        id: "r3",
        question: "How long does a refund take after a return?",
        answer:   "Once the store confirms the return, refunds are processed within 2–3 business days. The amount is credited to your original payment method.",
      },
    ],
  },
];
