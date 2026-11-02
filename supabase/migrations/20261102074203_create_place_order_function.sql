/*
# Order Placement Function

## Overview
Creates a `place_order` SECURITY DEFINER function that atomically:
1. Validates cart items against actual database prices (prevents price manipulation)
2. Checks sufficient stock for each item
3. Decrements product stock
4. Creates the order record
5. Creates order_items records with price snapshots
6. Returns the new order ID

## Security
- SECURITY DEFINER: runs with the function owner's privileges, bypassing RLS.
  This is required because the function needs to both read (validate prices) and
  write (decrement stock, insert order + items) across multiple tables atomically.
- EXECUTE revoked from PUBLIC and anon, then granted to anon + authenticated so
  only those roles can call it (not arbitrary database roles).
- Input prices from the client are IGNORED — the function reads actual product
  prices from the database, preventing price tampering.

## Notes
1. The function takes a JSON array of items with { product_id, quantity } and
   the checkout form fields. It does NOT trust client-supplied prices.
2. If any product is out of stock or the quantity exceeds stock, the entire
   transaction fails and no stock is decremented (atomicity).
3. Returns { order_id: uuid } on success.
4. Shipping cost is computed server-side based on subtotal threshold.
*/

CREATE OR REPLACE FUNCTION place_order(
  p_email text,
  p_full_name text,
  p_shipping_address text,
  p_city text,
  p_zip_code text,
  p_items jsonb,
  p_country text DEFAULT 'United States'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
  v_subtotal numeric(10,2) := 0;
  v_shipping_cost numeric(10,2) := 0;
  v_total numeric(10,2);
  v_item json;
  v_product record;
  v_qty integer;
  v_product_id uuid;
BEGIN
  -- Validate required fields
  IF p_email IS NULL OR p_email = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;
  IF p_full_name IS NULL OR p_full_name = '' THEN
    RAISE EXCEPTION 'Full name is required';
  END IF;
  IF p_shipping_address IS NULL OR p_shipping_address = '' THEN
    RAISE EXCEPTION 'Shipping address is required';
  END IF;
  IF p_city IS NULL OR p_city = '' THEN
    RAISE EXCEPTION 'City is required';
  END IF;
  IF p_zip_code IS NULL OR p_zip_code = '' THEN
    RAISE EXCEPTION 'ZIP code is required';
  END IF;

  -- Validate items array is not empty
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Cart cannot be empty';
  END IF;

  -- Compute subtotal from actual database prices (ignore client prices)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty := (v_item->>'quantity')::integer;

    SELECT price, stock, name, image_url INTO v_product
    FROM products WHERE id = v_product_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product not found: %', v_product_id;
    END IF;

    IF v_qty < 1 THEN
      RAISE EXCEPTION 'Invalid quantity for product: %', v_product.name;
    END IF;

    IF v_product.stock < v_qty THEN
      RAISE EXCEPTION 'Insufficient stock for product: % (available: %, requested: %)',
        v_product.name, v_product.stock, v_qty;
    END IF;

    v_subtotal := v_subtotal + (v_product.price * v_qty);
  END LOOP;

  -- Compute shipping (free over $75)
  IF v_subtotal >= 75 THEN
    v_shipping_cost := 0;
  ELSE
    v_shipping_cost := 7.99;
  END IF;

  v_total := v_subtotal + v_shipping_cost;

  -- Create the order
  INSERT INTO orders (email, full_name, shipping_address, city, zip_code, country, total, subtotal, shipping_cost, status, payment_status)
  VALUES (p_email, p_full_name, p_shipping_address, p_city, p_zip_code, p_country, v_total, v_subtotal, v_shipping_cost, 'pending', 'unpaid')
  RETURNING id INTO v_order_id;

  -- Create order items and decrement stock atomically
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty := (v_item->>'quantity')::integer;

    SELECT price, name, image_url INTO v_product
    FROM products WHERE id = v_product_id;

    -- Insert order item with price snapshot
    INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, unit_price)
    VALUES (v_order_id, v_product_id, v_product.name, v_product.image_url, v_qty, v_product.price);

    -- Decrement stock atomically with a safety check
    UPDATE products
    SET stock = stock - v_qty
    WHERE id = v_product_id AND stock >= v_qty;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Stock changed during checkout for: %', v_product.name;
    END IF;
  END LOOP;

  RETURN json_build_object('order_id', v_order_id, 'total', v_total);
END;
$$;

-- Revoke default PUBLIC access, grant only to anon + authenticated
REVOKE EXECUTE ON FUNCTION place_order(text, text, text, text, text, jsonb, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION place_order(text, text, text, text, text, jsonb, text) TO anon, authenticated;
