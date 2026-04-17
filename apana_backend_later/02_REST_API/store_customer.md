# REST API — Apana Store (Customer App)

> Base URL: `https://api.apanastore.in/api/customer`
> All endpoints require `Authorization: Bearer <access_token>` unless marked 🔓 (public).
> Frontend mock file → API mapping listed for each endpoint.

---

## AUTH
→ See `01_AUTH_AND_SECURITY.md` for OTP login flow.
- App scope: `app=customer`

---

## HOME SCREEN

### 🔓 GET /home
> **Frontend:** `data/homeData.ts` → `MOCK_LOCATION`, `STORES_LIVE_COUNT`, `BANNERS`
> Replace all home screen mocks with this single call on app load.

```
Response 200:
{
  "location": {                    // based on user's active address or GPS
    "area":    "Pune",
    "state":   "Maharashtra",
    "pincode": "411038"
  },
  "stores_live_count": 410,
  "banners": [
    {
      "id":        "ban_01",
      "image_url": "https://cdn.apanastore.in/banners/summer.jpg",
      "target":    "category",    // "category" | "store" | "external_url"
      "target_id": "grocery",
      "expires_at": "2025-07-01T00:00:00Z"
    }
  ]
}
```

### 🔓 GET /home/trending?city={slug}
> **Frontend:** `data/allFeedData.ts` → `CITY_TRENDING`, `getTrendingForCity()`
> `slug` = city name lowercased e.g. "pune", "mumbai", "delhi"

```
Response 200:
{
  "city": "Pune",
  "items": [
    {
      "id":   "t_pune_01",
      "name": "Misal Pav",
      "tag":  "Famous Dish",
      "icon": "restaurant-outline",   // Ionicons glyph (temp, replace with image_url)
      "bg":   "#FEF3C7",
      "image_url": null               // null until real images uploaded
    }
  ]
}
```

### 🔓 GET /home/seasonal?season={slug}
> **Frontend:** `data/allFeedData.ts` → `SUMMER_CATEGORIES`

```
Response 200:
{
  "season": "Summer",
  "categories": [
    {
      "key":       "suncare",
      "label":     "Sun Care",
      "icon":      "sunny-outline",
      "bg":        "#FEF9C3",
      "image_url": null
    }
  ]
}
```

### 🔓 GET /home/feed?city={slug}&section={key}
> Returns data for individual home feed sections.
> `section` values: `daily_essentials` | `flash_deals` | `new_arrivals` | `popular_stores`
> **Frontend:** `data/allFeedData.ts` → `DAILY_ESSENTIALS`, `FLASH_DEALS`, `NEW_ARRIVALS`, `POPULAR_STORES`

```
// section=daily_essentials or section=new_arrivals
Response 200:
{
  "section": "daily_essentials",
  "products": [
    {
      "id":          "prod_01",
      "name":        "Amul Milk 500ml",
      "unit":        "500 ml",
      "price":       30,
      "icon":        "cafe-outline",
      "bg":          "#FEF3C7",
      "badge":       "Essential",
      "image_url":   null,
      "store_id":    "store_01",
      "in_stock":    true
    }
  ]
}

// section=flash_deals
Response 200:
{
  "section": "flash_deals",
  "ends_at": "2025-05-01T18:00:00Z",
  "deals": [
    {
      "id":             "deal_01",
      "name":           "Surf Excel 1kg",
      "unit":           "1 kg",
      "price":          189,
      "original_price": 250,
      "discount_pct":   25,
      "icon":           "sparkles-outline",
      "bg":             "#FEE2E2",
      "image_url":      null,
      "store_id":       "store_03",
      "in_stock":       true
    }
  ]
}

// section=popular_stores
Response 200:
{
  "section": "popular_stores",
  "stores": [
    {
      "id":           "store_01",
      "name":         "Sharma General Store",
      "category":     "Grocery",
      "area":         "Shivajinagar",
      "rating":       4.8,
      "icon":         "basket-outline",
      "bg":           "#D1FAE5",
      "badge":        "Top Rated",
      "badge_bg":     "#DCFCE7",
      "badge_color":  "#15803D",
      "open":         true,
      "distance_km":  1.2
    }
  ]
}
```

