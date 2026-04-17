# REST API — Apana Partner App

> Base URL: `https://api.apanastore.in/api/partner`
> App scope: `app=partner`
> Partner types: `delivery` | `rider` | `logistics`

---

## ONBOARDING

### POST /partner/onboarding
```
Body:
{
  "partner_type":  "delivery",       // "delivery" | "rider" | "logistics"
  "name":          "Ravi Kumar",
  "phone":         "+919123456789",
  "dob":           "1998-05-15",
  "vehicle": {
    "type":        "two_wheeler",    // "two_wheeler" | "four_wheeler" | "truck" | "tempo"
    "make":        "Honda",
    "model":       "Activa",
    "year":        2022,
    "number":      "MH12AB1234",
    "color":       "Red"
  },
  "documents": {
    "aadhar_front_url":    "...",
    "aadhar_back_url":     "...",
    "pan_url":             "...",
    "dl_url":              "...",
    "vehicle_rc_url":      "...",
    "vehicle_insurance_url":"..."
  },
  "bank_account": {
    "account_number": "...",
    "ifsc":           "SBIN0001234",
    "account_name":   "Ravi Kumar"
  }
}

Response 201:
{
  "partner_id": "partner_01",
  "status":     "under_review",    // ops verifies documents (24-48 hrs)
  "message":    "Documents submitted. You will be notified once verified."
}
```

---

## PROFILE

### GET /partner/profile
```
Response 200:
{
  "id":            "partner_01",
  "name":          "Ravi Kumar",
  "phone":         "+919123456789",
  "partner_type":  "delivery",
  "vehicle":       { ... },
  "rating":        4.8,
  "total_earnings": 42500.00,
  "total_trips":   540,
  "status":        "active",       // "active" | "suspended" | "under_review"
  "is_online":     true,
  "wallet_balance": 1200.00
}
```

### PATCH /partner/status
> Partner goes online/offline
```
Body: { "is_online": true }
Response 200: { "is_online": true, "message": "You are now online" }
// Triggers: Redis geo-index update, notify nearby pending orders
```

---

## LOCATION (REST fallback — main is WebSocket)

### POST /partner/location
> GPS ping — primary channel is WebSocket, this is fallback
```
Body:
{
  "lat":       18.5200,
  "lng":       73.8567,
  "accuracy":  5,           // meters
  "heading":   145,         // degrees (optional)
  "speed":     25           // km/h (optional)
}
Response 200: { "received": true }
```

---

## TRIPS (Delivery)

### GET /partner/trips/available
> Nearby available delivery orders for the partner to accept

```
Response 200:
{
  "trips": [
    {
      "trip_id":       "trip_01",
      "type":          "delivery",
      "store": {
        "name":        "Sharma General Store",
        "address":     "Shivajinagar",
        "distance_km": 0.8
      },
      "customer": {
        "address":     "Kothrud",
        "distance_km": 2.1     // store to customer
      },
      "items_count":   3,
      "payout":        35.00,
      "expires_in":    30        // seconds to accept before it goes to next partner
    }
  ]
}
```

### POST /partner/trips/:id/accept
```
Response 200: { "trip_id": "trip_01", "status": "accepted" }
// Triggers WebSocket event to customer: partner.assigned
```

### POST /partner/trips/:id/reject
```
Body: { "reason": "too_far" }
Response 200: { "message": "Rejected. Next trip will be assigned." }
```

### PATCH /partner/trips/:id/status
> Update trip status at each milestone

```
Body:
{
  "status": "reached_store"
  // Valid statuses (in order):
  // accepted → reached_store → picked_up → out_for_delivery → reached_customer → delivered
}
Response 200: { "trip_id": "trip_01", "status": "reached_store" }
// Each status change triggers push to customer and seller
```

### POST /partner/trips/:id/qr-verify
> QR handshake at delivery — customer shows QR, partner scans to confirm delivery

```
Body: { "qr_token": "abc123xyz" }
Response 200: { "verified": true, "trip_status": "delivered" }
Response 400: { "error": "Invalid QR token" }
```

---

## RIDES (Rider)

### GET /partner/rides/available
> Available ride requests near the rider

```
Response 200:
{
  "rides": [
    {
      "ride_id":       "ride_01",
      "pickup": {
        "address":     "Shivajinagar",
        "lat":         18.5200,
        "lng":         73.8567,
        "distance_km": 1.2
      },
      "dropoff": {
        "address":     "FC Road",
        "lat":         18.5290,
        "lng":         73.8450
      },
      "distance_km":   3.8,
      "duration_min":  15,
      "fare":          85.00,
      "expires_in":    25
    }
  ]
}
```

### POST /partner/rides/:id/accept
### POST /partner/rides/:id/reject
### PATCH /partner/rides/:id/status
> Statuses: `accepted` → `reached_pickup` → `passenger_boarded` → `completed`

---

## EARNINGS & WALLET

### GET /partner/earnings?period=today|week|month
```
Response 200:
{
  "period":        "today",
  "total_earned":  450.00,
  "trips":         12,
  "bonuses":       50.00,
  "deductions":    0.00,
  "net":           500.00,
  "breakdown": [
    { "trip_id": "trip_01", "type": "delivery", "amount": 35.00, "at": "..." }
  ]
}
```

### GET /partner/wallet
```
Response 200:
{
  "balance":       1200.00,
  "total_earned":  42500.00,
  "transactions":  [ ... ]
}
```

### POST /partner/wallet/withdraw
```
Body: { "amount": 500.00 }
Response 200: { "status": "processing", "estimated_at": "2025-04-18T10:00:00Z" }
// Transferred to registered bank account within 24 hours
```

---

## TASK HUB (Apana Partner special feature)

### GET /partner/tasks/available
> Non-delivery tasks: document pickup, survey, store visit, etc.

```
Response 200:
{
  "tasks": [
    {
      "task_id":     "task_01",
      "type":        "store_visit",
      "title":       "Visit and photograph store",
      "description": "Visit Sharma General Store, take 5 photos of store front",
      "location":    { "address": "Shivajinagar", "lat": ..., "lng": ... },
      "payout":      80.00,
      "deadline":    "2025-04-18T18:00:00Z"
    }
  ]
}
```

### POST /partner/tasks/:id/accept
### PATCH /partner/tasks/:id/complete
```
Body: {
  "completion_proof": {
    "photos": ["url1", "url2"],   // uploaded to media-service
    "notes": "All done"
  }
}
```

---

## SAFETY

### POST /partner/sos
> Emergency SOS button — notifies ops team + shares live location
```
Body: { "lat": 18.52, "lng": 73.85, "message": "Need help" }
Response 200: { "sos_id": "sos_01", "ops_notified": true }
```
