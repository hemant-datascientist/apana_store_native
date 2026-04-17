# ONDC Integration — Apana Platform

> ONDC (Open Network for Digital Commerce) is India's government-backed open
> commerce network. Apana Store acts as both a **Buyer NP** (network participant)
> and a **Seller NP**, making products available to all ONDC buyer apps
> (Paytm, Pincode, Magicpin, PhonePe, etc.) and vice versa.

---

## ONDC ROLES

| Role | What it means | Apana app |
|------|--------------|-----------|
| **Buyer NP (BAP)** | Customer discovers and orders products | Apana Store customer app |
| **Seller NP (BPP)** | Seller lists products, receives orders | Apana Seller app |
| **Logistics NP** | Handles delivery | Apana Partner (logistics) |

---

## ONDC API FLOW (Beckn Protocol)

All ONDC calls follow the **Beckn Protocol** — async request/callback pattern.

```
Customer on Paytm (another BAP)         ONDC Gateway         Apana as BPP
         │                                    │                     │
         │  /search (product query)            │                     │
         ├───────────────────────────────────►│                     │
         │                                    │  broadcast to BPPs  │
         │                                    ├────────────────────►│
         │                                    │                     │ /on_search
         │                                    │◄────────────────────┤ (catalog response)
         │◄───────────────────────────────────│                     │
         │  /select (choose item + store)      │                     │
         ├───────────────────────────────────►│                     │
         │                                    ├────────────────────►│
         │                                    │◄────────────────────┤ /on_select (price confirm)
         │  /init (billing, shipping details) │                     │
         ├───────────────────────────────────►│                     │
         │                                    ├────────────────────►│
         │                                    │◄────────────────────┤ /on_init (order draft)
         │  /confirm (place order)            │                     │
         ├───────────────────────────────────►│                     │
         │                                    ├────────────────────►│
         │                                    │◄────────────────────┤ /on_confirm (order placed)
         │  /status (track order)             │                     │
         ├───────────────────────────────────►│                     │
         │                                    │◄────────────────────┤ /on_status (status update)
```

---

## APANA AS SELLER NP (BPP) — Incoming ONDC Orders

When a customer on Paytm or any other BAP orders from an Apana-registered seller:

### Endpoints Apana must expose (BPP callback URLs)

```
POST /ondc/search     → Receive search query from gateway
POST /ondc/select     → Receive item selection
POST /ondc/init       → Receive order initialization
POST /ondc/confirm    → Receive order confirmation → create internal order
POST /ondc/cancel     → Receive cancellation
POST /ondc/status     → Receive status query → return current order status
POST /ondc/track      → Return live partner GPS URL
POST /ondc/support    → Return support contact
POST /ondc/rating     → Receive customer rating
```

### /ondc/confirm → internal order creation
```json
// Received from ONDC gateway
{
  "context": {
    "domain": "ONDC:RET10",     // grocery
    "transaction_id": "txn_abc",
    "message_id": "msg_xyz",
    "bpp_id": "apanastore.in",
    "bap_id": "paytm.in"
  },
  "message": {
    "order": {
      "id": "ondc_ord_01",
      "items": [
        { "id": "prod_01", "quantity": { "count": 2 } }
      ],
      "fulfillments": [
        {
          "type": "Delivery",
          "end": {
            "location": { "address": { ... }, "gps": "18.52,73.85" },
            "contact": { "phone": "+919876543210" }
          }
        }
      ],
      "payment": {
        "type": "ON-FULFILLMENT",   // COD
        "status": "NOT-PAID"
      }
    }
  }
}

// Apana processes:
// 1. Create internal order (type=ondc, source=paytm)
// 2. Notify seller via WebSocket
// 3. Assign delivery partner
// 4. Return /on_confirm with order details

POST {bap_uri}/on_confirm
{
  "context": { ... },
  "message": {
    "order": {
      "id": "ondc_ord_01",
      "state": "Accepted",
      "fulfillments": [
        {
          "state": { "descriptor": { "code": "Pending" } },
          "tracking": true,
          "agent": {
            "name": "Ravi Kumar",
            "phone": "+919123456789"
          }
        }
      ]
    }
  }
}
```

---

## APANA AS BUYER NP (BAP) — Customer Orders via ONDC

When an Apana Store customer orders from a non-Apana seller (e.g., a seller only on Dunzo):

```
POST /ondc/bap/search       → Broadcast search to ONDC gateway
POST /ondc/bap/select       → Select item from external seller
POST /ondc/bap/init
POST /ondc/bap/confirm      → Place order on external seller's BPP
POST /ondc/bap/track        → Get tracking URL from external seller
```

---

## ONDC DOMAINS (Categories)

| Domain Code | Category | Relevant for |
|-------------|---------|-------------|
| `ONDC:RET10` | Grocery | Apana Seller (retail, food_packed) |
| `ONDC:RET11` | F&B (Food & Beverage) | Apana Seller (food_live) |
| `ONDC:RET12` | Fashion | Apana Seller (retail) |
| `ONDC:RET13` | Beauty & Personal Care | Apana Seller (retail) |
| `ONDC:RET14` | Electronics | Apana Seller (retail) |
| `ONDC:SRV11` | Home Services | Apana Seller (service) |
| `ONDC:TRV10` | Mobility (Ride) | Apana Partner (rider) |
| `ONDC:LOG10` | Logistics | Apana Partner (logistics) |

---

## ONDC Compliance Checklist

Before going live on ONDC, Apana must complete:

- [ ] Register as Buyer NP and Seller NP on ONDC registry
- [ ] Get digital signature certificate (DSC) for all API calls
- [ ] Implement Beckn Protocol v1.2 correctly
- [ ] Pass ONDC compliance tests (buyer + seller flows)
- [ ] Integrate with ONDC logistics network
- [ ] FSSAI integration for food product verification
- [ ] GS1 India integration for product barcode verification
- [ ] Set up sandbox environment first (ONDC provides staging gateway)
- [ ] Onboard at least 100 sellers before ONDC network launch

---

## GS1 India Integration (Product Verification)

```
// Verify a product barcode via GS1 India API
GET https://gepir.gs1.org/index.php/search-by-gtin?gtin={barcode}

// Or use GS1 India's national registry:
GET https://gs1india.org/api/v1/gtin/{barcode}

// Response:
{
  "gtin": "8901058001178",
  "brand": "Amul",
  "product_name": "Amul Taza Homogenised Toned Milk",
  "net_content": "500 ml",
  "country_of_origin": "India",
  "manufacturer": "GCMMF"
}
```

---

## FSSAI Integration (Food Safety Verification)

```
// Verify FSSAI license of a food seller
GET https://foodlicensing.fssai.gov.in/api/v1/license/{fssai_number}

// Response:
{
  "license_no": "12345678901234",
  "business_name": "Sonu Gola Wala",
  "address": "...",
  "validity": "2026-12-31",
  "status": "active"
}
```