---

## PROFILE

### GET /profile
> **Frontend:** `data/profileData.ts` → `MOCK_USER`, `PROFILE_STATS`

```
Response 200:
{
  "id":     "usr_01J9XXXXXX",
  "name":   "Hemant Lokhande",
  "phone":  "+919876543210",
  "email":  "hemant@example.com",
  "avatar_url": null,
  "stats": {
    "total_orders":   24,
    "fav_stores":     7,
    "total_rides":    12
  },
  "created_at": "2024-01-15T10:30:00Z"
}
```

### PUT /profile
> Update profile details

```
Body:
{
  "name":   "Hemant Lokhande",
  "email":  "hemant@example.com"
}
Response 200: { "user": UserObject }
```

### POST /profile/avatar
> Upload profile photo
```
Body: multipart/form-data { file: <image> }
Response 200: { "avatar_url": "https://cdn.apanastore.in/avatars/usr_01.jpg" }
```

---

## ADDRESSES

### GET /addresses
> **Frontend:** `data/addressData.ts` → `SAVED_ADDRESSES`

```
Response 200:
{
  "addresses": [
    {
      "id":       "addr_1",
      "label":    "Home",
      "icon":     "home-outline",
      "name":     "Hemant Lokhande",
      "line1":    "Flat 203, Sai Residency",
      "line2":    "Kothrud",
      "city":     "Pune",
      "state":    "Maharashtra",
      "pincode":  "411038",
      "lat":      18.5018,
      "lng":      73.8236,
      "is_default": true
    }
  ]
}
```

### POST /addresses
> Add new address

```
Body:
{
  "label":    "Office",
  "icon":     "business-outline",
  "name":     "Hemant Lokhande",
  "line1":    "Tech Park, Hinjewadi",
  "line2":    "Phase 1",
  "city":     "Pune",
  "state":    "Maharashtra",
  "pincode":  "411057",
  "lat":      18.5913,
  "lng":      73.7383
}
Response 201: { "address": AddressObject }
```

### PUT /addresses/:id
> Update an existing address
```
Body: Partial<AddressObject>
Response 200: { "address": AddressObject }
```

### DELETE /addresses/:id
```
Response 204: (no body)
```

### PUT /addresses/:id/set-default
> **Frontend:** `context/LocationContext.tsx` → `setSelectedAddress()`
```
Response 200: { "message": "Default address updated" }
```

### GET /active-address
> **Frontend:** `context/LocationContext.tsx` → initial load
```
Response 200: { "address": AddressObject }
```

---

## FAVOURITES

### GET /favourites/stores
> **Frontend:** `data/profileData.ts` → `FAVOURITE_STORES`

```
Response 200:
{
  "stores": [
    {
      "id":        "store_01",
      "name":      "Sharma General Store",
      "category":  "Grocery",
      "area":      "Shivajinagar",
      "icon":      "basket-outline",
      "open":      true,
      "rating":    "4.8"
    }
  ]
}
```

### GET /favourites/riders
> **Frontend:** `data/favouriteData.ts` → `FAVOURITE_RIDERS`

```
Response 200:
{
  "riders": [
    {
      "id":          "r1",
      "name":        "Sunil Patil",
      "phone":       "+919345678901",
      "vehicle":     "Maruti Swift",
      "vehicle_no":  "MH 14 CD 5678",
      "rating":      4.9,
      "total_rides": 312,
      "badge":       "Top Rated",
      "badge_color": "#15803D",
      "badge_bg":    "#DCFCE7",
      "avatar_bg":   "#DBEAFE",
      "available":   true
    }
  ]
}
```

### GET /favourites/delivery
> **Frontend:** `data/favouriteData.ts` → `FAVOURITE_DELIVERIES`

