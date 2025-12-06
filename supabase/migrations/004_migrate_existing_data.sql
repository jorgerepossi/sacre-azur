-- Migrate existing data to a default tenant
-- IMPORTANT: Replace {{CURRENT_WHATSAPP_NUMBER}} with your actual WhatsApp number before running

-- Create default tenant for existing Sacre Azur data
INSERT INTO tenants (slug, name, whatsapp_number, is_active, primary_color, secondary_color)
VALUES (
  'sacreazur', 
  'Sacre Azur', 
  '{{CURRENT_WHATSAPP_NUMBER}}',  -- REPLACE THIS with your WhatsApp number (e.g., '5491234567890')
  true,
  '#000000',
  '#ffffff'
)
ON CONFLICT (slug) DO NOTHING;

-- Get the tenant ID and update existing records
DO $$
DECLARE
  default_tenant_id UUID;
BEGIN
  -- Get the default tenant ID
  SELECT id INTO default_tenant_id FROM tenants WHERE slug = 'sacreazur';
  
  IF default_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Default tenant not found. Migration aborted.';
  END IF;
  
  -- Update existing records without tenant_id
  UPDATE brand SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
  UPDATE perfume SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
  UPDATE orders SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
  
  -- Update perfume_notes if table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'perfume_notes'
  ) THEN
    EXECUTE 'UPDATE perfume_notes SET tenant_id = $1 WHERE tenant_id IS NULL' USING default_tenant_id;
  END IF;
  
  -- Update perfume_note_relation if table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'perfume_note_relation'
  ) THEN
    EXECUTE 'UPDATE perfume_note_relation SET tenant_id = $1 WHERE tenant_id IS NULL' USING default_tenant_id;
  END IF;
  
  -- Log migration stats
  RAISE NOTICE 'Migration completed for tenant: %', default_tenant_id;
  RAISE NOTICE 'Brands migrated: %', (SELECT COUNT(*) FROM brand WHERE tenant_id = default_tenant_id);
  RAISE NOTICE 'Perfumes migrated: %', (SELECT COUNT(*) FROM perfume WHERE tenant_id = default_tenant_id);
  RAISE NOTICE 'Orders migrated: %', (SELECT COUNT(*) FROM orders WHERE tenant_id = default_tenant_id);
END $$;

-- Make tenant_id required after migration (prevents future null values)
ALTER TABLE brand ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE perfume ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE orders ALTER COLUMN tenant_id SET NOT NULL;

-- Add NOT NULL to perfume_notes if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'perfume_notes'
  ) THEN
    EXECUTE 'ALTER TABLE perfume_notes ALTER COLUMN tenant_id SET NOT NULL';
  END IF;
END $$;

-- Add NOT NULL to perfume_note_relation if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'perfume_note_relation'
  ) THEN
    EXECUTE 'ALTER TABLE perfume_note_relation ALTER COLUMN tenant_id SET NOT NULL';
  END IF;
END $$;

-- Verify migration (all counts should be 0)
DO $$
DECLARE
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count FROM brand WHERE tenant_id IS NULL;
  IF null_count > 0 THEN
    RAISE WARNING 'Found % brands without tenant_id', null_count;
  END IF;
  
  SELECT COUNT(*) INTO null_count FROM perfume WHERE tenant_id IS NULL;
  IF null_count > 0 THEN
    RAISE WARNING 'Found % perfumes without tenant_id', null_count;
  END IF;
  
  SELECT COUNT(*) INTO null_count FROM orders WHERE tenant_id IS NULL;
  IF null_count > 0 THEN
    RAISE WARNING 'Found % orders without tenant_id', null_count;
  END IF;
  
  RAISE NOTICE 'Migration verification complete';
END $$;
