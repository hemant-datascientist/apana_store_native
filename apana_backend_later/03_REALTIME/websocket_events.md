# WebSocket & Real-Time Events — Apana Platform

> WebSocket server: `wss://rt.apanastore.in`
> Auth: pass JWT as query param `?token=<access_token>` on connect
> Library: **Socket.IO** (handles reconnection, rooms, namespaces automatically)

---

## NAMESPACES

```
/customer   — Apana Store customer app
/seller     — Apana Seller app
/partner    — Apana Partner app
/admin      — Admin Panel live dashboard
```

---

## ROOMS (Channel grouping)

| Room key | Who joins | Purpose |
|----------|-----------|---------|
| `order:{order_id}` | customer, seller, assigned partner, admin | Order lifecycle events |
| `store:{store_id}` | seller, ops admin | New orders for a store |
| `partner:{partner_id}` | partner | Personal trip/task assignments |
| `city:{city_slug}` | admin | City-level live metrics |
| `trip:{trip_id}` | customer (to track partner) | Live GPS of partner |

---

## EVENTS — ORDER LIFECYCLE

All parties in the `order:{order_id}` room receive these events:

### → Server emits: `order.status_changed`
> Triggered whenever order status changes

```json
{
  "event":    "order.status_changed",
  "order_id": "ord_01J9XXXXXX",
  "status":   "out_for_delivery",
  // Valid statuses:
  // placed → accepted_by_seller → preparing → ready_for_pickup
  // → partner_assigned → picked_up → out_for_delivery → delivered
  // → cancelled | failed
  "at":       "2025-04-17T10:18:00Z",
  "message":  "Ravi Kumar has picked up your order"
}
```

### → Server emits: `order.partner_assigned`
> Customer receives partner details when delivery is assigned

```json
{
  "event":    "order.partner_assigned",
  "order_id": "ord_01",
  "partner": {
    "id":       "partner_01",
    "name":     "Ravi Kumar",
    "phone":    "+919123456789",
    "vehicle":  "Honda Activa MH12AB1234",
    "rating":   4.8,
    "photo_url": null
  },
  "eta_min":  12
}
```

### → Client emits (seller): `order.accept`
```json
{ "order_id": "ord_01", "eta_min": 20 }
```

### → Client emits (seller): `order.reject`
```json
{ "order_id": "ord_01", "reason": "Out of stock" }
```

### → Client emits (seller): `order.ready`
> Food/item is ready for pickup
```json
{ "order_id": "ord_01" }
```

---

## EVENTS — LIVE PARTNER GPS TRACKING

> **Frontend:** `app/(tabs)/index.tsx` (track order button), Partner app location push
> **Room:** `trip:{trip_id}` for customer tracking | partner pushes to server

### → Client emits (partner app, every 3 seconds): `partner.location.update`
```json
{
  "partner_id": "partner_01",
  "trip_id":    "trip_01",
  "lat":        18.5234,
  "lng":        73.8512,
  "heading":    145,
  "speed_kmh":  22,
  "at":         "2025-04-17T10:20:03Z"
}
```

### → Server broadcasts to `trip:{trip_id}` room: `partner.location`
> Customer app receives this to update map marker

```json
{
  "event":      "partner.location",
  "partner_id": "partner_01",
  "lat":        18.5234,
  "lng":        73.8512,
  "heading":    145,
  "eta_min":    8
}
```

### → Server emits to customer: `partner.nearby`
> When partner is within 500m of customer location
```json
{
  "event":      "partner.nearby",
  "distance_m": 480,
  "message":    "Your delivery partner is almost here!"
}
```

---

## EVENTS — NEW ORDER NOTIFICATIONS

### → Server emits to `store:{store_id}` room: `store.new_order`
> Seller app receives incoming order alert

```json
{
  "event":    "store.new_order",
  "order_id": "ord_01",
  "customer_name": "Hemant L.",
  "items_count":   3,
  "total":         210.00,
  "notes":         "Ring doorbell",
  "expires_in":    60,            // seconds to accept before auto-cancel
  "items": [
    { "name": "Amul Milk 500ml", "qty": 2 },
    { "name": "Bread",           "qty": 1 }
  ]
}
```

### → Server emits to `partner:{partner_id}` room: `partner.trip_request`
> Nearby partner receives delivery assignment

