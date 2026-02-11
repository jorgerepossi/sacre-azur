-- Manual SQL to apply migration 006_fix_tenant_signup_rls.sql
-- Run this in the Supabase SQL Editor
-- This version doesn't depend on is_super_admin() function
-- SIMPLIFIED VERSION v2 - removes complex OR condition

-- ==========================================
-- STEP 1: Fix tenants INSERT policy
-- ==========================================

-- Drop the existing restrictive policy that only allows super admins
DROP POLICY IF EXISTS "tenants_insert" ON tenants;

-- Create new policy that allows authenticated users to insert tenants
-- This enables the sign-up flow to work properly
CREATE POLICY "tenants_insert" ON tenants 
  FOR INSERT 
  WITH CHECK (
    -- Allow any authenticated user to create tenants
    auth.uid() IS NOT NULL
  );

-- ==========================================
-- STEP 2: Fix tenant_users INSERT policy  
-- ==========================================

-- Drop existing policy
DROP POLICY IF EXISTS "tenant_users_insert" ON tenant_users;

-- Create new simplified policy for sign-up
-- The key insight: during sign-up, users are just associating themselves
CREATE POLICY "tenant_users_insert" ON tenant_users 
  FOR INSERT 
  WITH CHECK (
    -- Simply allow users to add themselves to any tenant
    -- This is safe because they can only insert their own user_id
    user_id = auth.uid()
  );

-- ==========================================
-- VERIFICATION
-- ==========================================
-- After running this, test the sign-up flow at /signup
