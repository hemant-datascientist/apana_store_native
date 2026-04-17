# Auth & Security — Apana Platform

## 1. Auth Strategy

All 5 apps share the **same auth-service** but issue **different JWT tokens** scoped to each app.
A seller JWT cannot be used in the customer API and vice versa.

### Login Flow (OTP-based — no passwords)

```
Mobile App                    Auth Service              SMS/WhatsApp Gateway
    │                              │                           │
    │ POST /auth/send-otp          │                           │
    │ { phone: "+91 98765 43210" } │                           │
    ├────────────────────────────►│                           │
    │                              │ generate 6-digit OTP      │
    │                              │ store in Redis (TTL 5min) │
    │                              ├──────────────────────────►│
    │                              │                           │ send SMS
    │◄────────────────────────────│                           │
    │ 200 { expires_in: 300 }      │                           │
    │                              │                           │
    │ POST /auth/verify-otp        │                           │
    │ { phone, otp: "483921" }     │                           │
    ├────────────────────────────►│                           │
    │                              │ verify OTP from Redis      │
    │                              │ create/find user           │
    │                              │ issue JWT pair             │
    │◄────────────────────────────│                           │
    │ 200 {                        │                           │
    │   access_token,  (15 min)    │                           │
    │   refresh_token  (30 days)   │                           │
    │   user,                      │                           │
    │   is_new_user: bool          │                           │
    │ }                            │                           │
```

---

## 2. JWT Token Structure

### Access Token Payload
```json
{
  "sub": "usr_01J9XXXXXX",
  "app": "customer",
  "role": "customer",
  "phone": "+919876543210",
  "iat": 1713456789,
  "exp": 1713457689,
  "jti": "unique-token-id"
}
```

### App scope values
| App | `app` field | `role` values |
|-----|-------------|---------------|
| Apana Store | `customer` | `customer` |
| Apana Seller | `seller` | `seller`, `seller_staff` |
| Apana Partner | `partner` | `delivery`, `rider`, `logistics` |
| Apana Service | `service` | `franchise_owner`, `sales_agent` |
| Admin Panel | `admin` | `super_admin`, `ops`, `support`, `finance` |

---

## 3. REST Auth Endpoints

### Base URL: `POST https://api.apanastore.in/auth`

```
POST /auth/send-otp
  Body:   { phone: string }          // +91XXXXXXXXXX
  Response: { message: "OTP sent", expires_in: 300 }
  Errors:   429 Too Many Requests (rate limit: 3 OTPs/hour per phone)

POST /auth/verify-otp
  Body:   { phone: string, otp: string, app: AppScope }
  Response: {
    access_token:  string,   // JWT, 15 min
    refresh_token: string,   // JWT, 30 days
    user:          UserObject,
    is_new_user:   boolean   // true → redirect to onboarding
  }
  Errors:   400 Invalid OTP | 410 OTP Expired | 429 Rate limited

POST /auth/refresh
  Body:   { refresh_token: string }
  Response: { access_token: string, refresh_token: string }
  Errors:   401 Invalid | 401 Expired

POST /auth/logout
  Headers: Authorization: Bearer <access_token>
  Body:    { refresh_token: string }
  Response: { message: "Logged out" }
  // Blacklists both tokens in Redis

GET /auth/me
  Headers: Authorization: Bearer <access_token>
  Response: { user: UserObject, roles: string[] }
```

---

## 4. Roles & Permissions

### Permission Matrix

| Permission | customer | seller | seller_staff | delivery | rider | logistics | franchise_owner | sales_agent | ops | super_admin |
|------------|----------|--------|--------------|----------|-------|-----------|----------------|------------|-----|-------------|
| View own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Place order | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage inventory | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Accept delivery | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Accept ride | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Register seller offline | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Suspend any account | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View all India data | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Override orders | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Financial reports | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. API Gateway Security

```
Every request goes through API Gateway which checks:

1. Rate Limiting
   - Anonymous: 30 req/min per IP
   - Authenticated: 300 req/min per user
   - OTP send: 3 req/hour per phone

2. JWT Verification
   - Validate signature with RS256 public key
   - Check exp, jti (blacklist check in Redis)
   - Extract user_id and role for downstream services

3. App Scope Enforcement
   - /api/customer/* → requires app=customer
   - /api/seller/*   → requires app=seller
   - /api/partner/*  → requires app=partner
   - /api/admin/*    → requires app=admin + IP whitelist

4. Request Logging
   - All requests logged: user_id, endpoint, latency, status
   - Stored in TimescaleDB for analytics
```

---

## 6. Device & Session Management

```
POST /auth/devices/register
  Body: {
    device_id:        string,   // unique device identifier
    device_name:      string,   // "Hemant's iPhone 15"
    platform:         "ios" | "android",
    push_token:       string,   // FCM / APNs token for notifications
    app_version:      string    // "1.0.0"
  }

GET  /auth/devices
  // List all logged-in devices for the user

DELETE /auth/devices/:device_id
  // Remote logout a specific device
```

---

## 7. Security Headers (all responses)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 297
X-RateLimit-Reset: 1713457089
```

---

## 8. Data Encryption

| Data | Encryption | Storage |
|------|-----------|---------|
| Passwords | N/A (OTP only, no passwords) | — |
| Phone numbers | AES-256 at rest | PostgreSQL |
| Payment card data | NOT stored (PCI DSS) | Razorpay vault |
| OTPs | Hashed (bcrypt) in Redis | Redis (TTL 5min) |
| JWT signing | RS256 (asymmetric) | Env secrets |
| File uploads | Server-side encryption | S3 SSE-S3 |
