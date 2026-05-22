# Apana Store — Image Manifest

Complete list of every image the **customer app** (`apana_store_native`) needs.
Hand this to whoever generates/downloads the artwork.

The app is **icon-driven** — most UI uses Ionicons vector glyphs + flat colors.
Raster images are needed only for: **app icons**, **product category tiles**,
and **store-type cards**. Product/store *photos* are uploaded by sellers later —
not in scope here.

---

## Image spec (all category + store images)

| Property | Value |
|---|---|
| Format | PNG, transparent background |
| Shape | Square 1:1 |
| Size | **512 × 512 px** (tiles render ~100-120 px; 512 is retina-safe) |
| Style | Flat / simple illustration, consistent across the whole set |
| Brand accent | Apana Blue `#0F4C81` — keep palette friendly, Indian-market feel |
| File size | < 50 KB each (compress, e.g. tinypng) |
| Filename | exactly the **`key`** below, lowercase + `.png` (e.g. `eggs_meat.png`) |

Each tile already has a pastel background color set in code — artwork should sit
cleanly on a light background (no baked-in colored backdrop).

---

## 1. App icons — `assets/images/`

Already present; regenerate only if upgrading quality. Source = one master logo.

| File | Size | Purpose |
|---|---|---|
| `icon.png` | 1024×1024 | iOS / store app icon |
| `splash-icon.png` | 1024×1024 | splash logo (shown 200 px on `#0F4C81`) |
| `android-icon-foreground.png` | 1024×1024 | Android adaptive — foreground |
| `android-icon-background.png` | 1024×1024 | Android adaptive — background |
| `android-icon-monochrome.png` | 1024×1024 | Android themed-icon (mono) |
| `favicon.png` | 48×48 | web favicon |

> Junk to delete (Expo template leftovers, not needed): `react-logo.png`,
> `react-logo@2x.png`, `react-logo@3x.png`, `partial-react-logo.png`.

---

## 2. Product category tiles

Delivered to Tower at `assets/images/apana_store/Home/Products/<Group>/<key>.png`.
**158 images**, 17 groups. ✅ = already exists.

### 2.1 Grocery — `Home/Products/Grocery/`
| key | label | |
|---|---|---|
| veg_fruits | Vegetables & Fruits | ✅ |
| dairy | Milk & Dairy Products | ✅ |
| eggs_meat | Eggs & Meat | |
| tea_coffee | Tea, Coffee & Biscuits | |
| masala | Masala & Sauces | |
| dry_fruits | Dry Fruits & Nuts | ✅ |
| ration | Ration & Wheat (Atta) | ✅ |
| cook_oil | Cooking Oil & Ghee | |
| baking | Baking & Condiments | |
| chocolates | Chocolates & Candies | |
| noodles | Noodles, Pasta & Rice | |
| honey_spreads | Honey, Jams & Spreads | |
| baby_food | Baby Food & Formula | |
| frozen_veg | Frozen Vegetables | |
| packaged_food | Packaged & Ready-to-Eat | |

### 2.2 Snacks & Beverages — `Home/Products/Snacks/`
| key | label |
|---|---|
| chips | Chips & Namkeen |
| dry_snacks | Dry Snacks & Makhana |
| soft_drinks | Soft Drinks |
| energy_drinks | Energy Drinks |
| goti_soda | Goti Soda |
| packaged_water | Packaged Water |
| juice | Juices & Shakes |
| sweets | Indian Sweets & Mithai |
| instant | Instant Food |
| protein_bars | Protein & Health Bars |
| popcorn | Popcorn & Corn Snacks |

### 2.3 Ice Cream & Frozen — `Home/Products/IceCream/`
| key | label |
|---|---|
| icecream_cups | Ice Cream Cups |
| bars | Ice Cream Bars & Cones |
| kulfi | Kulfi & Falooda |
| frozen_dessert | Frozen Desserts |
| yogurt | Yogurt & Smoothies |
| frozen_snacks | Frozen Snacks & Rolls |

### 2.4 Fashion — `Home/Products/Fashion/`
| key | label | |
|---|---|---|
| mens | Men's Clothing | |
| womens | Women's Clothing | ✅ (bundled) |
| kids_wear | Kids' Wear | |
| ethnic | Ethnic Wear | |
| sportswear | Sportswear & Activewear | |
| winter_wear | Winter Wear | |
| innerwear | Innerwear & Thermals | |
| footwear | Footwear | |
| bags_luggage | Bags & Luggage | |
| fashion_jwl | Fashion Jewellery | |
| accessories | Accessories & Belts | |

