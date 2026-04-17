# Third-Party Integrations — Apana Platform

---

## PAYMENTS — Razorpay

> All payment processing goes through Razorpay.
> Apana never stores card/UPI details — PCI DSS compliant.

```
Supported methods:
  UPI (PhonePe, GPay, Paytm, BHIM)
  Cards (Visa, Mastercard, RuPay)
  Net Banking
  Wallets (Paytm, Amazon Pay, etc.)
  EMI
  COD (Cash on Delivery) — Apana manages, Razorpay not involved

Key APIs:
  POST https://api.razorpay.com/v1/orders    → Create payment order
  POST https://api.razorpay.com/v1/transfers → Payout to sellers/partners
  POST https://api.razorpay.com/v1/refunds   → Refund to customer

Webhook events to handle:
  payment.captured    → Mark order as paid
  payment.failed      → Cancel order, notify customer
  transfer.processed  → Mark seller/partner payout complete
  refund.created      → Notify customer of refund

Payout flow:
  Customer pays → Razorpay captures
  → Platform deducts commission (5%)
  → Seller receives 95% via Razorpay Route
  → Partner receives delivery fee via Razorpay Contact + Fund Account
  → Payouts processed daily (T+1 settlement)
```

---

## SMS — Gupshup / MSG91

> OTP and transactional SMS

```
Provider: MSG91 (primary) with Gupshup fallback

Key use cases:
  OTP delivery                          → POST /api/v5/otp
  Order confirmation SMS                → POST /api/v5/flow
  Delivery notification                 → POST /api/v5/flow
  Partner earnings payout SMS           → POST /api/v5/flow

DLT (Distributed Ledger Technology) Registration:
  All SMS templates must be pre-registered with TRAI via DLT portal
  Required templates:
  - OTP template: "Your Apana Store OTP is {#var#}. Valid for 5 minutes."
  - Order placed: "Order #{#var#} confirmed. Estimated delivery: {#var#}"
  - Out for delivery: "Your order is out for delivery with {#var#}"
```

---

## WHATSAPP — Meta Business API (via Gupshup or Interakt)

> For order updates and customer support (higher open rate than SMS)

```
Pre-approved templates (must be approved by Meta):
  order_placed:       "Hi {name}, your order from {store} is confirmed! ..."
  order_delivered:    "Hi {name}, your order has been delivered. Rate: {link}"
  partner_arriving:   "Your delivery partner {name} is {eta} away"
  booking_confirmed:  "Your appointment at {store} on {date} at {time} is confirmed"
  otp:               "Your OTP for Apana Store is {otp}. Do not share."

Note: WhatsApp Business API requires:
  - Verified Facebook Business Manager account
  - WhatsApp Business Account (WABA)
  - Approved message templates before sending
```

---

## PUSH NOTIFICATIONS — Firebase (FCM) + APNs

```
Firebase Cloud Messaging (FCM):
  - Android: FCM token from firebase-android-sdk
  - iOS: APNs via FCM (FCM handles routing)
  - React Native: @react-native-firebase/messaging or expo-notifications

Key notification categories:
  order_update    → high priority, shows on lock screen
  trip_request    → high priority, partner app
  promo           → low priority, batched

Expo-specific (current stack):
  expo-notifications handles token registration
  Backend sends to Expo Push API:
  POST https://exp.host/--/api/v2/push/send
  Body: {
    to: "ExponentPushToken[xxxxxx]",
    title: "Order Out for Delivery",
    body: "Ravi Kumar is on the way",
    data: { order_id: "ord_01", screen: "order_detail" }
  }

When moving to bare React Native:
  Switch to direct FCM for Android + APNs for iOS
```

---

## MAPS & NAVIGATION — Google Maps Platform