```json
{
  "event":    "partner.trip_request",
  "trip_id":  "trip_01",
  "type":     "delivery",
  "store": {
    "name":     "Sharma General Store",
    "address":  "Shivajinagar",
    "lat":      18.5200,
    "lng":      73.8567,
    "distance_km": 0.8
  },
  "dropoff_distance_km": 2.1,
  "payout":    35.00,
  "expires_in": 30
}
```

---

## EVENTS — RIDE HAILING (Apana Partner — Rider)

### → Client emits (customer booking ride): `ride.request`
```json
{
  "pickup_lat":   18.5200,
  "pickup_lng":   73.8567,
  "pickup_label": "Shivajinagar Bus Stand",
  "drop_lat":     18.5290,
  "drop_lng":     73.8450,
  "drop_label":   "FC Road",
  "vehicle_type": "auto"
}
```

### → Server emits to nearby riders: `ride.available`
```json
{
  "event":    "ride.available",
  "ride_id":  "ride_01",
  "pickup":   { "label": "Shivajinagar", "distance_km": 1.2 },
  "drop":     { "label": "FC Road" },
  "distance_km": 3.8,
  "fare":     85.00,
  "expires_in": 25
}
```

### → Client emits (rider): `ride.accept`
```json
{ "ride_id": "ride_01" }
```

### → Server emits to customer: `ride.accepted`
```json
{
  "event":  "ride.accepted",
  "rider": {
    "name":     "Sunil Patil",
    "phone":    "+91...",
    "vehicle":  "Maruti Swift MH14CD5678",
    "rating":   4.9
  },
  "eta_min": 5
}
```

---

## EVENTS — LIVE STORE COUNTS

> **Frontend:** `components/home/HomeHeader.tsx` → `storesLive` count
> Uses SSE (Server-Sent Events) not WebSocket — one-directional, lighter

### SSE Endpoint: GET /sse/stores-live?city={slug}
```
Content-Type: text/event-stream

// Server pushes every 30 seconds:
data: {"city":"pune","stores_live":410,"at":"2025-04-17T10:00:00Z"}

data: {"city":"pune","stores_live":412,"at":"2025-04-17T10:00:30Z"}
```

---

## EVENTS — ADMIN LIVE DASHBOARD

### → Server emits to admin namespace: `admin.metrics_tick`
> Every 10 seconds

```json
{
  "event":             "admin.metrics_tick",
  "active_orders":     78,
  "active_partners":   134,
  "customers_online":  1203,
  "revenue_last_hour": 18400.00,
  "new_orders_last_minute": 12
}
```

### → Server emits to admin: `admin.alert`
```json
{
  "event":    "admin.alert",
  "severity": "warning",
  "type":     "high_cancellation",
  "message":  "Store 'Gupta Electronics' has 40% cancellation rate in last 1 hour",
  "data":     { "store_id": "store_77" }
}
```

---

## EVENTS — NOTIFICATIONS (Push / In-App)

> Push notifications (FCM/APNs) are sent by `notification-service` via gRPC call from other services.
> They appear as local notifications on the device — not WebSocket.
> In-app notifications (bell icon) are fetched via REST: `GET /notifications`

### Notification types and their triggers

| Type | Trigger | Recipient |
|------|---------|-----------|
| `order_placed` | Customer places order | Seller |
| `order_accepted` | Seller accepts | Customer |
| `partner_assigned` | Partner assigned | Customer |
| `out_for_delivery` | Partner picks up | Customer |
| `delivered` | Order delivered | Customer, Seller |
| `order_cancelled` | Any cancellation | Customer, Seller, Partner |
| `trip_request` | New delivery available | Partner |
| `ride_request` | New ride available | Rider |
| `payment_received` | Payout processed | Seller, Partner |
| `booking_confirmed` | Service booking | Customer |
| `booking_reminder` | 30 min before service | Customer |
| `otp` | Login | Customer, Seller, Partner |
| `account_suspended` | Admin action | Any |

---

## CONNECTION LIFECYCLE

```
// Client connects
Client → WSS connect with token
Server → validates JWT
Server → joins client to relevant rooms based on role + active orders/trips

// Heartbeat — keep connection alive
Client → ping every 25 seconds
Server → pong

// Reconnection
Socket.IO handles auto-reconnect with exponential backoff
On reconnect: re-emit any pending events that weren't ACK'd

// Disconnect
Client → disconnect (app backgrounded, network lost)
Server → marks partner as "last_seen" in Redis
          → if partner offline > 5 min, sets is_online=false
```
