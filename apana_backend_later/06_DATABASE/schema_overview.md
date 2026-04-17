# Database Schema — Apana Platform

> Primary DB: **PostgreSQL 16**
> Cache/Geo: **Redis 7**
> Search: **Elasticsearch 8**
> Time-series: **TimescaleDB** (PostgreSQL extension)

---

## CORE TABLES

### users
```sql
CREATE TABLE users (
  id             VARCHAR(26) PRIMARY KEY,  -- ULID: usr_01J9XXXXXX
  phone          VARCHAR(20) UNIQUE NOT NULL,
  name           VARCHAR(100),
  email          VARCHAR(150),
  avatar_url     TEXT,
  app            VARCHAR(20) NOT NULL,     -- customer | seller | partner | admin
  role           VARCHAR(30) NOT NULL,
  status         VARCHAR(20) DEFAULT 'active',  -- active | suspended | deleted
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  deleted_at     TIMESTAMPTZ              -- soft delete
);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_app_role ON users(app, role);
```

### addresses
```sql
CREATE TABLE addresses (
  id          VARCHAR(26) PRIMARY KEY,
  user_id     VARCHAR(26) REFERENCES users(id) ON DELETE CASCADE,
  label       VARCHAR(50) NOT NULL,    -- "Home", "Work", "Uncle House"
  icon        VARCHAR(50),             -- Ionicons glyph
  recipient   VARCHAR(100) NOT NULL,
  line1       VARCHAR(200) NOT NULL,
  line2       VARCHAR(200),
  city        VARCHAR(100) NOT NULL,
  state       VARCHAR(100) NOT NULL,
  pincode     VARCHAR(10) NOT NULL,
  lat         DECIMAL(10, 7),
  lng         DECIMAL(10, 7),
  is_default  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
-- Only one default per user enforced via trigger
```

### sellers
```sql
CREATE TABLE sellers (
  id              VARCHAR(26) PRIMARY KEY,
  user_id         VARCHAR(26) REFERENCES users(id),
  seller_type     VARCHAR(20) NOT NULL,  -- retail|wholesale|food_packed|food_live|service
  business_name   VARCHAR(200) NOT NULL,
  owner_name      VARCHAR(100) NOT NULL,
  phone           VARCHAR(20) NOT NULL,
  gstin           VARCHAR(15),
  fssai_license   VARCHAR(20),           -- required for food sellers
  status          VARCHAR(20) DEFAULT 'pending_verification',
  verified_at     TIMESTAMPTZ,
  verified_by     VARCHAR(26),           -- admin user id
  city            VARCHAR(100) NOT NULL,
  state           VARCHAR(100) NOT NULL,
  pincode         VARCHAR(10) NOT NULL,
  lat             DECIMAL(10, 7),
  lng             DECIMAL(10, 7),
  rating          DECIMAL(3, 2) DEFAULT 0,
  total_orders    INT DEFAULT 0,
  is_live         BOOLEAN DEFAULT FALSE, -- currently open and taking orders
  open_hours      VARCHAR(100),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_sellers_city ON sellers(city);
CREATE INDEX idx_sellers_type ON sellers(seller_type);
CREATE INDEX idx_sellers_live ON sellers(is_live, city);
-- PostGIS spatial index for geo search:
-- CREATE INDEX idx_sellers_geo ON sellers USING GIST(ST_MakePoint(lng, lat));
```

### products (retail, wholesale, food_packed)
```sql
CREATE TABLE products (
  id            VARCHAR(26) PRIMARY KEY,
  seller_id     VARCHAR(26) REFERENCES sellers(id) ON DELETE CASCADE,
  name          VARCHAR(300) NOT NULL,
  description   TEXT,
  category      VARCHAR(100) NOT NULL,
  subcategory   VARCHAR(100),
  brand         VARCHAR(100),
  unit          VARCHAR(50) NOT NULL,    -- "500 ml", "1 kg", "piece"
  price         DECIMAL(10, 2) NOT NULL,
  mrp           DECIMAL(10, 2),          -- maximum retail price
  gtin          VARCHAR(20),             -- GS1 barcode (EAN-13, UPC-A etc.)
  image_url     TEXT,
  badge         VARCHAR(50),
  is_veg        BOOLEAN,                 -- food items only
  in_stock      BOOLEAN DEFAULT TRUE,
  stock_qty     INT,                     -- null = unlimited (services/food_live)
  is_active     BOOLEAN DEFAULT TRUE,
  is_verified   BOOLEAN DEFAULT FALSE,   -- GS1/FSSAI verified flag
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_gtin ON products(gtin);
-- Elasticsearch sync: all active products indexed for full-text search
```

