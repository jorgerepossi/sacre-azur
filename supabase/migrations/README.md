# Database Migrations for Multi-Tenant Architecture

This directory contains SQL migrations to convert Sacre Azur from single-tenant to multi-tenant architecture.

## Migration Order

Run migrations in numerical order:

### 1. `001_create_tenants.sql`

Creates the core multi-tenant infrastructure:

- `tenants` table: Stores tenant/store information
- `tenant_users` table: Maps users to tenants with roles
- `super_admins` table: Platform administrators

### 2. `002_add_tenant_columns.sql`

Adds `tenant_id` foreign keys to existing tables:

- `brand` table
- `perfume` table
- `orders` table
- `perfume_notes` table (if exists)
- `perfume_note_relation` table (if exists)

### 3. `003_setup_rls.sql`

Configures Row Level Security (RLS) policies:

- Enables RLS on all tables
- Creates helper functions for permission checks
- Sets up policies for data isolation between tenants
- Ensures public can view products but only tenant members can modify

### 4. `004_migrate_existing_data.sql`

Migrates existing data to a default tenant:

- Creates default "sacreazur" tenant
- Assigns all existing records to this tenant
- Validates migration success

**⚠️ IMPORTANT:** Before running this migration, replace `{{CURRENT_WHATSAPP_NUMBER}}` with your actual WhatsApp number (e.g., `5491234567890`).

### 8. `008_secure_tenant_products.sql`

Enables RLS on `tenant_products` (price/stock/profit_margin) — this table
was never covered by `003_setup_rls.sql`, leaving it fully writable/readable
by the anon key. Mirrors the `brand`/`perfume` pattern: public read, writes
restricted to `tenant_users` members of the owning tenant.

### 9. `009_repair_rls_model.sql`

`003_setup_rls.sql` was never actually applied to the live project — it had
an ad-hoc, permissive policy set instead (duplicates, several `USING (true)`
policies) and was missing the `is_super_admin`/`user_tenant_ids` helper
functions that `008` depends on. Recreates the helpers and replaces the
policies on `tenants`, `tenant_users`, `brand`, `perfume`, `orders` and
`tenant_products`, adapted to the current schema (`brand`/`perfume` no
longer have `tenant_id` — shared global catalog — and `tenants_update`
allows any tenant member, not just owner/admin, matching the dashboard's
actual behavior).

### 10. `010_secure_tenant_shipping_config.sql`

Closes `tenant_shipping_config` (stores Correo Argentino/Andreani
credentials per tenant) down to tenant members only — it previously had a
`public` role policy with `USING (true)`.

### 11. `011_secure_order_shipping.sql`

Scopes `order_shipping` (shipping address, tracking, internal notes) to
members of the tenant that owns the parent order — previously open to
anyone via a `USING (true)` policy.

### 12. `012_secure_perfume_relation_tables.sql`

Applies the `brand`/`perfume` shared-catalog pattern to
`perfume_note_relation`, `perfume_to_families` and `perfume_to_notes`:
public read, writes require at least one `tenant_users` membership, delete
restricted to super admins.

### 13. `013_drop_dangerous_debug_functions.sql`

Drops `set_rls()` and `delete_all_policies()` — leftover dev-debugging
`SECURITY DEFINER` functions with no internal auth check, callable by
anyone (including anonymous) via PostgREST RPC. `set_rls` could disable RLS
entirely on any named table. Their only caller was the now-deleted
`components/DeletePoliciesButton.tsx`.

### 14. `014_harden_function_search_path.sql`

Pins `search_path` on the remaining `SECURITY DEFINER`/trigger functions
per the Supabase linter's recommendation.

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to https://app.supabase.com/project/YOUR_PROJECT/sql
2. Copy and paste each migration file content in order
3. Click "Run" for each one
4. Verify no errors in the output

### Option 2: Supabase CLI

```bash
# If using Supabase CLI locally
supabase db push

# Or run individual migrations
supabase db execute --file supabase/migrations/001_create_tenants.sql
supabase db execute --file supabase/migrations/002_add_tenant_columns.sql
supabase db execute --file supabase/migrations/003_setup_rls.sql
supabase db execute --file supabase/migrations/004_migrate_existing_data.sql
```

## Post-Migration Steps

1. **Verify Migration:**

   ```sql
   -- Check that default tenant was created
   SELECT * FROM tenants WHERE slug = 'sacreazur';

   -- Verify all products have tenant_id
   SELECT COUNT(*) FROM perfume WHERE tenant_id IS NULL; -- Should be 0
   SELECT COUNT(*) FROM brand WHERE tenant_id IS NULL; -- Should be 0
   SELECT COUNT(*) FROM orders WHERE tenant_id IS NULL; -- Should be 0
   ```

2. **Create Your First Super Admin:**

   ```sql
   -- Replace with your user ID from auth.users
   INSERT INTO super_admins (user_id)
   VALUES ('your-user-uuid-here');
   ```

3. **Test RLS Policies:**
   - Try querying data as different users
   - Verify tenant isolation works correctly
   - Test that public can view products but not modify

## Rollback

If you need to rollback the migrations:

```sql
-- WARNING: This will delete all tenant data and relationships

-- Drop RLS policies
DROP POLICY IF EXISTS "tenants_select" ON tenants;
DROP POLICY IF EXISTS "brands_select" ON brand;
-- (repeat for all policies)

-- Remove tenant_id columns
ALTER TABLE brand DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE perfume DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE orders DROP COLUMN IF EXISTS tenant_id;

-- Drop tables
DROP TABLE IF EXISTS super_admins;
DROP TABLE IF EXISTS tenant_users;
DROP TABLE IF EXISTS tenants;
```

## Troubleshooting

### Error: "relation does not exist"

- Make sure you're running migrations in order
- Check that the table names match your schema

### Error: "null value in column tenant_id"

- Make sure migration 004 completed successfully
- Check that all existing records were assigned to the default tenant

### RLS blocking queries

- Verify you have the correct permissions
- Check that RLS policies are configured correctly
- Ensure you're authenticated when querying protected data

## Need Help?

Check the implementation plan in `.gemini/antigravity/brain/` for detailed information about the multi-tenant architecture.
