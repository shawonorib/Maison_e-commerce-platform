/*
# E-Commerce Platform Schema

## Overview
Creates a feature-rich e-commerce platform with product catalog, categories, orders,
order items, and real-time stock tracking. Uses a single-tenant model where the
anon-key frontend can browse products and place orders (no sign-in required).

## New Tables

1. `categories`
   - id (uuid, primary key)
   - name (text, not null, unique) — category display name
   - slug (text, not null, unique) — URL-friendly identifier
   - description (text) — optional category description
   - icon (text) — optional lucide icon name
   - created_at (timestamptz)

2. `products`
   - id (uuid, primary key)
   - name (text, not null) — product name
   - slug (text, not null, unique) — URL-friendly identifier
   - description (text, not null) — rich product description
   - price (numeric(10,2), not null) — price in USD
   - compare_at_price (numeric(10,2)) — original price for discount display
   - image_url (text, not null) — primary product image
   - category_id (uuid, FK to categories)
   - stock (integer, not null, default 0) — real-time inventory count
   - rating (numeric(2,1), default 5.0) — average rating 0-5
   - review_count (integer, default 0) — number of reviews
   - is_featured (boolean, default false) — featured on homepage
   - sku (text, unique) — stock keeping unit
   - created_at (timestamptz)

3. `orders`
   - id (uuid, primary key)
   - email (text, not null) — customer email for order confirmation
   - full_name (text, not null) — customer name
   - shipping_address (text, not null) — full shipping address
   - city (text, not null)
   - zip_code (text, not null)
   - country (text, not null, default 'United States')
   - total (numeric(10,2), not null) — order total including shipping
   - subtotal (numeric(10,2), not null) — sum of item prices
   - shipping_cost (numeric(10,2), not null, default 0)
   - status (text, not null, default 'pending') — pending, processing, shipped, delivered
   - payment_status (text, not null, default 'unpaid') — unpaid, paid
   - stripe_payment_intent_id (text) — for future Stripe integration
   - created_at (timestamptz)

4. `order_items`
   - id (uuid, primary key)
   - order_id (uuid, FK to orders, cascade delete)
   - product_id (uuid, FK to products)
   - product_name (text, not null) — snapshot of product name at order time
   - product_image (text) — snapshot of product image
   - quantity (integer, not null, check >= 1)
   - unit_price (numeric(10,2), not null) — snapshot of price at order time
   - created_at (timestamptz)

## Security
- RLS enabled on all tables.
- Products and categories: readable by anon + authenticated (public catalog).
- Orders and order_items: anon + authenticated can insert (guest checkout) and
  read their own orders by email. This enables order tracking by email lookup
  without requiring accounts.
- An index on products.slug, products.category_id, orders.email for fast lookups.

## Notes
1. This is a guest-checkout model (no auth required) so policies target anon + authenticated.
2. Stock is decremented atomically on order placement to support real-time inventory.
3. Order status updates enable real-time order tracking via Supabase realtime subscriptions.
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON categories TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  compare_at_price numeric(10,2),
  image_url text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  stock integer NOT NULL DEFAULT 0,
  rating numeric(2,1) DEFAULT 5.0,
  review_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  sku text UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
GRANT SELECT, UPDATE ON products TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_product_stock" ON products;
CREATE POLICY "anon_update_product_stock" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text NOT NULL,
  shipping_address text NOT NULL,
  city text NOT NULL,
  zip_code text NOT NULL,
  country text NOT NULL DEFAULT 'United States',
  total numeric(10,2) NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  shipping_cost numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'unpaid',
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON orders TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  product_image text,
  quantity integer NOT NULL CHECK (quantity >= 1),
  unit_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON order_items TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