### 2.5 Mobiles & Tablets — `Home/Products/Mobiles/`
| key | label |
|---|---|
| smartphones | Smartphones |
| feature_phones | Feature Phones |
| tablets | Tablets |
| covers | Mobile Covers & Cases |
| chargers | Chargers & Cables |
| earphones | Earphones & TWS |
| power_banks | Power Banks |
| memory_cards | Memory Cards & USB |
| screenguard | Screen Guards |

### 2.6 Electronics — `Home/Products/Electronics/`
| key | label |
|---|---|
| headphones | Headphones & Earbuds |
| speakers | Speakers & Soundbars |
| cameras | Cameras & Photography |
| laptops | Laptops & PCs |
| smartwatch | Smart Watches |
| smart_home | Smart Home Devices |
| gaming | Gaming |
| printers | Printers & Scanners |
| storage_drives | Storage & Pen Drives |
| projectors | Projectors & Displays |

### 2.7 Home Appliances — `Home/Products/Appliances/`
| key | label |
|---|---|
| tv | TV & Displays |
| washing | Washing Machine |
| fridge | Refrigerator |
| ac | Air Conditioner |
| kitchen_app | Kitchen Appliances |
| water_purifier | Water Purifiers & RO |
| fans | Fans & Coolers |
| geyser | Geysers & Water Heaters |
| vacuum | Vacuum & Broom Cleaners |
| iron | Iron & Steamers |

### 2.8 Beauty & Personal Care — `Home/Products/Beauty/`
| key | label |
|---|---|
| skincare | Skin Care |
| haircare | Hair Care |
| makeup | Makeup & Cosmetics |
| fragrance | Fragrances & Perfumes |
| mens_groom | Men's Grooming |
| bodycare | Body Care & Lotion |
| oral_care | Oral Care |
| nail_care | Nail Care |
| feminine | Feminine Hygiene |
| sun_care | Sun Care & After Sun |

### 2.9 Pharmacy & Health — `Home/Products/Pharmacy/`
| key | label |
|---|---|
| medicines | Medicines |
| vitamins | Vitamins & Nutrition |
| ayurvedic | Ayurvedic & Herbal |
| homeopathy | Homeopathy |
| first_aid | First Aid |
| health_monitor | Health Monitoring |
| diabetic | Diabetic Care |
| ortho | Orthopaedic Supports |
| baby_health | Baby Care |
| eye_care | Eye Care & Contact Lens |

### 2.10 Sports & Fitness — `Home/Products/Sports/`
| key | label |
|---|---|
| fitness_eq | Fitness Equipment |
| cricket | Cricket |
| football | Football |
| badminton | Badminton |
| cycling | Cycling |
| yoga | Yoga & Meditation |
| swimming | Swimming & Water Sports |
| running | Running & Athletics |
| tt_carrom | Table Tennis & Carrom |
| sports_nutrition | Sports Nutrition |
| outdoor | Outdoor & Adventure |

### 2.11 Home & Furniture — `Home/Products/HomeFurniture/`
| key | label |
|---|---|
| bedding | Beds & Mattresses |
| sofa | Sofas & Seating |
| kitchen_din | Kitchen & Dining |
| bath | Bath Accessories |
| decor | Home Decor & Art |
| storage | Storage & Wardrobes |
| lighting | Lighting & Lamps |
| curtains | Curtains & Blinds |
| cleaning | Cleaning Supplies |
| kids_furniture | Kids' Furniture |
| office_furn | Office Furniture |
| garden_outdoor | Garden & Outdoor |

### 2.12 Books & Education — `Home/Products/Books/`
| key | label |
|---|---|
| fiction | Fiction & Literature |
| non_fiction | Non-Fiction & Biographies |
| academic | Academic & Textbooks |
| competitive | Competitive Exam Books |
| kids_books | Children's Books |
| comics | Comics & Graphic Novels |
| magazines | Magazines & Newspapers |
| stationery | Stationery & Office |
| art_supplies | Art Supplies & Craft |

### 2.13 Baby & Maternity — `Home/Products/Baby/`
| key | label |
|---|---|
| baby_food_m | Baby Food & Cereals |
| diapers | Diapers & Wipes |
| baby_clothing | Baby Clothing & Socks |
| baby_toys | Baby Toys & Learning |
| baby_skin | Baby Skin & Bath |
| maternity | Maternity Wear |
| feeding | Feeding & Nursing |
| strollers | Strollers & Prams |
| baby_safety | Baby Safety & Monitors |

