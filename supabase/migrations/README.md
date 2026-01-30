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
