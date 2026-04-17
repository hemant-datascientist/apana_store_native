# Seller Special Cases — Food (Live) & Service-Based Sellers

> This file solves the unsolved frontend problem in Apana Seller:
> 1. **Food-Live sellers** (Cafe, Bakery, Gola wala, Juice, Lassi, etc.) — no fixed inventory,
>    no barcodes, quantities vary batch-to-batch, items made fresh on demand.
> 2. **Service-based sellers** (Hair salon, Repair shop, Tutor, Tailor, etc.) — no physical
>    product, sell time/skill, pricing is per service not per unit.

---

## PROBLEM STATEMENT

### Food-Live Sellers (e.g. Gola Wala)
- Products are made fresh — you can't say "10 golas in stock"
- No barcode or GTIN — item doesn't exist in GS1 database
- Quantity is unlimited (as long as raw materials last)
- Price can change daily (seasonal fruit prices)
- Items have variants: "Small Gola ₹20 | Large Gola ₹35 | Special ₹50"
- Availability: "available today" vs "sold out for today"

### Service-Based Sellers (e.g. Hair Salon)
- No inventory at all — sell expertise, not goods
- Time slots matter — "Haircut at 3 PM" not "Buy haircut"
- Services have durations: "Haircut - 30 min | Hair Color - 2 hours"
- Staff matters — "Book with Ramesh" vs "Any available"
- Multiple pricing tiers: "Hair Cut ₹100 | Full Shave + Cut ₹120"

---

## SOLUTION: Seller Type System

### Seller Type Enum
```
"retail"       — Traditional store, barcoded inventory (Grocery, Electronics, etc.)
"wholesale"    — Bulk sales, MOQ-based pricing
"food_packed"  — Packaged food with barcodes (chips, biscuits — standard inventory)
"food_live"    — Fresh-made food, no barcodes (Cafe, Gola, Juice, Bakery)
"service"      — Skill/time-based, no physical product (Salon, Repair, Tutor)
```

---

## API: Food-Live Seller

### Menu Item (not "product")

```json
// MenuItemObject — replaces ProductObject for food_live sellers
{
  "id":            "menu_01",
  "seller_id":     "seller_abc",
  "name":          "Kala Khatta Gola",
  "description":   "Fresh ice gola with kala khatta syrup",
  "category":      "Gola",
  "image_url":     null,
  "is_veg":        true,              // mandatory for food items
  "is_available":  true,              // can be toggled anytime (sold out today)
  "variants": [
    {
      "id":      "var_01",
      "label":   "Small",
      "price":   20,
      "active":  true
    },
    {
      "id":      "var_02",
      "label":   "Large",
      "price":   35,
      "active":  true
    },
    {
      "id":      "var_03",
      "label":   "Special",
      "price":   50,
      "active":  false                // seasonal, disabled right now
    }
  ],
  "customizations": [               // optional add-ons
    {
      "id":      "cust_01",
      "label":   "Extra Syrup",
      "price":   5
    }
  ],
  "prep_time_min":  5,               // estimated preparation time in minutes
  "created_at":    "2025-01-01",
  "updated_at":    "2025-04-17"
}
```

### Endpoints for food_live sellers

```
// SELLER APP
GET    /seller/menu                           → MenuItemObject[]
POST   /seller/menu                           → Create menu item
PUT    /seller/menu/:id                       → Update item (name, price, variants)
DELETE /seller/menu/:id                       → Remove item
PATCH  /seller/menu/:id/availability          → Toggle is_available (quick sold-out)
  Body: { "is_available": false }

// VARIANT management
POST   /seller/menu/:id/variants              → Add a variant
PUT    /seller/menu/:id/variants/:var_id      → Update variant price/label
PATCH  /seller/menu/:id/variants/:var_id/toggle → Enable/disable variant

// CUSTOMER APP — reads same menu
GET    /stores/:store_id/menu                 → Public menu (is_available=true only)
```

### Order flow for food_live sellers
```
// Customer places order
POST /orders
{
  "store_id":   "seller_abc",
  "order_type": "menu",             // ← key differentiator from inventory orders
  "items": [
    {
      "menu_item_id": "menu_01",
      "variant_id":   "var_01",     // Small Gola
      "quantity":     2,
      "customizations": ["cust_01"] // Extra Syrup
    }
  ],
  "notes": "Less syrup please"
}

// Seller sees on their app:
// "2x Kala Khatta Gola (Small) + Extra Syrup — Note: Less syrup"
// No inventory is deducted — just a notification to prepare
```