### 2.14 Automotive — `Home/Products/Automotive/`
| key | label |
|---|---|
| car_acc | Car Accessories |
| bike_acc | Bike & Scooter Accessories |
| car_care | Car Care & Cleaning |
| tyres | Tyres & Wheels |
| spare_parts | Spare Parts |
| car_audio | Car Audio & Electronics |
| ev_charging | EV Charging Accessories |
| oils_fluids | Engine Oils & Fluids |

### 2.15 Pooja & Religious — `Home/Products/Pooja/`
| key | label |
|---|---|
| agarbatti | Agarbatti & Dhoop |
| idols | Idols & Figurines |
| puja_thali | Puja Thali & Items |
| flowers_garland | Flowers & Garlands |
| diyas | Diyas & Candles |
| sacred_books | Sacred Books & Scriptures |
| pooja_dress | Pooja & Festival Wear |

### 2.16 Miscellaneous — `Home/Products/Misc/`
| key | label |
|---|---|
| pet_shop | Pet Shop |
| pet_food | Pet Food & Accessories |
| toys | Toys & Games |
| auto_parts | Auto Parts |
| musical | Musical Instruments |
| art_craft | Art & Craft |
| travel_acc | Travel Accessories |
| gifting | Gifting & Greeting Cards |
| office_supply | Office Supplies |
| recycle | Recycling & Scrap |

---

## 3. Store-type cards — `Home/Stores/<key>.png`

**44 images.** Shown as 2-column large cards in "Stores" discovery mode.
✅ = already exists.

| key | label | |
|---|---|---|
| grocery_store | Grocery Store | ✅ |
| convenience | Convenience Store | |
| fashion_store | Fashion Store | |
| jewellery | Jewellery Store | ✅ |
| food_bev | Food & Beverages | ✅ |
| icecream_store | Ice Cream Stores | |
| pharmacy_store | Medical & Pharmacy | ✅ |
| fitness_store | Fitness & Protein Store | |
| personal_care | Personal Care | |
| beauty_store | Beauty Care | |
| mobile_store | Mobile & Accessories | |
| computer_store | Computer & Laptop Elec. | |
| home_elec | Home & Kitchen Elec. | |
| repair_service | Repair & Installation | |
| hardware_store | Hardware & Tools | |
| furniture_store | Furniture & Furnishings | |
| sports_toys | Sports & Toys | |
| books_store | Books & Stationery | |
| eyewear | Eye Wear & Sunglasses | |
| watches | Watches | |
| vehicle | Vehicle Showrooms | |
| bakery_sweets | Bakery & Sweet Shop | |
| dairy_booth | Dairy & Milk Booth | |
| flower_shop | Flower Shop & Nursery | |
| tailoring | Tailoring & Stitching | |
| laundry | Laundry & Dry Cleaning | |
| home_decor | Home Decor & Interior | |
| baby_kids | Baby & Kids Store | |
| organic_food | Organic & Health Food | |
| paan_shop | Paan & Tobacco Shop | |
| footwear_store | Footwear & Shoe Store | |
| gift_shop | Gift & Novelty Shop | |
| pooja_items | Pooja & Religious Items | |
| diagnostic_lab | Diagnostic Lab & Pathology | |
| printing_xerox | Printing & Xerox | |
| travel_agency | Travel Agency | |
| catering | Catering Services | |
| music_store | Music & Instruments | |
| liquor_store | Liquor & Wine Shop | |
| electrical_store | Electrical & Wiring | |
| paint_store | Paint & Wall Decor | |
| agri_store | Agriculture & Seeds | |
| photography | Photography Studio | |
| others_stall | Others — Stall | |

---

## 4. Optional — onboarding illustrations

The 3 onboarding slides currently use Ionicons. Optional upgrade: 3 hero
illustrations (~1000×800 PNG transparent) if richer onboarding is wanted.

| slide | theme |
|---|---|
| 1 | Shop from nearby stores — neighbourhood shops / kirana |
| 2 | Fast local delivery — delivery rider on bike |
| 3 | Support local businesses — local shop owner / community |

---

## 5. AI generation prompts

### Workflow — get a *consistent* set

The hard part of 193 images is making them look like one family. Do this:

