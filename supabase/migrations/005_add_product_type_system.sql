-- Add product type system to support decants vs perfumes
-- This migration adds product_type to tenants and size to tenant_products

-- Create enum type for product types
DO $$ BEGIN
  CREATE TYPE product_type AS ENUM ('decant', 'perfume');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add product_type to tenants table
ALTER TABLE tenants 
  ADD COLUMN IF NOT EXISTS product_type product_type DEFAULT 'decant';

-- Add size column to tenant_products for bottle sizes (30, 50, 100)
ALTER TABLE tenant_products 
  ADD COLUMN IF NOT EXISTS size numeric;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_tenants_product_type ON tenants(product_type);
CREATE INDEX IF NOT EXISTS idx_tenant_products_size ON tenant_products(size);

-- Add comments for documentation
COMMENT ON COLUMN tenants.product_type IS 'Type of products this tenant sells: decant (samples in 2.5/5/10ml) or perfume (bottles in 30/50/100ml)';
COMMENT ON COLUMN tenant_products.size IS 'Bottle size in ml for perfume type products (30, 50, or 100). Null for decants.';