```
APIs used:
  Maps SDK (React Native)      → Display map, partner marker, route
  Directions API               → Calculate route between store → customer
  Distance Matrix API          → Bulk ETA calculation for partner matching
  Geocoding API                → Address text → lat/lng
  Reverse Geocoding API        → lat/lng → human-readable address
  Places API                   → Address autocomplete in address form

Alternatives to reduce cost:
  MapmyIndia (Mappls) — Indian maps, cheaper, better accuracy for India
  OpenStreetMap + OSRM         → Free, self-hosted routing

Recommendation:
  Use MapmyIndia for India-specific accuracy and lower cost
  MapmyIndia has ONDC-compliant mapping APIs
```

---

## GPS & LOCATION — expo-location (current) → Background GPS (production)

```
Current (Expo):
  expo-location → foreground location only

Production needs (Partner app):
  Background location tracking while partner is online
  React Native: react-native-background-geolocation (paid, best)
  Free alternative: react-native-background-actions + expo-location

Location update frequency:
  Partner online, no active trip: every 30 seconds (battery save)
  Partner on active trip:         every 3 seconds (real-time tracking)
```

---

## CAMERA & BARCODE — expo-camera (current)

```
Current: expo-camera with barcodeScannerSettings
Supports: QR, EAN-13, EAN-8, UPC-A, Code128, Code39, ITF-14

Production consideration:
  expo-camera is sufficient for current use cases
  For higher performance scanning: react-native-vision-camera + mlkit-barcode-scanning
```

---

## DOCUMENT STORAGE — AWS S3 / Cloudflare R2

```
Bucket structure:
  apana-store/
  ├── avatars/          → User profile photos
  ├── seller-docs/      → KYC documents (private, signed URLs only)
  ├── products/         → Product images
  ├── banners/          → Home screen banners
  ├── stores/           → Store front photos
  └── partners/         → Partner documents (private)

Access control:
  Public: avatars, products, banners, stores (CDN-delivered)
  Private: seller-docs, partners (signed URLs, expire in 15 min)

Image optimization:
  On upload → resize to multiple sizes (thumbnail, medium, full)
  Convert to WebP for better compression
  Use Cloudflare Image Resizing or imgix
```

---

## ANALYTICS — Mixpanel + Internal TimescaleDB

```
Mixpanel (User behavior tracking):
  Track events: app_open, product_viewed, cart_add, order_placed, etc.
  Track user properties: city, total_orders, favourite_categories
  Funnels: browse → cart → checkout → placed

Internal TimescaleDB (Business metrics):
  Revenue, orders, GMV — stored internally, not sent to third-party
  Custom admin dashboard queries
  Retention: raw events 90 days, aggregated forever

DO NOT send to third-party:
  Phone numbers, addresses, payment data
  Partner live location history
```

---

## AUTHENTICATION SMS — Future: WhatsApp OTP

```
Current: SMS OTP via MSG91
Future: WhatsApp OTP (60% of Indians prefer WhatsApp)
  - Higher delivery rate
  - No SIM change issues
  - Meta Business API supports OTP templates
```

---

## CUSTOMER SUPPORT — Freshdesk / Intercom

```
Support channels:
  In-app chat → Freshdesk Messaging SDK (or Intercom)
  Email: support@apanastore.in
  WhatsApp: via Gupshup business account
  Phone: IVR → human agent (for high-value complaints)

Auto-escalation:
  Order not delivered in 2x estimated time → auto-ticket created
  Refund not processed in 48 hours → auto-escalate to finance
```

---

## COMPLIANCE & LEGAL

```
GST Integration:
  All invoices must include GST breakdown
  B2C invoices: automated via Tally API or Zoho Books
  B2B invoices: GST e-invoice mandate for >₹5 crore turnover

TDS on Partner Payouts:
  If partner earnings > ₹30,000/year → deduct 1% TDS (Section 194C)
  Generate Form 16A annually for partners

Data Localization:
  All customer data stored in India (Mumbai AWS region / ap-south-1)
  Required by RBI + IT Act 2000
```