1. **Pick a tool that locks style.**
   - **Recraft** — best for flat-vector icon sets; has a reusable "style" + exports
     true transparent PNG / SVG. Recommended.
   - **Midjourney** — generate one anchor icon, then reuse its `--sref <id>` (style
     reference) on every other prompt.
   - **fal.ai / Nano Banana, Ideogram, DALL·E** — workable; pass the same master
     prompt every time and keep one anchor image as reference.
2. **Generate ONE anchor image first** (suggest: `veg_fruits`). Get the style right,
   then lock it (Recraft style / MJ `--sref`) and batch the other ~192 with it.
3. **Transparent background** — if the tool can't export transparent, generate on
   pure white `#FFFFFF` and batch-remove the background afterwards
   (Recraft, fal background-removal, or photopea/remove.bg).
4. Export **512×512 PNG**, compress (tinypng), name each file exactly `<key>.png`.

### Master prompt — category tiles (sections 2)

Paste this, replace `{SUBJECT}`:

```text
Flat vector illustration of {SUBJECT}, a single centered object,
modern e-commerce app category icon, soft rounded shapes, clean and
minimal, bright friendly colour palette, light and approachable,
gentle subtle shading, even consistent line weight, pure white
background, 1:1 square, generous even padding around the object,
no text, no labels, Indian retail context.
```

### Master prompt — store-type cards (section 3)

```text
Flat vector illustration of a friendly {SUBJECT} shopfront, small
Indian neighbourhood store, modern e-commerce app card, soft rounded
shapes, clean and minimal, bright friendly colour palette, gentle
subtle shading, even line weight, pure white background, 1:1 square,
generous even padding, no text, no signage text, no labels.
```

### Negative prompt (all tiles)

```text
text, words, letters, numbers, watermark, brand logo, photorealistic,
photo, 3d render, harsh shadow, ground shadow, busy background,
gradient background, border, frame, multiple unrelated objects,
clutter, people faces
```

### What goes in `{SUBJECT}`

For **almost every key, `{SUBJECT}` = the row's `label`** — the labels are already
plain object names ("Washing Machine", "Headphones & Earbuds", "Cricket").
For store cards, `{SUBJECT}` = the label too (the master prompt wraps it as a
shopfront).

Refined subjects for the keys whose label is vague — use these instead:

| key | use this `{SUBJECT}` |
|---|---|
| veg_fruits | fresh vegetables and fruits together in a basket |
| ration | a cloth sack of wheat atta flour with loose grains |
| masala | colourful Indian spices in small bowls |
| goti_soda | a glass marble-stopper Goti soda / banta bottle |
| dry_snacks | makhana fox-nuts and dry namkeen snacks |
| tt_carrom | a carrom board with a table-tennis paddle and ball |
| agarbatti | a bundle of incense sticks (agarbatti) with holder |
| puja_thali | a decorated brass puja thali with diya |
| diagnostic_lab | medical test tubes and a pathology microscope |
| paan_shop | a small Indian paan and tobacco kiosk |
| others_stall | a small street vendor cart / thela stall |
| recycle | a recycling bin with scrap paper and bottles |
| misc / gifting | a wrapped gift box with a ribbon |
| convenience | a small general convenience store shelf |

### Onboarding illustrations (section 4, optional)

Different shape — wide hero scene, not an icon. Prompt:

```text
Warm flat vector illustration, {SCENE}, modern friendly app
onboarding art, soft rounded shapes, bright cheerful Indian colour
palette, Apana blue (#0F4C81) accents, light background, no text,
gentle depth, wide 5:4 composition.
```

| file | `{SCENE}` |
|---|---|
| onboarding_1 | a customer browsing colourful neighbourhood kirana shops |
| onboarding_2 | a delivery rider on a scooter carrying grocery bags through an Indian street |
| onboarding_3 | a happy local shop owner handing a parcel to a customer |

Size onboarding ~1000×800 PNG transparent.

---

## Totals

| Set | Count | Done | Needed |
|---|---|---|---|
| App icons | 6 | 6 | 0 (regenerate optional) |
| Product category tiles | 158 | 5 | **153** |
| Store-type cards | 44 | 4 | **40** |
| Onboarding (optional) | 3 | 0 | 3 |
| **Total category artwork needed** | | | **~193** |

Delivery: PNG files named `<key>.png`, dropped into the Tower folders above
(`assets/images/apana_store/Home/Products/<Group>/` and `.../Home/Stores/`).
Keep one consistent illustration style across all 202 tiles.
