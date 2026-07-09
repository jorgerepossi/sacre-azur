-- Repair RLS model: 003_setup_rls.sql was never actually applied to this
-- project (no migration history tracked), and the live DB instead had an
-- ad-hoc, permissive policy set with duplicates and several qual=true
-- (wide open) policies on tenants/tenant_users/brand/perfume/orders, plus
-- missing helper functions that 008 depends on.
--
-- Adapted from 003/008's intent to match the CURRENT schema and app
-- behavior (verified against app code, not assumed):
--  - brand/perfume no longer have tenant_id (shared global catalog since
--    the product_type/tenant_products refactor) — 003's tenant_id-scoped
--    policies for these two tables would error outright if reused as-is.
--  - tenants_update is opened to ANY tenant member (not just owner/admin)
--    because the dashboard has no role gate on Settings > General, and a
--    real tenant ("test-shop") only has a member with role='tenant'.

-- 1. Helper functions (used by every policy below)
CREATE OR REPLACE FUNCTION is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM super_admins WHERE super_admins.user_id = $1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION user_tenant_ids(user_id UUID)
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY SELECT tenant_id FROM tenant_users WHERE tenant_users.user_id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. tenants
DROP POLICY IF EXISTS "Authenticated users can delete tenants" ON tenants;
DROP POLICY IF EXISTS "tenants_insert" ON tenants;
DROP POLICY IF EXISTS "Authenticated users can insert tenants" ON tenants;
DROP POLICY IF EXISTS "Anyone can view active tenants" ON tenants;
DROP POLICY IF EXISTS "Authenticated users can update tenants" ON tenants;

CREATE POLICY "tenants_select" ON tenants
  FOR SELECT
  USING (
    is_active = true
    OR id IN (SELECT user_tenant_ids(auth.uid()))
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "tenants_insert" ON tenants
  FOR INSERT
  WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "tenants_update" ON tenants
  FOR UPDATE
  USING (
    id IN (SELECT user_tenant_ids(auth.uid()))
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "tenants_delete" ON tenants
  FOR DELETE
  USING (is_super_admin(auth.uid()));

-- 3. tenant_users
DROP POLICY IF EXISTS "Users can insert their own associations" ON tenant_users;
DROP POLICY IF EXISTS "tenant_users_insert" ON tenant_users;
DROP POLICY IF EXISTS "Users can view their tenant access" ON tenant_users;

CREATE POLICY "tenant_users_select" ON tenant_users
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR tenant_id IN (SELECT user_tenant_ids(auth.uid()))
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "tenant_users_insert" ON tenant_users
  FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_users
      WHERE user_id = auth.uid() AND role = 'owner'
    )
    OR is_super_admin(auth.uid())
  );

-- 4. brand (shared global catalog, no tenant_id column)
DROP POLICY IF EXISTS "AllCanDelete" ON brand;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON brand;
DROP POLICY IF EXISTS "AllCanInsert" ON brand;
DROP POLICY IF EXISTS "Allow public insert" ON brand;
DROP POLICY IF EXISTS "Allow all users to insert brands" ON brand;
DROP POLICY IF EXISTS "Public read access to brand" ON brand;
DROP POLICY IF EXISTS "AllCanRead" ON brand;
DROP POLICY IF EXISTS "Anyone can view brands" ON brand;
DROP POLICY IF EXISTS "AllCanUpdate" ON brand;

CREATE POLICY "brand_public_select" ON brand
  FOR SELECT
  USING (true);

CREATE POLICY "brand_insert" ON brand
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM tenant_users WHERE user_id = auth.uid())
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "brand_update" ON brand
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM tenant_users WHERE user_id = auth.uid())
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "brand_delete" ON brand
  FOR DELETE
  USING (is_super_admin(auth.uid()));

-- 5. perfume (shared global catalog, no tenant_id column)
DROP POLICY IF EXISTS "Allow all deletes on perfume" ON perfume;
DROP POLICY IF EXISTS "Allow public insert" ON perfume;
DROP POLICY IF EXISTS "Public read access to perfume" ON perfume;
DROP POLICY IF EXISTS "Allow public read access to perfume" ON perfume;
DROP POLICY IF EXISTS "Anyone can view perfumes" ON perfume;
DROP POLICY IF EXISTS "Allow all updates on perfume" ON perfume;

CREATE POLICY "perfume_public_select" ON perfume
  FOR SELECT
  USING (true);

CREATE POLICY "perfume_insert" ON perfume
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM tenant_users WHERE user_id = auth.uid())
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "perfume_update" ON perfume
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM tenant_users WHERE user_id = auth.uid())
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "perfume_delete" ON perfume
  FOR DELETE
  USING (is_super_admin(auth.uid()));

-- 6. orders (has tenant_id + user_id)
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Anyone can view their own orders" ON orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON orders;

CREATE POLICY "orders_public_select" ON orders
  FOR SELECT
  USING (true);

CREATE POLICY "orders_insert" ON orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "orders_update" ON orders
  FOR UPDATE
  USING (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "orders_delete" ON orders
  FOR DELETE
  USING (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
    OR is_super_admin(auth.uid())
  );

-- 7. tenant_products (the original 008 request)
DROP POLICY IF EXISTS "Allow all on tenant_products" ON tenant_products;
DROP POLICY IF EXISTS "Public can view tenant products" ON tenant_products;
DROP POLICY IF EXISTS "Tenants can delete their own products" ON tenant_products;
DROP POLICY IF EXISTS "Tenants can insert their own products" ON tenant_products;
DROP POLICY IF EXISTS "Tenants can update their own products" ON tenant_products;
DROP POLICY IF EXISTS "Tenants can view their own products" ON tenant_products;

CREATE POLICY "tenant_products_public_select" ON tenant_products
  FOR SELECT
  USING (true);

CREATE POLICY "tenant_products_insert" ON tenant_products
  FOR INSERT
  WITH CHECK (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
  );

CREATE POLICY "tenant_products_update" ON tenant_products
  FOR UPDATE
  USING (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
  );

CREATE POLICY "tenant_products_delete" ON tenant_products
  FOR DELETE
  USING (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
    OR is_super_admin(auth.uid())
  );