---

## API: Service-Based Seller

### Service Object

```json
// ServiceObject — replaces ProductObject for service sellers
{
  "id":               "svc_01",
  "seller_id":        "seller_xyz",
  "name":             "Hair Cut",
  "description":      "Regular scissor cut, styled finish",
  "category":         "Hair",
  "image_url":        null,
  "price":            100,
  "duration_min":     30,            // service duration in minutes
  "is_available":     true,
  "requires_booking": true,          // false = walk-in OK
  "staff_options": [                 // optional: book specific staff
    {
      "id":        "staff_01",
      "name":      "Ramesh",
      "specialty": "Hair",
      "available": true
    },
    {
      "id":        "staff_02",
      "name":      "Suresh",
      "specialty": "Beard & Shave",
      "available": true
    }
  ],
  "variants": [                      // tiered pricing
    { "id": "v1", "label": "Regular Cut",         "price": 100, "duration_min": 30 },
    { "id": "v2", "label": "Cut + Styling",        "price": 150, "duration_min": 45 },
    { "id": "v3", "label": "Full Shave + Cut",     "price": 120, "duration_min": 40 }
  ]
}
```

### Endpoints for service sellers

```
// SELLER APP
GET    /seller/services                        → ServiceObject[]
POST   /seller/services                        → Create service
PUT    /seller/services/:id                    → Update
DELETE /seller/services/:id                    → Remove
PATCH  /seller/services/:id/availability       → Toggle available

// STAFF management
GET    /seller/staff                           → StaffObject[]
POST   /seller/staff                           → Add staff member
PUT    /seller/staff/:id                       → Update
DELETE /seller/staff/:id                       → Remove

// BOOKING SLOTS
GET    /seller/bookings?date={YYYY-MM-DD}      → All bookings for a day
PATCH  /seller/bookings/:id/status             → confirm | complete | cancel

// CUSTOMER APP
GET    /stores/:store_id/services              → Public service catalog
POST   /bookings                               → Book a service
  Body:
  {
    "store_id":       "seller_xyz",
    "service_id":     "svc_01",
    "variant_id":     "v1",
    "staff_id":       "staff_01",   // optional, null = any available
    "date":           "2025-05-01",
    "time_slot":      "14:00",
    "notes":          "Side parting please"
  }

GET    /bookings                               → Customer's booking history
GET    /bookings/:id                           → Booking detail
POST   /bookings/:id/cancel                    → Cancel booking
```

### Booking flow
```
// Customer books haircut at 3 PM with Ramesh
POST /bookings → 201 { booking_id, confirmation_code, status: "confirmed" }

// Seller receives push notification
WS event: booking.new → { booking_id, customer_name, service, time_slot, staff }

// Seller confirms / completes
PATCH /seller/bookings/:id/status { status: "complete" }

// Customer gets notification
Push: "Your appointment with Ramesh is complete. Rate your experience."
```

---

## Seller Onboarding — Type Selection

When a seller registers, they pick their type. This drives the entire UI on both seller and customer apps:

```
POST /seller/onboarding
{
  "seller_type": "food_live",     // determines what features they see
  "business_name": "Sonu Gola Wala",
  "owner_name": "Sonu Sharma",
  "phone": "+91...",
  "address": { ... },
  "category": "Street Food",
  "fssai_license": "12345678901234",  // required for food sellers
  "gstin": null                        // optional
}

Response 201:
{
  "seller_id": "seller_abc",
  "seller_type": "food_live",
  "status": "pending_verification",   // ops team verifies documents
  "next_steps": ["Upload FSSAI doc", "Set up menu"]
}
```

---

## Frontend TODO (Apana Seller App)

When implementing seller frontend for `food_live` and `service` types:

1. **Replace "Inventory" tab** with "Menu" tab for `food_live`
2. **Replace "Products" tab** with "Services" tab for `service`
3. **Add "Bookings" tab** for `service` sellers
4. **Add quick toggle** "Available today / Sold out" for each menu item
5. **No barcode scanner** on seller app for these types
6. **Staff management screen** for `service` sellers
7. **Time slot calendar** for `service` sellers with `requires_booking: true`