### menu_items (food_live sellers only)
```sql
CREATE TABLE menu_items (
  id              VARCHAR(26) PRIMARY KEY,
  seller_id       VARCHAR(26) REFERENCES sellers(id) ON DELETE CASCADE,
  name            VARCHAR(300) NOT NULL,
  description     TEXT,
  category        VARCHAR(100),
  image_url       TEXT,
  is_veg          BOOLEAN DEFAULT TRUE,
  is_available    BOOLEAN DEFAULT TRUE,  -- quick sold-out toggle
  prep_time_min   INT DEFAULT 5,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE menu_item_variants (
  id            VARCHAR(26) PRIMARY KEY,
  menu_item_id  VARCHAR(26) REFERENCES menu_items(id) ON DELETE CASCADE,
  label         VARCHAR(50) NOT NULL,    -- "Small", "Large", "Special"
  price         DECIMAL(10, 2) NOT NULL,
  active        BOOLEAN DEFAULT TRUE
);

CREATE TABLE menu_item_customizations (
  id            VARCHAR(26) PRIMARY KEY,
  menu_item_id  VARCHAR(26) REFERENCES menu_items(id) ON DELETE CASCADE,
  label         VARCHAR(100) NOT NULL,   -- "Extra Syrup", "Less Sugar"
  price         DECIMAL(10, 2) DEFAULT 0
);
```

### services (service sellers only)
```sql
CREATE TABLE services (
  id               VARCHAR(26) PRIMARY KEY,
  seller_id        VARCHAR(26) REFERENCES sellers(id) ON DELETE CASCADE,
  name             VARCHAR(200) NOT NULL,
  description      TEXT,
  category         VARCHAR(100),
  price            DECIMAL(10, 2) NOT NULL,
  duration_min     INT NOT NULL,
  is_available     BOOLEAN DEFAULT TRUE,
  requires_booking BOOLEAN DEFAULT TRUE,
  image_url        TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE staff_members (
  id          VARCHAR(26) PRIMARY KEY,
  seller_id   VARCHAR(26) REFERENCES sellers(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  specialty   VARCHAR(100),
  phone       VARCHAR(20),
  available   BOOLEAN DEFAULT TRUE
);
```

