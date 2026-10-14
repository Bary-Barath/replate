-- RePlate 2.0 Database Schema & Security Policies
-- Migration: 20261014000001_initial_schema.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. PROFILES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'seller', 'admin')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 2. BUSINESSES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Bakery',
  address TEXT NOT NULL,
  phone TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. PRODUCTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  seller_name TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Bakery', 'Fruits & Vegetables', 'Dairy', 'Meals', 'Beverages', 'Snacks', 'Other')),
  original_price NUMERIC(10,2) NOT NULL CHECK (original_price > 0),
  rescue_price NUMERIC(10,2) NOT NULL CHECK (rescue_price > 0 AND rescue_price <= original_price),
  discount_percentage INT NOT NULL DEFAULT 0,
  minimum_acceptable_price NUMERIC(10,2) CHECK (minimum_acceptable_price IS NULL OR minimum_acceptable_price <= rescue_price),
  available_quantity INT NOT NULL DEFAULT 1 CHECK (available_quantity >= 0),
  available_weight_kg NUMERIC(6,2) DEFAULT NULL CHECK (available_weight_kg IS NULL OR available_weight_kg >= 0),
  image_url TEXT NOT NULL,
  image_storage_path TEXT,
  best_before TIMESTAMPTZ NOT NULL,
  pickup_deadline TIMESTAMPTZ NOT NULL,
  collection_location TEXT NOT NULL,
  pickup_instructions TEXT,
  allergen_info TEXT,
  storage_info TEXT,
  is_eligible_for_sale BOOLEAN NOT NULL DEFAULT true,
  is_paused BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'reserved', 'sold_out', 'closed', 'archived')),
  pathway TEXT NOT NULL DEFAULT 'human' CHECK (pathway IN ('human', 'feed')),
  distance TEXT DEFAULT 'Nearby',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-calculate discount percentage on insert/update trigger
CREATE OR REPLACE FUNCTION public.calculate_product_discount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.original_price > 0 THEN
    NEW.discount_percentage := ROUND(((NEW.original_price - NEW.rescue_price) / NEW.original_price) * 100);
  ELSE
    NEW.discount_percentage := 0;
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calculate_product_discount ON public.products;
CREATE TRIGGER trg_calculate_product_discount
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_product_discount();

-- ==============================================================================
-- 4. ORDERS & ORDER ITEMS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  pickup_preference TEXT NOT NULL DEFAULT 'standard' CHECK (pickup_preference IN ('standard', 'contactless')),
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (platform_fee >= 0),
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'ready', 'collected', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  price_snapshot NUMERIC(10,2) NOT NULL CHECK (price_snapshot >= 0),
  original_price_snapshot NUMERIC(10,2) NOT NULL CHECK (original_price_snapshot >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  image_url_snapshot TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. CARTS & WISHLISTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ==============================================================================
-- 6. INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status, is_paused, is_eligible_for_sale);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_pickup_deadline ON public.products(pickup_deadline);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_seller_id ON public.order_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);

-- ==============================================================================
-- 7. ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper to check if current user is seller
CREATE OR REPLACE FUNCTION public.is_seller()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'seller'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile (role cannot be self-promoted)"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin())
  );

-- BUSINESSES Policies
CREATE POLICY "Verified businesses are public"
  ON public.businesses FOR SELECT
  USING (verification_status = 'verified' OR owner_id = auth.uid() OR public.is_admin());

CREATE POLICY "Sellers can register their business"
  ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their business"
  ON public.businesses FOR UPDATE
  USING (auth.uid() = owner_id OR public.is_admin());

-- PRODUCTS Policies
CREATE POLICY "Public can view active eligible products"
  ON public.products FOR SELECT
  USING (
    (status = 'published' AND is_paused = false AND is_eligible_for_sale = true AND available_quantity > 0 AND pickup_deadline > NOW())
    OR seller_id = auth.uid()
    OR public.is_admin()
  );

CREATE POLICY "Sellers can insert their own products"
  ON public.products FOR INSERT
  WITH CHECK (
    (seller_id = auth.uid() AND (public.is_seller() OR public.is_admin()))
  );

CREATE POLICY "Sellers can update their own products"
  ON public.products FOR UPDATE
  USING (seller_id = auth.uid() OR public.is_admin())
  WITH CHECK (seller_id = auth.uid() OR public.is_admin());

CREATE POLICY "Sellers and admins can delete or archive own products"
  ON public.products FOR DELETE
  USING (seller_id = auth.uid() OR public.is_admin());

-- ORDERS Policies
CREATE POLICY "Customers can view their own orders"
  ON public.orders FOR SELECT
  USING (customer_id = auth.uid() OR public.is_admin());

