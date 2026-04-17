# gRPC — Internal Microservice Communication

> gRPC is used ONLY for internal service-to-service calls.
> External clients (mobile apps) never call gRPC directly — they use REST or GraphQL.
> Why gRPC: Binary protocol (protobuf), 5-10x faster than REST, typed contracts,
> bidirectional streaming, auto-generated client code for any language.

---

## SERVICE REGISTRY

| Service | gRPC Port | Called by |
|---------|-----------|-----------|
| `auth-service` | 50051 | All services (token validation) |
| `payment-service` | 50052 | order-service, partner-service |
| `notification-service` | 50053 | order-service, partner-service, admin-service |
| `location-service` | 50054 | partner-service, order-service |
| `catalog-service` | 50055 | order-service (inventory check) |
| `analytics-service` | 50056 | admin-service, all services (metrics push) |

---

## PROTO DEFINITIONS

### auth.proto
```protobuf
syntax = "proto3";
package auth;

service AuthService {
  // Validate a JWT token — called by every service on every request
  rpc ValidateToken (ValidateTokenRequest) returns (ValidateTokenResponse);

  // Invalidate token (logout, suspend) — called by admin-service
  rpc InvalidateToken (InvalidateTokenRequest) returns (InvalidateTokenResponse);

  // Get user details by ID — called by order-service, notification-service
  rpc GetUser (GetUserRequest) returns (UserResponse);
}

message ValidateTokenRequest {
  string token = 1;
  string required_app = 2;    // "customer" | "seller" | "partner" | "admin"
}

message ValidateTokenResponse {
  bool   valid    = 1;
  string user_id  = 2;
  string app      = 3;
  string role     = 4;
  string error    = 5;        // set if valid=false
}

message InvalidateTokenRequest {
  string user_id = 1;
  string reason  = 2;
}

message InvalidateTokenResponse {
  bool success = 1;
}

message GetUserRequest {
  string user_id = 1;
}

message UserResponse {
  string id    = 1;
  string name  = 2;
  string phone = 3;
  string role  = 4;
}
```

---

### payment.proto
```protobuf
syntax = "proto3";
package payment;

service PaymentService {
  // Charge customer for an order
  rpc ChargeOrder (ChargeOrderRequest) returns (ChargeOrderResponse);

  // Refund for cancelled order
  rpc RefundOrder (RefundOrderRequest) returns (RefundOrderResponse);

  // Credit partner earnings
  rpc CreditPartnerEarnings (CreditRequest) returns (CreditResponse);

  // Credit seller payout
  rpc CreditSellerPayout (CreditRequest) returns (CreditResponse);

  // Deduct platform commission
  rpc DeductCommission (CommissionRequest) returns (CommissionResponse);
}

message ChargeOrderRequest {
  string order_id        = 1;
  string user_id         = 2;
  double amount          = 3;
  string payment_method  = 4;    // "upi" | "card" | "wallet" | "cod"
  string razorpay_payment_id = 5; // from Razorpay webhook
}

message ChargeOrderResponse {
  bool   success        = 1;
  string transaction_id = 2;
  string error          = 3;
}

message RefundOrderRequest {
  string order_id  = 1;
  string user_id   = 2;
  double amount    = 3;
  string reason    = 4;
}

message RefundOrderResponse {
  bool   success   = 1;
  string refund_id = 2;
  string error     = 3;
}

message CreditRequest {
  string recipient_id  = 1;    // partner_id or seller_id
  double amount        = 2;
  string trip_id       = 3;    // or order_id
  string description   = 4;
}

message CreditResponse {
  bool   success        = 1;
  string transaction_id = 2;
  double new_balance    = 3;
}

message CommissionRequest {
  string order_id        = 1;
  double order_total     = 2;
  double commission_rate = 3;   // e.g. 0.05 for 5%
}

message CommissionResponse {
  bool   success           = 1;
  double commission_amount = 2;
  double seller_net        = 3;
}
```

---

