# REST API — Admin Panel (Full Control System)

> Base URL: `https://api.apanastore.in/api/admin`
> Requires: `app=admin` JWT scope + IP whitelist (office IPs only)
> Admin roles: `super_admin` | `ops` | `support` | `finance`
> All admin actions are audit-logged.

---

## DASHBOARD

### GET /admin/dashboard
> Real-time overview of the entire platform

```
Response 200:
{
  "snapshot": {
    "timestamp": "2025-04-17T10:00:00Z",
    "stores_live":          410,
    "active_orders":        78,
    "active_partners":      134,
    "customers_online":     1203,
    "revenue_today_inr":    245000.00,
    "orders_today":         1847,
    "gmv_mtd_inr":          8200000.00
  },
  "alerts": [
    {
      "type":     "high_cancellation_rate",
      "store_id": "store_77",
      "message":  "Store cancellation rate above 20% today",
      "severity": "warning"
    }
  ],
  "city_breakdown": [
    { "city": "Pune",      "orders": 640, "stores_live": 142 },
    { "city": "Mumbai",    "orders": 510, "stores_live": 118 },
    { "city": "Bangalore", "orders": 390, "stores_live": 89 }
  ]
}
```

---

## USER MANAGEMENT

### GET /admin/users?type=customer|seller|partner&page=1&search={}
```
Response 200:
{
  "users": [
    {
      "id":         "usr_01",
      "name":       "Hemant Lokhande",
      "phone":      "+919876543210",
      "type":       "customer",
      "status":     "active",
      "created_at": "2025-01-15",
      "orders":     24,
      "city":       "Pune"
    }
  ],
  "total": 48320
}
```

### GET /admin/users/:id
> Full user profile with activity history

### PATCH /admin/users/:id/status
```
Body: { "status": "suspended", "reason": "Fraudulent activity reported" }
Response 200: { "user_id": "usr_01", "status": "suspended" }
// Immediately invalidates all active JWT tokens for this user
```

### DELETE /admin/users/:id
> Soft delete — GDPR compliance. Data anonymized, not hard deleted.

---

## SELLER MANAGEMENT

### GET /admin/sellers?status=active|pending|suspended&city={}&page={}
### GET /admin/sellers/:id
> Full seller profile with revenue, orders, ratings, documents

### PATCH /admin/sellers/:id/verify
> Approve seller after document review (Apana Service team does offline verification)
```
Body:
{
  "status":   "approved",        // "approved" | "rejected"
  "reason":   null,
  "verified_by": "ops_user_id"
}
```

### PATCH /admin/sellers/:id/status
```
Body: { "status": "suspended", "reason": "Multiple customer complaints" }
```

### GET /admin/sellers/:id/inventory-audit
> View full inventory log — helpful for disputes

### GET /admin/sellers/pending-verification
> List sellers waiting for document verification (Apana Service team queue)

---

## PARTNER MANAGEMENT

### GET /admin/partners?type=delivery|rider|logistics&status={}&city={}
### GET /admin/partners/:id
### PATCH /admin/partners/:id/verify   → Approve driving license + documents
### PATCH /admin/partners/:id/status   → Suspend/activate
### GET /admin/partners/:id/location   → Last known GPS location
### GET /admin/partners/:id/trips      → Full trip history

---

## ORDER MANAGEMENT

### GET /admin/orders?status={}&city={}&date={}&page={}
```
Response 200:
{
  "orders": [
    {
      "id":           "ord_01",
      "customer":     { "name": "...", "phone": "..." },
      "seller":       { "name": "...", "area":  "..." },
      "partner":      { "name": "...", "phone": "..." },
      "status":       "delivered",
      "total":        210.00,
      "created_at":   "2025-04-17T10:00:00Z",
      "city":         "Pune"
    }
  ],
  "total": 1847
}
```

### GET /admin/orders/:id
> Full order detail with timeline, payment, messages

### POST /admin/orders/:id/override
> Force-update an order status (ops intervention)
```
Body:
{
  "new_status": "cancelled",
  "reason":     "Store closed due to emergency",
  "refund":     true
}
```

### POST /admin/orders/:id/reassign-partner
> Reassign delivery to a different partner
```
Body: { "new_partner_id": "partner_02" }
```

---

## FINANCIAL CONTROL

