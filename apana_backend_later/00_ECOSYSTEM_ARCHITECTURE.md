# Ecosystem Architecture — Apana Platform

## 1. Bird's-Eye View

```
┌─────────────────────────────────────────────────────────────────────┐
│                         APANA PLATFORM                               │
│                                                                       │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐             │
│  │  Apana Store │   │ Apana Seller │   │ Apana Partner│             │
│  │  (Customer)  │   │  (Seller)    │   │ (Delivery/   │             │
│  │  React Native│   │  React Native│   │  Rider/Logi) │             │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘             │
│         │                  │                   │                      │
│  ┌──────┴──────────────────┴───────────────────┴───────┐             │
│  │              API GATEWAY (nginx / Kong)               │             │
│  │         Rate limiting · Auth · Routing · Logging      │             │
│  └──────┬──────────────────┬───────────────────┬───────┘             │
│         │                  │                   │                      │
│  ┌──────▼──────┐  ┌────────▼───────┐  ┌────────▼───────┐            │
│  │  Customer   │  │  Seller        │  │  Partner       │            │
│  │  Service    │  │  Service       │  │  Service       │            │
│  └──────┬──────┘  └────────┬───────┘  └────────┬───────┘            │
│         │                  │                   │                      │
│  ┌──────┴──────────────────┴───────────────────┴───────┐             │
│  │               SHARED CORE SERVICES                    │             │
│  │  Auth · Notifications · Payments · Orders · Catalog   │             │
│  └──────────────────────────┬────────────────────────────┘            │
│                             │                                          │
│  ┌──────────────────────────▼────────────────────────────┐            │
│  │                    DATA LAYER                          │             │
│  │  PostgreSQL · Redis · Elasticsearch · S3 · TimescaleDB │            │
│  └───────────────────────────────────────────────────────┘            │
│                                                                       │
│  ┌──────────────┐   ┌──────────────┐                                  │
│  │ Apana Service│   │ Admin Panel  │  (Internal tools)                │
│  │  (Franchise) │   │  (Full Ctrl) │                                  │
│  └──────────────┘   └──────────────┘                                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Microservices Breakdown

### Core Services (always running)

| Service | Responsibility | DB | Protocol exposed |
|---------|---------------|-----|-----------------|
| `auth-service` | OTP login, JWT issue/refresh, role management | PostgreSQL | gRPC (internal), REST (public) |
| `user-service` | Customer profiles, addresses, preferences | PostgreSQL | REST |
| `seller-service` | Seller onboarding, store management, inventory | PostgreSQL | REST, GraphQL |
| `catalog-service` | Product catalog, search, category management | PostgreSQL + Elasticsearch | GraphQL |
| `order-service` | Order lifecycle (place → deliver → complete) | PostgreSQL | REST, WebSocket |
| `partner-service` | Partner profiles, location, trip management | PostgreSQL + Redis | REST, WebSocket, gRPC |
| `payment-service` | Wallet, UPI, cards, COD, refunds | PostgreSQL | gRPC (internal only) |
| `notification-service` | Push, SMS, WhatsApp, email | PostgreSQL | gRPC (internal), REST (webhook) |
| `location-service` | Live GPS tracking, geofencing, ETA | Redis + TimescaleDB | WebSocket, gRPC |
| `ondc-service` | ONDC protocol bridge (buyer NP + seller NP) | PostgreSQL | REST (ONDC spec) |
| `analytics-service` | Sales, traffic, performance metrics | TimescaleDB | REST (admin only) |
| `franchise-service` | Apana Service franchise management | PostgreSQL | REST |
| `admin-service` | Admin panel operations, overrides | PostgreSQL | REST |
| `media-service` | Image/video upload, resize, CDN delivery | S3 | REST |
| `search-service` | Full-text + geo search across catalog | Elasticsearch | REST, GraphQL |

---

## 3. Data Flow — Customer Places an Order

```
Customer App          API Gateway         Order Service        Partner Service
     │                    │                    │                    │
     │ POST /orders        │                   │                    │
     ├───────────────────►│                   │                    │
     │                    │ validate JWT       │                    │
     │                    │ route to order-svc │                    │
     │                    ├──────────────────►│                    │
     │                    │                    │ create order       │
     │                    │                    │ deduct inventory   │
     │                    │                    │ call payment-svc   │
     │                    │                    │ (gRPC internal)    │
     │                    │                    ├──────────────────►│
     │                    │                    │                    │ find nearest partner
     │                    │                    │                    │ (Redis geo query)
     │                    │                    │                    │ assign partner
     │                    │◄──────────────────┤                    │
     │◄───────────────────│ 201 order created  │                    │
     │                    │                    │                    │
     │ WS: order.created  │                    │                    │
     │◄════════════════════════════════════════════════════════════│
     │                    │                    │                    │
     │ WS: partner.location│                   │                    │
     │◄════════════════════════════════════════════════════════════│ (live GPS every 3s)