CREATE POLICY "Authenticated or guest customers can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (customer_id = auth.uid() OR customer_id IS NULL);

-- ORDER ITEMS Policies
CREATE POLICY "Customers and sellers can view relevant order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
    OR seller_id = auth.uid()
    OR public.is_admin()
  );

CREATE POLICY "Insert order items on order placement"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

-- CART ITEMS Policies
CREATE POLICY "Users can manage their own cart"
  ON public.cart_items FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- WISHLISTS Policies
CREATE POLICY "Users can manage their own wishlist"
  ON public.wishlists FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ==============================================================================
-- 8. ATOMIC ORDER RPC (TRANSACTIONAL STOCK VALIDATION & PLACEMENT)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.place_order_atomic(
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_pickup_preference TEXT,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_order_number TEXT;
  v_subtotal NUMERIC(10,2) := 0;
  v_platform_fee NUMERIC(10,2) := 0;
  v_total NUMERIC(10,2) := 0;
  v_item JSONB;
  v_product_id UUID;
  v_requested_qty INT;
  v_prod RECORD;
BEGIN
  -- 1. Create unique order number
  v_order_number := 'RP-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 8));

  -- 2. Validate and reserve stock for each item atomically
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_requested_qty := (v_item->>'quantity')::INT;

    IF v_requested_qty <= 0 THEN
      RAISE EXCEPTION 'Invalid quantity % for product %', v_requested_qty, v_product_id;
    END IF;

    -- Lock product row for update
    SELECT * INTO v_prod
    FROM public.products
    WHERE id = v_product_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % does not exist', v_product_id;
    END IF;

    IF NOT v_prod.is_eligible_for_sale OR v_prod.is_paused OR v_prod.status <> 'published' THEN
      RAISE EXCEPTION 'Product "%" is no longer available for rescue', v_prod.name;
    END IF;

    IF v_prod.pickup_deadline <= NOW() THEN
      RAISE EXCEPTION 'Product "%" pickup deadline has expired', v_prod.name;
    END IF;

    IF v_prod.available_quantity < v_requested_qty THEN
      RAISE EXCEPTION 'Insufficient stock for "%". Requested: %, Available: %',
        v_prod.name, v_requested_qty, v_prod.available_quantity;
    END IF;

    -- Accumulate subtotal using TRUSTED database rescue price
    v_subtotal := v_subtotal + (v_prod.rescue_price * v_requested_qty);

    -- Decrement stock
    UPDATE public.products
    SET 
      available_quantity = available_quantity - v_requested_qty,
      status = CASE WHEN available_quantity - v_requested_qty = 0 THEN 'sold_out' ELSE status END,
      updated_at = NOW()
    WHERE id = v_product_id;
  END LOOP;

  -- 3. Calculate platform fee (5%) and total
  v_platform_fee := ROUND(v_subtotal * 0.05, 2);
  v_total := v_subtotal + v_platform_fee;

  -- 4. Create the order
  INSERT INTO public.orders (
    order_number,
    customer_id,
    customer_name,
    customer_email,
    customer_phone,
    pickup_preference,
    subtotal,
    platform_fee,
    total,
    status
  ) VALUES (
    v_order_number,
    auth.uid(),
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_pickup_preference,
    v_subtotal,
    v_platform_fee,
    v_total,
    'confirmed'
  ) RETURNING id INTO v_order_id;

  -- 5. Insert order item snapshots
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_requested_qty := (v_item->>'quantity')::INT;

    SELECT * INTO v_prod FROM public.products WHERE id = v_product_id;

    INSERT INTO public.order_items (
      order_id,
      product_id,
      seller_id,
      product_name,
      price_snapshot,
      original_price_snapshot,
      quantity,
      image_url_snapshot
    ) VALUES (
      v_order_id,
      v_prod.id,
      v_prod.seller_id,
      v_prod.name,
      v_prod.rescue_price,
      v_prod.original_price,
      v_requested_qty,
      v_prod.image_url
    );
  END LOOP;

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'platform_fee', v_platform_fee,
    'total', v_total,
    'status', 'confirmed'
  );
END;
$$;

