-- Migration to add decant settings to tenants table
ALTER TABLE tenants 
  ADD COLUMN IF NOT EXISTS decant_min_size numeric DEFAULT 2.5,
  ADD COLUMN IF NOT EXISTS has_1_2ml_option boolean DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN tenants.decant_min_size IS 'The minimum decant size offered by the tenant (e.g., 2 or 3, defaults to 2.5 for legacy compatibility)';
COMMENT ON COLUMN tenants.has_1_2ml_option IS 'Whether the tenant offers a 1.2ml sample option';