```
Response 200:
{
  "delivery_partners": [
    {
      "id":                 "d1",
      "name":               "Ravi Kumar",
      "phone":              "+919123456789",
      "vehicle":            "Honda Activa",
      "vehicle_no":         "MH 12 AB 1234",
      "rating":             4.8,
      "total_deliveries":   540,
      "avg_delivery_time":  "18 min",
      "badge":              "Top Rated",
      "badge_color":        "#15803D",
      "badge_bg":           "#DCFCE7",
      "avatar_bg":          "#FEE2E2",
      "available":          true
    }
  ]
}
```

### GET /favourites/products
> **Frontend:** `app/favourite.tsx` → Products tab (currently empty state)

```
Response 200:
{
  "products": [
    {
      "id":        "prod_01",
      "name":      "Amul Milk 500ml",
      "price":     30,
      "unit":      "500 ml",
      "image_url": null,
      "store_id":  "store_01",
      "in_stock":  true
    }
  ]
}
```

### POST /favourites/{type}
> `type` = stores | riders | delivery | products

```
Body: { "target_id": "store_01" }
Response 201: { "message": "Added to favourites" }
```

### DELETE /favourites/{type}/:target_id
```
Response 204: (no body)
```

---

## ORDERS

### POST /orders
> Place a new order

```
Body:
{
  "store_id":       "store_01",
  "address_id":     "addr_1",
  "items": [
    {
      "product_id": "prod_01",
      "quantity":   2,
      "variant_id": null        // null if no variants
    }
  ],
  "payment_method": "upi",      // "upi" | "card" | "wallet" | "cod"
  "coupon_code":    null,
  "notes":          "Please ring doorbell"
}

Response 201:
{
  "order_id":       "ord_01J9XXXXXX",
  "status":         "placed",
  "total":          210,
  "estimated_time": "25-30 min",
  "payment": {
    "method":       "upi",
    "status":       "pending",
    "razorpay_order_id": "order_XXXXX"  // for UPI/card payment flow
  }
}
```

### GET /orders
> Order history

```
Query params: ?status=all|active|completed|cancelled&page=1&limit=20

Response 200:
{
  "orders": [OrderSummary[]],
  "total":  24,
  "page":   1,
  "pages":  2
}
```

### GET /orders/:id
> Order detail with live status

```
Response 200:
{
  "id":         "ord_01J9XXXXXX",
  "status":     "out_for_delivery",
  "store":      { ... },
  "items":      [ ... ],
  "partner":    {
    "id":       "partner_01",
    "name":     "Ravi Kumar",
    "phone":    "+91...",
    "vehicle":  "Honda Activa MH12AB1234",
    "rating":   4.8
  },
  "timeline": [
    { "status": "placed",           "at": "2025-04-17T10:00:00Z" },
    { "status": "accepted",         "at": "2025-04-17T10:02:00Z" },
    { "status": "preparing",        "at": "2025-04-17T10:05:00Z" },
    { "status": "out_for_delivery", "at": "2025-04-17T10:18:00Z" }
  ],
  "total":      210,
  "address":    { ... }
}
```

### POST /orders/:id/cancel
```
Body:    { "reason": "Changed my mind" }
Response 200: { "status": "cancelled", "refund_status": "initiated" }
```

### POST /orders/:id/rate
> Rate order + delivery partner after completion

```
Body:
{
  "order_rating":   5,
  "order_review":   "Fresh items, quick delivery",
  "partner_rating": 4,
  "partner_review": "Friendly"
}
Response 200: { "message": "Rating submitted" }
```

---

## STORE DISCOVERY

### 🔓 GET /stores?lat={}&lng={}&radius={km}&category={}&sort={}
> **Frontend:** `components/home/stores/NearbyStoresFeed.tsx`