### GET /admin/finance/revenue?period=today|week|month|custom&from={}&to={}
```
Response 200:
{
  "period":          "month",
  "gross_revenue":   8200000.00,
  "platform_fee":    410000.00,      // 5% commission
  "seller_payouts":  7380000.00,
  "partner_payouts": 320000.00,
  "refunds":         90000.00,
  "net_revenue":     410000.00
}
```

### GET /admin/finance/payouts?status=pending|processed
> List all pending seller and partner payouts

### POST /admin/finance/payouts/:id/process
> Trigger bank transfer for a payout

### GET /admin/finance/disputes
> Payment disputes, refund requests

### POST /admin/finance/disputes/:id/resolve
```
Body:
{
  "resolution":  "refund_full",      // "refund_full" | "refund_partial" | "reject"
  "amount":      210.00,
  "note":        "Customer complaint verified"
}
```

---

## FRANCHISE / APANA SERVICE MANAGEMENT

### GET /admin/franchises
> All Apana Service franchise locations

```
Response 200:
{
  "franchises": [
    {
      "id":               "fr_01",
      "name":             "Apana Service Pune",
      "owner":            "Vijay Kulkarni",
      "city":             "Pune",
      "address":          "...",
      "phone":            "+91...",
      "status":           "active",
      "sellers_registered_mtd": 48,
      "revenue_mtd":      120000.00
    }
  ]
}
```

### POST /admin/franchises
> Create new franchise location
```
Body:
{
  "name":          "Apana Service Mumbai",
  "owner_name":    "Rajesh Mehta",
  "owner_phone":   "+91...",
  "city":          "Mumbai",
  "address":       { ... },
  "license_fee":   50000.00,    // one-time franchise fee
  "revenue_share": 0.15         // 15% of seller registration revenue
}
```

### GET /admin/franchises/:id/activity
> All seller registrations, sales activities, agents

---

## CATALOG CONTROL

### POST /admin/catalog/categories
> Add new top-level category (visible in all apps)

### PUT /admin/catalog/categories/:id
### DELETE /admin/catalog/categories/:id

### POST /admin/catalog/banners
> Create promo banners for home screen
```
Body:
{
  "image_url":  "...",
  "target":     "category",
  "target_id":  "grocery",
  "cities":     ["pune", "mumbai"],   // null = all cities
  "starts_at":  "2025-05-01T00:00:00Z",
  "expires_at": "2025-05-31T00:00:00Z"
}
```

### GET /admin/catalog/products/flagged
> Products flagged by customers as fake/incorrect

---

## ANALYTICS

### GET /admin/analytics/cities?metric=orders|gmv|users&period={}
### GET /admin/analytics/categories?period={}
### GET /admin/analytics/partners/performance
### GET /admin/analytics/sellers/top?city={}&period={}
### GET /admin/analytics/funnel
> Order funnel: browse → cart → checkout → placed → delivered

---

## SYSTEM CONTROL

### GET /admin/system/health
> Health check for all microservices

```
Response 200:
{
  "services": {
    "auth-service":         "healthy",
    "order-service":        "healthy",
    "partner-service":      "healthy",
    "notification-service": "degraded",   // ← ops should investigate
    "payment-service":      "healthy"
  },
  "database": "healthy",
  "redis":     "healthy",
  "timestamp": "2025-04-17T10:00:00Z"
}
```

### POST /admin/system/announcements
> Send announcement to all users of a specific app
```
Body:
{
  "target_app":  "customer",          // "customer" | "seller" | "partner" | "all"
  "target_city": "pune",              // null = all cities
  "title":       "Maintenance Notice",
  "body":        "App will be down 2-3 AM tonight for updates",
  "channel":     ["push", "sms"]      // push | sms | whatsapp | email
}
```

### PUT /admin/system/config/:key
> Update live config values without deployment
> Examples: commission_rate, max_delivery_radius_km, flash_deal_duration_hours

---

## AUDIT LOG

### GET /admin/audit?user_id={}&action={}&from={}&to={}&page={}
> Every admin action is logged

```
Response 200:
{
  "logs": [
    {
      "id":         "log_01",
      "admin_id":   "admin_01",
      "admin_name": "Hemant (Super Admin)",
      "action":     "suspend_seller",
      "target":     "seller_abc",
      "data":       { "reason": "Complaints" },
      "ip":         "103.xxx.xxx.xxx",
      "at":         "2025-04-17T09:30:00Z"
    }
  ]
}
```