### orders
```sql
CREATE TABLE orders (
  id              VARCHAR(26) PRIMARY KEY,
  customer_id     VARCHAR(26) REFERENCES users(id),
  seller_id       VARCHAR(26) REFERENCES sellers(id),
  partner_id      VARCHAR(26) REFERENCES partners(id),
  address_id      VARCHAR(26) REFERENCES addresses(id),
  order_type      VARCHAR(20) DEFAULT 'inventory', -- inventory | menu | service | booking
  status          VARCHAR(30) NOT NULL DEFAULT 'placed',
  -- placed|accepted_by_seller|preparing|ready_for_pickup
  -- |partner_assigned|picked_up|out_for_delivery|delivered
  -- |cancelled|failed
  subtotal        DECIMAL(10, 2) NOT NULL,
  delivery_fee    DECIMAL(10, 2) DEFAULT 0,
  discount        DECIMAL(10, 2) DEFAULT 0,
  total           DECIMAL(10, 2) NOT NULL,
  payment_method  VARCHAR(20) NOT NULL,
  payment_status  VARCHAR(20) DEFAULT 'pending',  -- pending|paid|failed|refunded
  transaction_id  VARCHAR(100),
  notes           TEXT,
  cancelled_by    VARCHAR(20),   -- customer|seller|partner|admin
  cancel_reason   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  delivered_at    TIMESTAMPTZ
);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

### order_items
```sql
CREATE TABLE order_items (
  id              VARCHAR(26) PRIMARY KEY,
  order_id        VARCHAR(26) REFERENCES orders(id) ON DELETE CASCADE,
  product_id      VARCHAR(26),   -- references products, menu_items, or services
  item_type       VARCHAR(20) NOT NULL,  -- product | menu_item | service
  name            VARCHAR(300) NOT NULL, -- snapshot at order time
  unit            VARCHAR(50),
  quantity        INT NOT NULL DEFAULT 1,
  unit_price      DECIMAL(10, 2) NOT NULL,
  total_price     DECIMAL(10, 2) NOT NULL,
  variant_label   VARCHAR(50),   -- for menu variants
  customizations  JSONB          -- for menu customizations
);
```

### partners
```sql
CREATE TABLE partners (
  id               VARCHAR(26) PRIMARY KEY,
  user_id          VARCHAR(26) REFERENCES users(id),
  partner_type     VARCHAR(20) NOT NULL,  -- delivery | rider | logistics
  name             VARCHAR(100) NOT NULL,
  phone            VARCHAR(20) NOT NULL,
  rating           DECIMAL(3, 2) DEFAULT 0,
  total_trips      INT DEFAULT 0,
  total_earnings   DECIMAL(12, 2) DEFAULT 0,
  wallet_balance   DECIMAL(10, 2) DEFAULT 0,
  is_online        BOOLEAN DEFAULT FALSE,
  status           VARCHAR(20) DEFAULT 'pending_verification',
  city             VARCHAR(100),
  documents_status VARCHAR(20) DEFAULT 'pending', -- pending|verified|rejected
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE partner_vehicles (
  id           VARCHAR(26) PRIMARY KEY,
  partner_id   VARCHAR(26) REFERENCES partners(id),
  type         VARCHAR(30) NOT NULL,  -- two_wheeler|four_wheeler|truck|tempo
  make         VARCHAR(50),
  model        VARCHAR(50),
  year         INT,
  number       VARCHAR(20) UNIQUE NOT NULL,
  color        VARCHAR(30)
);
```

### favourites
```sql
CREATE TABLE favourites (
  id          VARCHAR(26) PRIMARY KEY,
  user_id     VARCHAR(26) REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(20) NOT NULL,  -- store|product|rider|delivery
  target_id   VARCHAR(26) NOT NULL,  -- store_id|product_id|partner_id
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, type, target_id)
);
CREATE INDEX idx_favourites_user ON favourites(user_id, type);
```

---

## REDIS KEY PATTERNS

```
# Partner live location (geo-index)
partner:geo:{city}                  → GEOADD / GEORADIUS for nearest partner search
partner:location:{partner_id}       → HSET { lat, lng, heading, speed, updated_at }
partner:online:{city}               → SET of online partner IDs

# OTP store
otp:{phone}                         → SETEX "483921" EX 300

# JWT blacklist (logged out / suspended tokens)
jwt:blacklist:{jti}                 → SETEX "1" EX {token_ttl}

# Session cache
session:{user_id}                   → HSET { device_id, push_token, last_seen }

# Order cache (hot data)
order:{order_id}                    → HSET { status, partner_id, eta }  EX 3600

# Live store count per city
stores:live:{city}                  → INT (INCR/DECR when seller goes live/offline)

# Rate limiting
ratelimit:{ip}:{endpoint}           → INCR EX 60
```

---

## ELASTICSEARCH INDEXES

```json
// Index: apana_products
{
  "mappings": {
    "properties": {
      "id":          { "type": "keyword" },
      "name":        { "type": "text", "analyzer": "hindi_english" },
      "brand":       { "type": "text" },
      "category":    { "type": "keyword" },
      "city":        { "type": "keyword" },
      "price":       { "type": "float" },
      "in_stock":    { "type": "boolean" },
      "is_verified": { "type": "boolean" },
      "seller_id":   { "type": "keyword" },
      "location":    { "type": "geo_point" },
      "gtin":        { "type": "keyword" }
    }
  }
}

// Index: apana_stores
{
  "mappings": {
    "properties": {
      "id":           { "type": "keyword" },
      "name":         { "type": "text" },
      "category":     { "type": "keyword" },
      "city":         { "type": "keyword" },
      "rating":       { "type": "float" },
      "is_live":      { "type": "boolean" },
      "seller_type":  { "type": "keyword" },
      "location":     { "type": "geo_point" }
    }
  }
}
```
