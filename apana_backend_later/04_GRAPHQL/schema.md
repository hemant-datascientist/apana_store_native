# GraphQL Schema — Apana Platform

> Endpoint: `https://api.apanastore.in/graphql`
> Used for: Product discovery, Store discovery, Complex filtered searches
> Auth: `Authorization: Bearer <access_token>` header
> Why GraphQL here: Customers and sellers need flexible queries — fetch only what the
> screen needs. A product card needs less data than a product detail page.

---

## TYPES

```graphql
# ── Location ─────────────────────────────────────────────────
type GeoPoint {
  lat: Float!
  lng: Float!
}

type Address {
  line1:   String!
  line2:   String
  city:    String!
  state:   String!
  pincode: String!
  geo:     GeoPoint
}

# ── Product ──────────────────────────────────────────────────
type Product {
  id:          ID!
  name:        String!
  description: String
  price:       Float!
  unit:        String!            # "500 ml", "1 kg", "piece"
  image_url:   String
  badge:       String             # "New", "20% off", "Essential"
  category:    String!
  brand:       String
  gtin:        String             # GS1 barcode
  is_verified: Boolean!           # GS1 + FSSAI verified
  is_veg:      Boolean            # food items
  in_stock:    Boolean!
  store:       StoreSummary!
  rating:      Float
  review_count: Int
}

type ProductVariant {
  id:    ID!
  label: String!    # "Small", "500ml", "Blue"
  price: Float!
  active: Boolean!
}

# ── Store ─────────────────────────────────────────────────────
type StoreSummary {
  id:          ID!
  name:        String!
  category:    String!
  area:        String!
  rating:      Float!
  distance_km: Float
  is_open:     Boolean!
  is_live:     Boolean!
  image_url:   String
  badge:       String
}

type Store {
  id:           ID!
  name:         String!
  owner_name:   String!
  category:     String!
  address:      Address!
  rating:       Float!
  review_count: Int!
  total_orders: Int!
  is_open:      Boolean!
  is_live:      Boolean!
  open_hours:   String!
  description:  String
  image_url:    String
  seller_type:  SellerType!
  products(
    category: String
    page: Int
    limit: Int
  ): ProductConnection!
  menu: [MenuItem!]           # for food_live sellers
  services: [Service!]        # for service sellers
  distance_km: Float
}

enum SellerType {
  retail
  wholesale
  food_packed
  food_live
  service
}

# ── Menu Item (food_live) ────────────────────────────────────
type MenuItem {
  id:            ID!
  name:          String!
  description:   String
  is_veg:        Boolean!
  is_available:  Boolean!
  variants:      [ProductVariant!]!
  image_url:     String
  prep_time_min: Int
}

# ── Service (service sellers) ────────────────────────────────
type Service {
  id:               ID!
  name:             String!
  description:      String
  price:            Float!
  duration_min:     Int!
  is_available:     Boolean!
  requires_booking: Boolean!
  variants:         [ProductVariant!]
}

# ── Trending City Item ────────────────────────────────────────
# Frontend: data/allFeedData.ts → TrendingCityItem
type TrendingItem {
  id:        ID!
  name:      String!
  tag:       String!          # "Famous Dish", "Local Brand", "Traditional Craft"
  image_url: String
  city:      String!
}

# ── Pagination ────────────────────────────────────────────────
type ProductConnection {
  items:    [Product!]!
  total:    Int!
  page:     Int!
  pages:    Int!
  has_next: Boolean!
}

type StoreConnection {
  items:    [StoreSummary!]!
  total:    Int!
  page:     Int!
  has_next: Boolean!
}
```

---

## QUERIES