### notification.proto
```protobuf
syntax = "proto3";
package notification;

service NotificationService {
  // Send push notification to a user's devices
  rpc SendPush (PushRequest) returns (NotificationResponse);

  // Send SMS (OTP, delivery alerts)
  rpc SendSMS (SMSRequest) returns (NotificationResponse);

  // Send WhatsApp message
  rpc SendWhatsApp (WhatsAppRequest) returns (NotificationResponse);

  // Batch send to multiple users
  rpc BatchSendPush (BatchPushRequest) returns (BatchNotificationResponse);

  // Send to all users in a city
  rpc BroadcastCity (CityBroadcastRequest) returns (NotificationResponse);
}

message PushRequest {
  string user_id    = 1;
  string title      = 2;
  string body       = 3;
  string type       = 4;     // "order_update" | "trip_request" | "promo" etc.
  map<string, string> data = 5;  // extra payload for deep linking
}

message SMSRequest {
  string phone   = 1;
  string message = 2;
  string type    = 3;    // "otp" | "alert" | "promo"
}

message WhatsAppRequest {
  string phone        = 1;
  string template_id  = 2;   // pre-approved WhatsApp template
  map<string, string> variables = 3;
}

message BatchPushRequest {
  repeated string user_ids = 1;
  string title             = 2;
  string body              = 3;
  string type              = 4;
}

message CityBroadcastRequest {
  string city    = 1;
  string app     = 2;    // "customer" | "seller" | "partner"
  string title   = 3;
  string body    = 4;
  string type    = 5;
}

message NotificationResponse {
  bool   success = 1;
  string error   = 2;
}

message BatchNotificationResponse {
  int32 sent   = 1;
  int32 failed = 2;
}
```

---

### location.proto
```protobuf
syntax = "proto3";
package location;

service LocationService {
  // Find nearest available partners to a point
  rpc FindNearestPartners (NearestPartnersRequest) returns (NearestPartnersResponse);

  // Get current location of a specific partner
  rpc GetPartnerLocation (PartnerLocationRequest) returns (LocationResponse);

  // Calculate ETA between two points
  rpc CalculateETA (ETARequest) returns (ETAResponse);

  // Update partner's location in Redis geo-index
  rpc UpdatePartnerLocation (UpdateLocationRequest) returns (UpdateLocationResponse);

  // Geofence check — is point inside a polygon
  rpc CheckGeofence (GeofenceRequest) returns (GeofenceResponse);
}

message NearestPartnersRequest {
  double lat           = 1;
  double lng           = 2;
  double radius_km     = 3;
  string partner_type  = 4;    // "delivery" | "rider" | "logistics"
  int32  limit         = 5;
}

message NearestPartnersResponse {
  repeated PartnerLocation partners = 1;
}

message PartnerLocation {
  string partner_id   = 1;
  string name         = 2;
  double lat          = 3;
  double lng          = 4;
  double distance_km  = 5;
  double rating       = 6;
}

message PartnerLocationRequest {
  string partner_id = 1;
}

message LocationResponse {
  double lat      = 1;
  double lng      = 2;
  int64  updated_at_unix = 3;
}

message ETARequest {
  double from_lat = 1;
  double from_lng = 2;
  double to_lat   = 3;
  double to_lng   = 4;
}

message ETAResponse {
  int32  eta_minutes  = 1;
  double distance_km  = 2;
}

message UpdateLocationRequest {
  string partner_id = 1;
  double lat        = 2;
  double lng        = 3;
  double heading    = 4;
  double speed_kmh  = 5;
}

message UpdateLocationResponse {
  bool success = 1;
}

message GeofenceRequest {
  double lat      = 1;
  double lng      = 2;
  string zone_id  = 3;   // e.g. "pune_delivery_zone"
}

message GeofenceResponse {
  bool inside = 1;
  string zone_name = 2;
}
```

---

## SERVICE CALL FLOW — Order Placement (detailed)

```
order-service receives POST /orders from customer:

1. gRPC → auth-service.ValidateToken(customer_jwt)
   ↳ Confirm it's a valid customer token

2. gRPC → catalog-service.CheckInventory(store_id, items[])
   ↳ Confirm items are in stock, get final prices

3. gRPC → payment-service.ChargeOrder(order_id, amount, payment_method)
   ↳ Charge customer, get transaction_id

4. gRPC → location-service.FindNearestPartners(store_lat, store_lng, "delivery")
   ↳ Get top 3 nearest available delivery partners

5. WebSocket → emit partner.trip_request to top partner
   ↳ Wait up to 30s for acceptance, else try next partner

6. gRPC → notification-service.SendPush(seller_id, "New Order Received")
   gRPC → notification-service.SendPush(customer_id, "Order Placed Successfully")

7. gRPC → analytics-service.RecordEvent("order_placed", { order_id, amount, city })

8. Return 201 to customer with order_id
```
