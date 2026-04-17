# Apana Backend — Master Reference

> **Purpose:** This folder is the single source of truth for the entire Apana ecosystem backend.
> Every time the frontend touches something API-related (mock data, Alert placeholders, context hooks),
> the corresponding spec in this folder is updated alongside it.
>
> **Status:** Frontend-first development. All backend specs are written as contracts so the
> real backend can be built without re-reading the frontend code.

---

## Ecosystem Overview

| App | Users | Status |
|-----|-------|--------|
| **Apana Store** | Buyers — nearby q-commerce & e-commerce | Frontend in progress |
| **Apana Seller** | Retailers, Wholesale, Food, Service-based sellers | Frontend partial |
| **Apana Partner** | Delivery Boys, Riders, Logistics | Frontend complete |
| **Apana Service** | Offline franchise offices + sales team | Not started |
| **Admin Panel** | Founder + ops team — full India control | Not started |

---

## Folder Structure

```
apana_backend_later/
│
├── README.md                          ← You are here. Master index.
├── 00_ECOSYSTEM_ARCHITECTURE.md       ← Full system design, protocols, data flow
├── 01_AUTH_AND_SECURITY.md            ← JWT, OTP, roles, permissions across all apps
│
├── 02_REST_API/
│   ├── store_customer.md              ← All endpoints for Apana Store customer app
│   ├── seller.md                      ← All endpoints for Apana Seller app
│   ├── seller_special_cases.md        ← Food (non-inventory) + Service seller APIs
│   ├── partner.md                     ← All endpoints for Apana Partner app
│   ├── service_portal.md              ← Apana Service franchise + sales team portal
│   └── admin_panel.md                 ← Admin Panel full control APIs
│
├── 03_REALTIME/
│   ├── websocket_events.md            ← All WebSocket events across all apps
│   └── sse_streams.md                 ← Server-Sent Events (live counts, dashboards)
│
├── 04_GRAPHQL/
│   └── schema.md                      ← GraphQL schema for product/store discovery
│
├── 05_gRPC/
│   └── internal_services.md           ← gRPC protos for microservice communication
│
├── 06_DATABASE/
│   ├── schema_overview.md             ← Full DB schema: tables, types, relations
│   └── indexes_and_performance.md     ← Query optimization notes
│
├── 07_ONDC/
│   └── integration.md                 ← ONDC network protocol, buyer/seller NPs
│
├── 08_THIRD_PARTY/
│   └── integrations.md                ← Payments, SMS, Maps, GS1, FSSAI, etc.
│
└── 09_DEPLOYMENT/
    └── infrastructure.md              ← Server, CDN, CI/CD, scaling plan
```

---

## Protocol Decision Map

| Use Case | Protocol | Why |
|----------|----------|-----|
| Standard CRUD (products, orders, users) | **REST** | Simple, cacheable, widely supported |
| Product/Store discovery with filters | **GraphQL** | Flexible queries, avoid over-fetching |
| Real-time order tracking, partner GPS | **WebSocket** | Bidirectional, low-latency |
| Live dashboards, store counts | **SSE** | Server-push, lightweight |
| Internal microservice calls (auth, payments) | **gRPC** | Binary, fast, typed contracts |
| Bank/Government integrations (ONDC, GST) | **REST/SOAP** | Required by their specs |

---

## How to Use This Folder

1. **Frontend dev adds a mock** → add the corresponding endpoint spec to the right file in `02_REST_API/`
2. **Frontend uses WebSocket event** → add event name + payload to `03_REALTIME/websocket_events.md`
3. **A new entity is designed** → add table to `06_DATABASE/schema_overview.md`
4. **Any third-party is needed** → document in `08_THIRD_PARTY/integrations.md`

---

## Quick Links by Frontend File

| Frontend File | Backend Spec |
|---------------|-------------|
| `data/homeData.ts` | `02_REST_API/store_customer.md` → `/api/customer/home` |
| `data/allFeedData.ts` | `02_REST_API/store_customer.md` → `/api/customer/home/trending` |
| `data/addressData.ts` | `02_REST_API/store_customer.md` → `/api/customer/addresses` |
| `data/favouriteData.ts` | `02_REST_API/store_customer.md` → `/api/customer/favourites` |
| `data/profileData.ts` | `02_REST_API/store_customer.md` → `/api/customer/profile` |
| `context/LocationContext.tsx` | `02_REST_API/store_customer.md` → `/api/customer/active-address` |
| Partner GPS tracking | `03_REALTIME/websocket_events.md` → `partner.location.update` |
| Seller inventory | `02_REST_API/seller.md` → `/api/seller/inventory` |
| Food/Service seller | `02_REST_API/seller_special_cases.md` |