```graphql
type Query {

  # ── Product search (main discovery)
  # Frontend: app/product-finder.tsx → "Look up by product name"
  searchProducts(
    query:    String!
    city:     String
    category: String
    sort:     ProductSortInput
    page:     Int
    limit:    Int
  ): ProductConnection!

  # ── Single product
  product(id: ID!): Product

  # ── Scan barcode → find product
  # Frontend: app/product-finder.tsx → "Scan products"
  productByBarcode(gtin: String!): Product

  # ── Store discovery
  # Frontend: components/home/stores/NearbyStoresFeed.tsx
  nearbyStores(
    lat:      Float!
    lng:      Float!
    radius:   Float           # km, default 5
    category: String
    sort:     StoreSortInput
    live_only: Boolean
    page:     Int
    limit:    Int
  ): StoreConnection!

  # ── Single store
  store(id: ID!): Store

  # ── Trending items by city
  # Frontend: data/allFeedData.ts → getTrendingForCity()
  trendingItems(city: String!): [TrendingItem!]!

  # ── Home feed sections
  # Frontend: data/allFeedData.ts → DAILY_ESSENTIALS, FLASH_DEALS etc.
  homeFeedSection(
    section: HomeFeedSection!
    city:    String!
    limit:   Int
  ): HomeFeedResult!

  # ── Store's products (paginated)
  storeProducts(
    store_id: ID!
    category: String
    page:     Int
    limit:    Int
  ): ProductConnection!

  # ── Seller catalog (seller app)
  sellerCatalog(
    seller_id: ID!
    page:      Int
    limit:     Int
  ): ProductConnection!
}

enum HomeFeedSection {
  daily_essentials
  flash_deals
  new_arrivals
  popular_stores
  seasonal
}

input ProductSortInput {
  field:     ProductSortField!
  direction: SortDirection!
}

enum ProductSortField {
  price
  rating
  distance
  relevance
}

input StoreSortInput {
  field:     StoreSortField!
  direction: SortDirection!
}

enum StoreSortField {
  distance
  rating
  orders
}

enum SortDirection {
  asc
  desc
}

union HomeFeedResult = ProductFeedResult | StoreFeedResult | DealFeedResult

type ProductFeedResult {
  section:  String!
  products: [Product!]!
}

type StoreFeedResult {
  section: String!
  stores:  [StoreSummary!]!
}

type DealFeedResult {
  section:    String!
  ends_at:    String!
  deals: [{
    product:        Product!
    original_price: Float!
    discount_pct:   Int!
  }]
}
```

---

## MUTATIONS

```graphql
type Mutation {

  # ── Add to cart (optimistic UI)
  addToCart(
    product_id: ID!
    quantity:   Int!
    variant_id: ID
  ): CartItem!

  # ── Remove from cart
  removeFromCart(cart_item_id: ID!): Boolean!

  # ── Update cart quantity
  updateCartItem(
    cart_item_id: ID!
    quantity:     Int!
  ): CartItem!

  # ── Add to favourites
  addFavourite(
    type:      FavouriteType!
    target_id: ID!
  ): Boolean!

  # ── Remove from favourites
  removeFavourite(
    type:      FavouriteType!
    target_id: ID!
  ): Boolean!

  # ── Seller: add/update product
  upsertProduct(input: ProductInput!): Product!

  # ── Seller: toggle product stock
  toggleProductStock(product_id: ID!, in_stock: Boolean!): Product!

  # ── Seller: add menu item (food_live)
  upsertMenuItem(input: MenuItemInput!): MenuItem!

  # ── Seller: add service
  upsertService(input: ServiceInput!): Service!
}

enum FavouriteType {
  store
  product
  rider
  delivery
}

input ProductInput {
  id:          ID            # null = create, provided = update
  name:        String!
  description: String
  price:       Float!
  unit:        String!
  category:    String!
  gtin:        String
  image_url:   String
  in_stock:    Boolean!
}
```

---

## SUBSCRIPTIONS (GraphQL over WebSocket)

```graphql
type Subscription {

  # Real-time order status for customer
  orderStatus(order_id: ID!): OrderStatusEvent!

  # Partner location for customer tracking order
  partnerLocation(trip_id: ID!): LocationEvent!

  # New order for seller
  newOrder(store_id: ID!): OrderEvent!
}

type OrderStatusEvent {
  order_id: ID!
  status:   String!
  message:  String
  at:       String!
}

type LocationEvent {
  lat:     Float!
  lng:     Float!
  heading: Float
  eta_min: Int
}

type OrderEvent {
  order_id:    ID!
  items_count: Int!
  total:       Float!
  expires_in:  Int!
}
```
