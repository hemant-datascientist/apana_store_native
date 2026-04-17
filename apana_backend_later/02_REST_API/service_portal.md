# REST API — Apana Service (Franchise Portal + Sales Team)

> Apana Service is the offline arm of the Apana ecosystem.
> It's a franchise business where franchise owners run physical offices
> that help local sellers register, get trained, and buy equipment.
>
> Base URL: `https://api.apanastore.in/api/service`
> App scope: `app=service`
> Roles: `franchise_owner` | `sales_agent`
>
> Portal: web-based (React web app) + mobile for field agents

---

## FRANCHISE MANAGEMENT

### GET /service/franchise/me
> Franchise owner sees their own franchise details

```
Response 200:
{
  "id":                   "fr_01",
  "name":                 "Apana Service Pune",
  "owner_name":           "Vijay Kulkarni",
  "city":                 "Pune",
  "address":              { ... },
  "phone":                "+91...",
  "status":               "active",
  "license_fee_paid":     true,
  "revenue_share_pct":    15,             // 15% of each seller registration fee
  "active_since":         "2025-01-01",
  "stats": {
    "sellers_registered_total":  142,
    "sellers_registered_mtd":    18,
    "revenue_mtd_inr":           90000.00,
    "active_agents":             5
  }
}
```

---

## SELLER REGISTRATION (Offline)

> A sales agent visits a local seller, helps them register, takes documents.

### POST /service/sellers/register
> Register a new seller on behalf of the franchise

```
Body:
{
  "agent_id":       "agent_01",          // the agent doing the registration
  "business_name":  "Sharma Grocery",
  "owner_name":     "Ramesh Sharma",
  "phone":          "+919876543210",
  "seller_type":    "retail",
  "category":       "Grocery",
  "address": {
    "line1":   "Shop 4, Market Yard",
    "city":    "Pune",
    "state":   "Maharashtra",
    "pincode": "411037",
    "lat":     18.5200,
    "lng":     73.8567
  },
  "gstin":          "27XXXXX",            // optional
  "fssai_license":  null,                 // required for food sellers
  "registration_fee_paid": true,
  "payment_mode":   "cash",              // "cash" | "upi" | "card"
  "payment_ref":    "CASH-001"
}

Response 201:
{
  "seller_id":          "seller_abc",
  "registration_code":  "APR-2025-1234",   // unique code given to seller
  "franchise_revenue":  2250.00,            // franchise's 15% cut
  "platform_revenue":   12750.00,
  "next_steps": [
    "Upload documents for verification",
    "Complete product catalog setup",
    "Attend online training session"
  ]
}
```

### GET /service/sellers?status=active|pending|rejected&page={}
> List all sellers registered by this franchise

```
Response 200:
{
  "sellers": [
    {
      "id":                "seller_abc",
      "business_name":     "Sharma Grocery",
      "owner_name":        "Ramesh Sharma",
      "phone":             "+91...",
      "seller_type":       "retail",
      "status":            "active",
      "registered_by":     "agent_01",
      "registered_at":     "2025-04-01T10:00:00Z",
      "first_order_at":    "2025-04-05T14:30:00Z",
      "total_orders":      48
    }
  ],
  "total": 142
}
```

### GET /service/sellers/:id/health
> Health check on a registered seller — are they active, selling?

```
Response 200:
{
  "seller_id":     "seller_abc",
  "is_active":     true,
  "days_since_last_order": 2,
  "status":        "healthy",           // healthy | at_risk | churned
  "recommendations": [
    "Add more product photos to increase conversion",
    "Enable flash deals to drive weekend traffic"
  ]
}
```

---

## SALES AGENTS

### GET /service/agents
> List all agents under this franchise

```
Response 200:
{
  "agents": [
    {
      "id":                  "agent_01",
      "name":                "Priya Desai",
      "phone":               "+91...",
      "status":              "active",
      "sellers_registered":  28,
      "revenue_generated":   168000.00,
      "this_month":          5
    }
  ]
}
```

### POST /service/agents
> Add a new sales agent to the franchise