```
Query params:
  lat, lng:   float   (user GPS)
  radius:     int     (km, default 5)
  category:   string  (optional filter)
  sort:       "nearest" | "top_rated" | "live_only"
  page:       int
  limit:      int (default 20)

Response 200:
{
  "stores": [
    {
      "id":           "store_01",
      "name":         "Sharma General Store",
      "category":     "Grocery",
      "area":         "Shivajinagar",
      "rating":       4.8,
      "review_count": 120,
      "distance_km":  1.2,
      "is_live":      true,
      "open":         true,
      "image_url":    null,
      "lat":          18.5200,
      "lng":          73.8567,
      "badge":        "Top Rated"
    }
  ],
  "total": 47
}
```

### 🔓 GET /stores/:id
> Full store profile

```
Response 200:
{
  "id":           "store_01",
  "name":         "Sharma General Store",
  "owner_name":   "Ramesh Sharma",
  "phone":        "+91...",        // shown to customers
  "category":     "Grocery",
  "address":      { ... },
  "rating":       4.8,
  "total_orders": 1200,
  "open":         true,
  "open_hours":   "8:00 AM – 10:00 PM",
  "description":  "Best grocery store in Shivajinagar since 2005",
  "images":       [],
  "products":     []               // paginated separately
}
```

### 🔓 GET /stores/:id/products?category={}&page={}&limit={}
> Products of a specific store

---

## PRODUCT FINDER

### 🔓 GET /products/search?q={query}&city={}&category={}
> **Frontend:** `app/product-finder.tsx` → "Look up by product name"

```
Response 200:
{
  "query": "amul milk",
  "products": [
    {
      "id":         "prod_01",
      "name":       "Amul Milk 500ml",
      "price":      30,
      "store":      { "id": "store_01", "name": "Sharma General", "distance_km": 1.2 },
      "in_stock":   true,
      "verified":   true,           // GS1 verified
      "gtin":       "8901058001178" // GS1 barcode
    }
  ]
}
```

### 🔓 POST /products/scan
> **Frontend:** `app/product-finder.tsx` → "Scan products" → uses scanner.tsx result

```
Body: { "barcode": "8901058001178", "type": "ean13" }

Response 200:
{
  "found": true,
  "product": {
    "id":         "prod_01",
    "name":       "Amul Milk 500ml",
    "brand":      "Amul",
    "gtin":       "8901058001178",
    "verified_by": ["gs1", "fssai"],
    "stores_nearby": [
      { "store_id": "store_01", "price": 30, "in_stock": true, "distance_km": 1.2 }
    ]
  }
}
```

---

## STORE QR

### 🔓 POST /stores/qr-scan
> **Frontend:** `app/store-qr.tsx` → scanned QR result

```
Body: { "qr_data": "apanastore://store/store_01" }

Response 200:
{
  "store_id":   "store_01",
  "store_name": "Sharma General Store",
  "redirect":   "/stores/store_01"
}

Response 404: { "error": "Store not found" }
```

---

## WALLET

### GET /wallet
```
Response 200:
{
  "balance":      250.00,
  "currency":     "INR",
  "transactions": [
    {
      "id":        "txn_01",
      "type":      "credit",   // "credit" | "debit"
      "amount":    100.00,
      "note":      "Refund for order ord_01",
      "at":        "2025-04-15T10:00:00Z"
    }
  ]
}
```

### POST /wallet/add
```
Body: { "amount": 500, "payment_method": "upi" }
Response 200: { "razorpay_order_id": "order_XXXXX" }
```

---

## NOTIFICATIONS

### GET /notifications?page=1&limit=20
```
Response 200:
{
  "notifications": [
    {
      "id":      "notif_01",
      "type":    "order_update",
      "title":   "Order Out for Delivery",
      "body":    "Ravi Kumar is on the way",
      "data":    { "order_id": "ord_01" },
      "read":    false,
      "at":      "2025-04-17T10:18:00Z"
    }
  ],
  "unread_count": 3
}
```

### PUT /notifications/:id/read
```
Response 200: { "message": "Marked as read" }
```

### PUT /notifications/read-all
```
Response 200: { "message": "All marked as read" }
```