-- ==============================================================================
-- 9. SEED DEFAULT RESCUE INVENTORY (WITH VERIFIED CROISSANT IMAGE)
-- ==============================================================================
INSERT INTO public.products (
  seller_name,
  name,
  description,
  category,
  original_price,
  rescue_price,
  available_quantity,
  image_url,
  best_before,
  pickup_deadline,
  collection_location,
  pickup_instructions,
  allergen_info,
  storage_info,
  minimum_acceptable_price,
  distance,
  is_eligible_for_sale,
  status
) VALUES 
(
  'FreshBake Bakery',
  'Chocolate Truffle Cake',
  'Rich dark chocolate sponge layered with smooth chocolate ganache and chocolate curls.',
  'Bakery',
  500.00,
  175.00,
  4,
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
  NOW() + INTERVAL '4 days',
  NOW() + INTERVAL '4 days',
  'FreshBake Bakery · 12 Market Street',
  'Collect between 5:00 PM and 7:00 PM today.',
  'Contains dairy, eggs and wheat.',
  'Keep chilled. Consume on collection day.',
  150.00,
  '1.2 km',
  true,
  'published'
),
(
  'La Petite Boulangerie',
  'Assorted Croissants (Box of 4)',
  'Golden, flaky French butter croissants freshly baked this morning. Box includes 2 traditional plain butter and 2 almond croissants.',
  'Bakery',
  320.00,
  128.00,
  3,
  'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
  NOW() + INTERVAL '2 days',
  NOW() + INTERVAL '2 days',
  'La Petite Boulangerie · 4 Lake Road',
  'Show your order code at the counter.',
  'Contains dairy, eggs and wheat. May contain traces of tree nuts.',
  'Store in a cool, dry place. Reheat 3 mins at 180°C for best crispness.',
  100.00,
  '3.5 km',
  true,
  'published'
),
(
  'GreenRoots Market',
  'Organic Mixed Vegetables Pack',
  'Hand-picked assortment of crisp farm carrots, zucchini, bell peppers and fresh broccoli.',
  'Fruits & Vegetables',
  250.00,
  150.00,
  8,
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
  NOW() + INTERVAL '5 days',
  NOW() + INTERVAL '5 days',
  'GreenRoots Market · 8 Park Avenue',
  'Use the side entrance for rescue collections.',
  'No major allergens declared by seller.',
  'Refrigerate after collection.',
  120.00,
  '0.8 km',
  true,
  'published'
),
(
  'Bean & Brew Roasters',
  'Premium Roasted Coffee Beans (500g)',
  'Single-origin Arabica medium-dark roast with notes of caramel and hazelnut.',
  'Beverages',
  850.00,
  595.00,
  12,
  'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800',
  NOW() + INTERVAL '20 days',
  NOW() + INTERVAL '20 days',
  'Bean & Brew Roasters · 22 Station Road',
  'Collect during opening hours.',
  'No major allergens declared by seller.',
  'Keep sealed in a cool, dry place.',
  520.00,
  '4.2 km',
  true,
  'published'
),
(
  'The Daily Crust',
  'Sourdough Loaf with Sea Salt',
  'Naturally fermented sourdough loaf with an open crumb and crunchy crust.',
  'Bakery',
  280.00,
  112.00,
  6,
  'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800',
  NOW() + INTERVAL '3 days',
  NOW() + INTERVAL '3 days',
  'The Daily Crust · 15 High Street',
  'Ask for the rescue rack at counter.',
  'Contains wheat gluten.',
  'Keep in paper bag at room temperature.',
  95.00,
  '2.1 km',
  true,
  'published'
),
(
  'Goodness Kitchen',
  'Roasted Vegetable Grain Bowl',
  'Wholesome quinoa and wild rice bowl topped with roasted butternut squash, kale and tahini dressing.',
  'Meals',
  360.00,
  180.00,
  5,
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '1 day',
  'Goodness Kitchen · 30 Church Street',
  'Collect at pickup counter.',
  'Contains sesame (tahini). Vegan.',
  'Keep refrigerated below 5°C.',
  145.00,
  '1.7 km',
  true,
  'published'
),
(
  'Morning Rituals',
  'Greek Yogurt & Berry Pots',
  'Creamy strained Greek yogurt with blueberry compote and toasted oat crunch.',
  'Dairy',
  240.00,
  96.00,
  7,
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800',
  NOW() + INTERVAL '2 days',
  NOW() + INTERVAL '2 days',
  'Morning Rituals · 9 Central Way',
  'Ready in grab-and-go cooler.',
  'Contains dairy and gluten (oats).',
  'Keep chilled at 2-4°C.',
  80.00,
  '2.8 km',
  true,
  'published'
),
(
  'Local Pantry Co.',
  'Artisan Snack Box',
  'Assortment of roasted nuts, dried fruits, seed crackers and savory dips.',
  'Snacks',
  450.00,
  270.00,
  9,
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
  NOW() + INTERVAL '12 days',
  NOW() + INTERVAL '12 days',
  'Local Pantry Co. · 55 Green Lane',
  'Collect at main checkout.',
  'Contains tree nuts and seeds.',
  'Store sealed in a cool, dry place.',
  230.00,
  '5.1 km',
  true,
  'published'
)
ON CONFLICT DO NOTHING;
