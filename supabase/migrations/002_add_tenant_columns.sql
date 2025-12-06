-- Add tenant_id foreign keys to existing tables
-- This migration makes existing tables tenant-aware

-- Add tenant_id to brand table
ALTER TABLE brand 
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- Add tenant_id to perfume table
ALTER TABLE perfume 
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- Add tenant_id to orders table
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- Add tenant_id to perfume_notes if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'perfume_notes'
  ) THEN
    ALTER TABLE perfume_notes 
      ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add tenant_id to perfume_note_relation if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'perfume_note_relation'
  ) THEN
    ALTER TABLE perfume_note_relation 
      ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_brand_tenant ON brand(tenant_id);
CREATE INDEX IF NOT EXISTS idx_perfume_tenant ON perfume(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant ON orders(tenant_id);

-- Create index on perfume_notes if table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'perfume_notes'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_perfume_notes_tenant ON perfume_notes(tenant_id);
  END IF;
END $$;

-- Create index on perfume_note_relation if table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'perfume_note_relation'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_perfume_note_relation_tenant ON perfume_note_relation(tenant_id);
  END IF;
END $$;

-- Add comments
COMMENT ON COLUMN brand.tenant_id IS 'Foreign key to tenants table - isolates brands per tenant';
COMMENT ON COLUMN perfume.tenant_id IS 'Foreign key to tenants table - isolates perfumes per tenant';
COMMENT ON COLUMN orders.tenant_id IS 'Foreign key to tenants table - isolates orders per tenant';
