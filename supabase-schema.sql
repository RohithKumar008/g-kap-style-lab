-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.cart_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  selected_size text NOT NULL,
  selected_color text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cart_items_pkey PRIMARY KEY (id),
  CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.custom_designs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  image_url text NOT NULL,
  tshirt_type text NOT NULL,
  tshirt_color text NOT NULL,
  size text NOT NULL,
  print_location text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  image_scale numeric DEFAULT 1.0,
  image_rotation numeric DEFAULT 0.0,
  status text NOT NULL DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT custom_designs_pkey PRIMARY KEY (id),
  CONSTRAINT custom_designs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL,
  product_id uuid,
  quantity integer NOT NULL,
  size text NOT NULL,
  color text NOT NULL,
  price numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  order_number text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending'::text,
  subtotal numeric NOT NULL,
  shipping_cost numeric NOT NULL DEFAULT 0,
  tax numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL,
  shipping_address jsonb NOT NULL,
  shipping_method text NOT NULL,
  payment_method text NOT NULL,
  payment_status text DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.product_images (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL,
  image_url text NOT NULL,
  color text,
  display_order integer DEFAULT 0,
  alt_text text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT unique_product_display_order UNIQUE (product_id, display_order)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  original_price numeric,
  category text NOT NULL,
  collection text NOT NULL,
  colors ARRAY NOT NULL DEFAULT '{}'::text[],
  sizes ARRAY NOT NULL DEFAULT '{}'::text[],
  fit text NOT NULL,
  stock integer DEFAULT 0,
  is_new boolean DEFAULT false,
  is_bestseller boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  free_shipping_threshold numeric DEFAULT 50.00,
  return_days integer DEFAULT 30,
  fabric_care text,
  shipping_info text,
  stock_quantity integer DEFAULT 0,
  CONSTRAINT products_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tshirt_colors (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  color_id text NOT NULL UNIQUE,
  name text NOT NULL,
  hex_code text NOT NULL,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tshirt_colors_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tshirt_types (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  type_id text NOT NULL UNIQUE,
  name text NOT NULL,
  price numeric NOT NULL,
  description text,
  image_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tshirt_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.addresses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  street_address text NOT NULL,
  home_address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  country text NOT NULL,
  pincode text NOT NULL,
  tag text NOT NULL DEFAULT 'home'::text CHECK (tag IN ('home', 'office', 'other')),
  custom_tag text,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT addresses_pkey PRIMARY KEY (id),
  CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Index for faster lookups by user_id
CREATE INDEX idx_addresses_user_id ON public.addresses(user_id);

-- Index for default addresses
CREATE INDEX idx_addresses_user_default ON public.addresses(user_id, is_default) WHERE is_default = true;

-- Function to ensure only one default address per user
CREATE OR REPLACE FUNCTION public.ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  -- If the new/updated address is being set as default
  IF NEW.is_default = true THEN
    -- Unset all other default addresses for this user
    UPDATE public.addresses
    SET is_default = false
    WHERE user_id = NEW.user_id AND id != NEW.id AND is_default = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain single default address per user
CREATE TRIGGER ensure_default_address_trigger
  BEFORE INSERT OR UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_default_address();

-- Validation function to ensure product_images.color matches products.colors array
CREATE OR REPLACE FUNCTION public.validate_product_image_color()
RETURNS TRIGGER AS $$
DECLARE
  valid_colors TEXT[];
BEGIN
  -- Get the valid colors for this product
  SELECT colors INTO valid_colors FROM public.products WHERE id = NEW.product_id;
  
  -- Allow NULL color (applies to all color variants)
  IF NEW.color IS NOT NULL AND NEW.color != '' THEN
    -- Check if the color is in the valid colors array
    IF NOT (NEW.color = ANY(valid_colors)) THEN
      RAISE EXCEPTION 'Color "%" is not valid for this product. Valid colors: %', 
        NEW.color, array_to_string(valid_colors, ', ');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to validate color before insert or update
CREATE TRIGGER validate_image_color_trigger
  BEFORE INSERT OR UPDATE ON public.product_images
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_product_image_color();