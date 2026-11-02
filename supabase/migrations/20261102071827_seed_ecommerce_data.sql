/*
# Seed E-Commerce Catalog Data

## Overview
Populates categories and products tables with a rich catalog of 20 products across
8 categories. Each product has a real image URL, description, price, stock count,
rating, and review count.

## Data Inserted
- 8 categories: Audio, Wearables, Eyewear, Home, Accessories, Footwear, Drinkware, Computing
- 20 products with varied prices, stock levels, and ratings
- Featured products flagged for homepage display

## Notes
1. Uses ON CONFLICT (slug) DO NOTHING so it's idempotent.
2. Product images are from Pexels (license-free stock photos).
3. Stock levels are intentionally varied to show real-time inventory states.
*/

INSERT INTO categories (name, slug, description, icon) VALUES
  ('Audio', 'audio', 'Headphones, speakers, and earbuds for premium sound', 'Headphones'),
  ('Wearables', 'wearables', 'Smartwatches and fitness trackers', 'Watch'),
  ('Eyewear', 'eyewear', 'Stylish sunglasses and eyewear accessories', 'Glasses'),
  ('Home', 'home', 'Lighting and decor for modern living spaces', 'Lamp'),
  ('Accessories', 'accessories', 'Backpacks, bags, and everyday carry items', 'Backpack'),
  ('Footwear', 'footwear', 'Running shoes and everyday sneakers', 'Footprints'),
  ('Drinkware', 'drinkware', 'Mugs, tumblers, and drinkware essentials', 'Coffee'),
  ('Computing', 'computing', 'Keyboards, mice, and desk peripherals', 'Keyboard')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_at_price, image_url, category_id, stock, rating, review_count, is_featured, sku) VALUES
  (
    'Aura Wireless Headphones',
    'aura-wireless-headphones',
    'Immerse yourself in studio-quality sound with active noise cancellation, 40-hour battery life, and plush memory-foam ear cushions. Bluetooth 5.3 with multipoint pairing.',
    199.00, 279.00,
    'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'audio'),
    47, 4.8, 312, true, 'AUR-WH-001'
  ),
  (
    'Pulse Pro Earbuds',
    'pulse-pro-earbuds',
    'True wireless earbuds with adaptive transparency mode, wireless charging case, and IPX5 water resistance. Up to 30 hours total playback.',
    149.00, 199.00,
    'https://images.pexels.com/photos/33936400/pexels-photo-33936400.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'audio'),
    63, 4.6, 198, false, 'PUL-EB-002'
  ),
  (
    'Vibe Bluetooth Speaker',
    'vibe-bluetooth-speaker',
    'Portable 360-degree speaker with deep bass, 20-hour battery, and IP67 waterproof rating. Perfect for adventures and home listening.',
    89.00, 129.00,
    'https://images.pexels.com/photos/14941998/pexels-photo-14941998.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'audio'),
    128, 4.7, 445, true, 'VIB-BS-003'
  ),
  (
    'Sonix Studio Headphones',
    'sonix-studio-headphones',
    'Reference-grade open-back headphones for critical listening and mixing. Detachable cable, premium drivers, and a lightweight aluminum frame.',
    249.00, NULL,
    'https://images.pexels.com/photos/8597722/pexels-photo-8597722.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'audio'),
    22, 4.9, 87, false, 'SON-SH-004'
  ),
  (
    'Tempo Smartwatch',
    'tempo-smartwatch',
    'Track workouts, heart rate, sleep, and notifications on a stunning AMOLED display. GPS built-in, 7-day battery, and 50m water resistance.',
    229.00, 299.00,
    'https://images.pexels.com/photos/13007642/pexels-photo-13007642.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'wearables'),
    54, 4.5, 267, true, 'TEM-SW-005'
  ),
  (
    'Flux Smartwatch Lite',
    'flux-smartwatch-lite',
    'A slim, lightweight smartwatch with all-day activity tracking, interchangeable bands, and smart notifications. 5-day battery life.',
    129.00, 179.00,
    'https://images.pexels.com/photos/9142237/pexels-photo-9142237.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'wearables'),
    91, 4.3, 156, false, 'FLX-SW-006'
  ),
  (
    'Eclipse Polarized Sunglasses',
    'eclipse-polarized-sunglasses',
    'UV400 polarized lenses with a lightweight acetate frame. Scratch-resistant coating and a timeless silhouette that suits every face shape.',
    119.00, 159.00,
    'https://images.pexels.com/photos/27353350/pexels-photo-27353350.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'eyewear'),
    76, 4.6, 134, true, 'ECL-SG-007'
  ),
  (
    'Onyx Round Sunglasses',
    'onyx-round-sunglasses',
    'Bold round frames with gradient lenses and a retro aesthetic. Hand-finished hinges and a complimentary hard case.',
    79.00, NULL,
    'https://images.pexels.com/photos/34467082/pexels-photo-34467082.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'eyewear'),
    42, 4.4, 78, false, 'ONX-SG-008'
  ),
  (
    'Halo Minimalist Desk Lamp',
    'halo-desk-lamp',
    'Sculptural LED desk lamp with touch dimming, 3 color temperatures, and a sleek matte finish. USB-C charging port built into the base.',
    99.00, 139.00,
    'https://images.pexels.com/photos/7439756/pexels-photo-7439756.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'home'),
    35, 4.7, 201, true, 'HAL-DL-009'
  ),
  (
    'Glow Accent Lamp',
    'glow-accent-lamp',
    'A warm ambient lamp with a hand-blown glass shade and brass base. Perfect for bedside tables, reading nooks, and cozy corners.',
    69.00, 89.00,
    'https://images.pexels.com/photos/28461166/pexels-photo-28461166.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'home'),
    88, 4.5, 112, false, 'GLW-AL-010'
  ),
  (
    'Nomad Leather Backpack',
    'nomad-leather-backpack',
    'Full-grain leather backpack with a padded 15-inch laptop sleeve, water-resistant lining, and antique brass hardware. Ages beautifully with use.',
    179.00, 229.00,
    'https://images.pexels.com/photos/15246346/pexels-photo-15246346.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'accessories'),
    29, 4.9, 178, true, 'NOM-BP-011'
  ),
  (
    'Voyager Canvas Backpack',
    'voyager-canvas-backpack',
    'Durable waxed canvas backpack with leather accents, multiple compartments, and a luggage pass-through strap. Built for daily commutes and weekend trips.',
    99.00, 139.00,
    'https://images.pexels.com/photos/9630186/pexels-photo-9630186.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'accessories'),
    64, 4.4, 95, false, 'VOY-BP-012'
  ),
  (
    'Stride Running Sneakers',
    'stride-running-sneakers',
    'Lightweight performance sneakers with a responsive foam midsole, breathable knit upper, and reflective detailing for night runs.',
    129.00, 169.00,
    'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'footwear'),
    73, 4.6, 234, true, 'STR-RS-013'
  ),
  (
    'Cloud Everyday Sneakers',
    'cloud-everyday-sneakers',
    'Versatile white sneakers with a cushioned insole, premium leather construction, and a classic silhouette that goes with everything.',
    89.00, NULL,
    'https://images.pexels.com/photos/11324546/pexels-photo-11324546.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'footwear'),
    115, 4.5, 189, false, 'CLD-SN-014'
  ),
  (
    'Terra Trail Sneakers',
    'terra-trail-sneakers',
    'Rugged trail sneakers with an aggressive outsole, waterproof membrane, and reinforced toe cap. Ready for any terrain.',
    149.00, 199.00,
    'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'footwear'),
    38, 4.7, 102, false, 'TER-TS-015'
  ),
  (
    'Form Ceramic Mug Set',
    'form-ceramic-mug-set',
    'Set of two handcrafted ceramic mugs with a matte glaze and comfortable grip. Dishwasher and microwave safe. 12oz capacity each.',
    39.00, 49.00,
    'https://images.pexels.com/photos/6312177/pexels-photo-6312177.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'drinkware'),
    210, 4.8, 301, true, 'FRM-CM-016'
  ),
  (
    'Lumen White Mug',
    'lumen-white-mug',
    'Minimalist white stoneware mug with a clean profile and a smooth-glazed interior. The perfect everyday cup for coffee or tea.',
    19.00, NULL,
    'https://images.pexels.com/photos/12442889/pexels-photo-12442889.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'drinkware'),
    175, 4.3, 67, false, 'LUM-CM-017'
  ),
  (
    'Tactile Mechanical Keyboard',
    'tactile-mechanical-keyboard',
    'Hot-swappable mechanical keyboard with PBT keycaps, RGB backlighting, and a gasket-mounted aluminum plate for a satisfying typing feel.',
    159.00, 199.00,
    'https://images.pexels.com/photos/5380584/pexels-photo-5380584.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'computing'),
    41, 4.8, 145, true, 'TAC-KB-018'
  ),
  (
    'Slate Minimal Keyboard',
    'slate-minimal-keyboard',
    'Low-profile wireless mechanical keyboard with clean lines, tactile switches, and up to 3 months of battery on a single charge.',
    119.00, 149.00,
    'https://images.pexels.com/photos/30836161/pexels-photo-30836161.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'computing'),
    58, 4.6, 89, false, 'SLA-KB-019'
  ),
  (
    'Studio Desk Keyboard',
    'studio-desk-keyboard',
    'Compact 75% mechanical keyboard with a wooden wrist rest, per-key RGB, and a USB-C removable cable. Designed for productivity and gaming alike.',
    139.00, NULL,
    'https://images.pexels.com/photos/5152261/pexels-photo-5152261.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM categories WHERE slug = 'computing'),
    33, 4.7, 76, false, 'STD-KB-020'
  )
ON CONFLICT (slug) DO NOTHING;