```
Body:
{
  "name":   "Priya Desai",
  "phone":  "+91...",
  "email":  "priya@example.com",
  "area":   "Kothrud, Pune"   // assigned territory
}
Response 201: { "agent_id": "agent_01", "temp_password": "xxxx" }
```

### GET /service/agents/:id/performance?period=week|month
```
Response 200:
{
  "agent_id":              "agent_01",
  "period":                "month",
  "sellers_registered":    5,
  "revenue_generated":     30000.00,
  "sellers_active":        4,         // of all-time registered, how many still active
  "churn_rate":            0.07,      // 7% of registered sellers churned
  "incentive_earned":      4500.00    // agent's bonus this month
}
```

---

## EQUIPMENT SALES

> Apana Service sells physical equipment to sellers

### GET /service/equipment
> Available equipment catalog

```
Response 200:
{
  "equipment": [
    {
      "id":          "eq_01",
      "name":        "POS Machine",
      "description": "Bluetooth thermal printer + card reader",
      "price":       4999.00,
      "rental":      299.00,          // per month rental option
      "in_stock":    true
    },
    {
      "id":          "eq_02",
      "name":        "Price Tag Maker",
      "description": "Label printer for product price tags",
      "price":       2499.00,
      "rental":      149.00,
      "in_stock":    true
    },
    {
      "id":          "eq_03",
      "name":        "Barcode Scanner",
      "description": "1D/2D USB + Bluetooth scanner",
      "price":       1899.00,
      "rental":      99.00,
      "in_stock":    true
    },
    {
      "id":          "eq_04",
      "name":        "Catalogue Maker Kit",
      "description": "Camera stand + lighting + QR catalog setup",
      "price":       8999.00,
      "rental":      499.00,
      "in_stock":    false
    }
  ]
}
```

### POST /service/equipment/sell
> Record an equipment sale to a seller

```
Body:
{
  "seller_id":   "seller_abc",
  "agent_id":    "agent_01",
  "equipment_id":"eq_01",
  "type":        "purchase",        // "purchase" | "rental"
  "amount_paid": 4999.00,
  "payment_mode":"upi",
  "payment_ref": "UPI-REF-XYZ"
}
Response 201: { "sale_id": "sale_01", "invoice_url": "..." }
```

---

## TRAINING MANAGEMENT

### GET /service/training/sessions
> Available training sessions for sellers

```
Response 200:
{
  "sessions": [
    {
      "id":          "session_01",
      "title":       "Getting Started with Apana Seller App",
      "type":        "online",        // "online" | "offline"
      "date":        "2025-05-01",
      "time":        "11:00 AM",
      "duration":    "2 hours",
      "trainer":     "Apana Team",
      "meet_link":   "https://meet.google.com/xxx",
      "enrolled":    12,
      "capacity":    30
    }
  ]
}
```

### POST /service/training/enroll
```
Body: { "seller_id": "seller_abc", "session_id": "session_01" }
Response 201: { "enrollment_id": "enr_01", "confirmation": "SMS sent to seller" }
```

---

## FRANCHISE REVENUE

### GET /service/revenue?period=today|week|month|custom
```
Response 200:
{
  "period":                "month",
  "seller_registrations":  18,
  "registration_revenue":  90000.00,    // 18 × ₹5000 × 15% = ₹13500 + base fees
  "equipment_sales":       8,
  "equipment_revenue":     32000.00,
  "training_revenue":      6000.00,
  "total_revenue":         128000.00,
  "pending_payouts":       0.00
}
```

---

## APANA SERVICE WEBSITE PORTAL

> Website: https://service.apanastore.in
> For: Franchise owners to manage their franchise online
>     Potential sellers to learn about becoming a seller
>     People interested in becoming a franchise owner

### Public pages (no auth):
```
GET /service-portal/                    → Landing page
GET /service-portal/become-seller       → How to register as a seller
GET /service-portal/become-franchise    → Franchise opportunity page
GET /service-portal/locate              → Find nearest Apana Service office
GET /service-portal/equipment           → Equipment catalog (public)
```

### API for public site:
```
GET  /api/service/public/offices?city={}     → List franchise offices in a city
POST /api/service/public/inquiry             → Contact form (potential sellers/franchise)
  Body: { name, phone, city, interest: "seller"|"franchise" }
```