```

---

## 4. Inter-App Communication Matrix

| From → To | Protocol | Events / Endpoints |
|-----------|----------|--------------------|
| Store → Order Service | REST | POST /orders |
| Store → Catalog | GraphQL | product search, store discovery |
| Store → Partner | WebSocket | live partner location |
| Seller → Catalog | REST | CRUD products/inventory |
| Seller → Order | WebSocket | new order notification |
| Partner → Location | WebSocket | GPS push every 3 seconds |
| Partner → Order | REST | accept/reject/complete order |
| Admin → All Services | REST | override, suspend, report |
| Order → Notification | gRPC | trigger push/SMS/WhatsApp |
| Order → Payment | gRPC | charge, refund |
| ONDC → Catalog | REST (ONDC) | /search, /select, /init, /confirm |
| ONDC → Order | REST (ONDC) | /status, /cancel, /track |

---

## 5. Environment Tiers

| Tier | Purpose | URL pattern |
|------|---------|-------------|
| `local` | Developer laptop | `http://localhost:PORT` |
| `dev` | Shared dev server | `https://dev-api.apanastore.in` |
| `staging` | Pre-prod QA | `https://staging-api.apanastore.in` |
| `production` | Live users | `https://api.apanastore.in` |

---

## 6. Tech Stack Recommendation

### Backend Language
- **Node.js (TypeScript)** — fast iteration, same language as frontend, huge ecosystem
- OR **Go** — better for high-throughput services (location, partner matching)
- Recommendation: **Node.js for all services initially**, migrate hot paths to Go later

### Framework
- **Fastify** (REST) — fastest Node.js framework, TypeScript-native
- **Apollo Server** (GraphQL)
- **ws / Socket.IO** (WebSocket)
- **@grpc/grpc-js** (gRPC)

### Databases
| Data | DB | Why |
|------|----|-----|
| Users, orders, sellers | **PostgreSQL** | ACID, relational, strong consistency |
| Live GPS, sessions, cache | **Redis** | In-memory, pub/sub, geo commands |
| Product/store search | **Elasticsearch** | Full-text + geo search |
| Time-series metrics | **TimescaleDB** (PostgreSQL extension) | Analytics, GPS history |
| Media files | **AWS S3 / Cloudflare R2** | Cheap, CDN-friendly |

### Infrastructure
- **Docker + Kubernetes** (k8s) for container orchestration
- **Nginx** as API Gateway initially → migrate to **Kong** when >10 services
- **GitHub Actions** for CI/CD
- **Cloudflare** for CDN + DDoS protection

---

## 7. Seller Type Classification

This is critical for the API design. Apana Seller has 4 distinct seller modes:

| Type | Inventory? | Barcode? | Example | Special API needs |
|------|-----------|---------|---------|-------------------|
| `retail` | Yes | Yes | Grocery store | Standard inventory CRUD |
| `wholesale` | Yes | Yes | Distributor | Bulk pricing, MOQ |
| `food_ready` | Yes | No | Packaged food, chips | Weight/qty based, no barcode |
| `food_live` | No | No | Gola wala, juice shop, cafe | Menu-based, not inventory |
| `service` | No | No | Hair salon, repair shop | Service catalog with pricing |

→ See `02_REST_API/seller_special_cases.md` for full API design for `food_live` and `service` types.
