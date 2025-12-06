-- Row Level Security (RLS) policies for multi-tenant isolation
-- This migration ensures data is properly isolated between tenants

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfume ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM super_admins WHERE super_admins.user_id = $1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: get user's tenant IDs
CREATE OR REPLACE FUNCTION user_tenant_ids(user_id UUID)
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY SELECT tenant_id FROM tenant_users WHERE tenant_users.user_id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TENANTS TABLE POLICIES
-- ============================================

-- Users can view tenants they belong to, or all if super admin
CREATE POLICY "tenants_select" ON tenants 
  FOR SELECT 
  USING (
    id IN (SELECT user_tenant_ids(auth.uid()))
    OR is_super_admin(auth.uid())
  );

-- Only super admins can insert tenants (onboarding flow uses service role)
CREATE POLICY "tenants_insert" ON tenants 
  FOR INSERT 
  WITH CHECK (is_super_admin(auth.uid()));

-- Tenant owners/admins can update, or super admins
CREATE POLICY "tenants_update" ON tenants 
  FOR UPDATE 
  USING (
    id IN (
      SELECT tenant_id FROM tenant_users 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
    OR is_super_admin(auth.uid())
  );

-- Only super admins can delete tenants
CREATE POLICY "tenants_delete" ON tenants 
  FOR DELETE 
  USING (is_super_admin(auth.uid()));

-- ============================================
-- TENANT_USERS TABLE POLICIES
-- ============================================

-- Users can see their own tenant memberships
CREATE POLICY "tenant_users_select" ON tenant_users 
  FOR SELECT 
  USING (
    user_id = auth.uid() 
    OR tenant_id IN (SELECT user_tenant_ids(auth.uid()))
    OR is_super_admin(auth.uid())
  );

-- Tenant owners can add users
CREATE POLICY "tenant_users_insert" ON tenant_users 
  FOR INSERT 
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_users 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
    OR is_super_admin(auth.uid())
  );

-- ============================================
-- BRAND TABLE POLICIES
-- ============================================

-- Brands filtered by tenant membership
CREATE POLICY "brands_select" ON brand 
  FOR SELECT 
  USING (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "brands_insert" ON brand 
  FOR INSERT 
  WITH CHECK (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
  );

CREATE POLICY "brands_update" ON brand 
  FOR UPDATE 
  USING (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
  );

CREATE POLICY "brands_delete" ON brand 
  FOR DELETE 
  USING (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
  );

-- ============================================
-- PERFUME TABLE POLICIES
-- ============================================

-- Public can view all perfumes (for storefront browsing)
CREATE POLICY "perfumes_public_select" ON perfume 
  FOR SELECT 
  USING (true);

-- Only tenant members can insert perfumes
CREATE POLICY "perfumes_insert" ON perfume 
  FOR INSERT 
  WITH CHECK (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
  );

-- Only tenant members can update their perfumes
CREATE POLICY "perfumes_update" ON perfume 
  FOR UPDATE 
  USING (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
  );

-- Only tenant members can delete their perfumes
CREATE POLICY "perfumes_delete" ON perfume 
  FOR DELETE 
  USING (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
  );

-- ============================================
-- ORDERS TABLE POLICIES
-- ============================================

-- Public read access (needed for order confirmation page)
CREATE POLICY "orders_public_select" ON orders 
  FOR SELECT 
  USING (true);

-- Anyone can create an order (customers placing orders)
CREATE POLICY "orders_insert" ON orders 
  FOR INSERT 
  WITH CHECK (true);

-- Only tenant members or super admins can update orders (e.g., mark as sent)
CREATE POLICY "orders_update" ON orders 
  FOR UPDATE 
  USING (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
    OR is_super_admin(auth.uid())
  );

-- Only tenant members can delete orders
CREATE POLICY "orders_delete" ON orders 
  FOR DELETE 
  USING (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
    OR is_super_admin(auth.uid())
  );

-- ============================================
-- PERFUME_NOTES POLICIES (if table exists)
-- ============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'perfume_notes'
  ) THEN
    EXECUTE 'ALTER TABLE perfume_notes ENABLE ROW LEVEL SECURITY';
    
    EXECUTE 'CREATE POLICY "perfume_notes_select" ON perfume_notes 
      FOR SELECT USING (
        tenant_id IN (SELECT user_tenant_ids(auth.uid()))
        OR is_super_admin(auth.uid())
      )';
    
    EXECUTE 'CREATE POLICY "perfume_notes_insert" ON perfume_notes 
      FOR INSERT WITH CHECK (
        tenant_id IN (SELECT user_tenant_ids(auth.uid()))
      )';
    
    EXECUTE 'CREATE POLICY "perfume_notes_update" ON perfume_notes 
      FOR UPDATE USING (
        tenant_id IN (SELECT user_tenant_ids(auth.uid()))
      )';
    
    EXECUTE 'CREATE POLICY "perfume_notes_delete" ON perfume_notes 
      FOR DELETE USING (
        tenant_id IN (SELECT user_tenant_ids(auth.uid()))
      )';
  END IF;
END $$;
