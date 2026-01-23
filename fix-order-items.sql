-- Fix order_items table to allow custom designs (null product_id)
ALTER TABLE order_items ALTER COLUMN product_id DROP NOT NULL;
