-- Fix tenant creation during sign-up
-- This migration updates the RLS policy to allow authenticated users to create tenants

-- Drop the existing restrictive policy that only allows super admins
DROP POLICY IF EXISTS "tenants_insert" ON tenants;

-- Create new policy that allows authenticated users to insert tenants
-- This enables the sign-up flow to work properly
CREATE POLICY "tenants_insert" ON tenants 
  FOR INSERT 
  WITH CHECK (
    -- Allow authenticated users to create tenants
    auth.uid() IS NOT NULL
  );

-- Also update tenant_users insert policy to allow self-association during sign-up
DROP POLICY IF EXISTS "tenant_users_insert" ON tenant_users;

CREATE POLICY "tenant_users_insert" ON tenant_users 
  FOR INSERT 
  WITH CHECK (
    -- Allow users to associate themselves with a tenant
    user_id = auth.uid()
    -- Or allow tenant owners to add users
    OR tenant_id IN (
      SELECT tenant_id FROM tenant_users 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
    -- Or allow super admins
    OR is_super_admin(auth.uid())
  );

-- Note: We could add additional checks here if needed, such as:
-- - Limiting users to creating only one tenant (would need a function to check)
-- - Requiring certain user metadata to be present
-- For now, we'll keep it simple and allow any authenticated user to create a tenant
