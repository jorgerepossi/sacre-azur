-- tenant_shipping_config stores shipping-carrier credentials (Correo
-- Argentino / Andreani username+password) per tenant and had a single
-- "Allow manage shipping config" policy for role `public` with
-- USING(true)/WITH CHECK(true) — any anon or authenticated caller could
-- read or overwrite any tenant's carrier credentials via the REST API,
-- bypassing the dashboard UI's own .eq('tenant_id', ...) filter entirely.
--
-- Only touchpoint in the app is the dashboard Settings > Shipping page
-- (features/dashboard/tenants/settings/shipping/hooks/useShippingConfig.ts),
-- an authenticated tenant-member client doing select/upsert scoped to its
-- own tenant_id. No public/anonymous read path exists for this table, so
-- unlike tenant_products there is no public SELECT policy here.

DROP POLICY IF EXISTS "Allow manage shipping config" ON tenant_shipping_config;

CREATE POLICY "tenant_shipping_config_select" ON tenant_shipping_config
  FOR SELECT
  USING (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "tenant_shipping_config_insert" ON tenant_shipping_config
  FOR INSERT
  WITH CHECK (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
  );

CREATE POLICY "tenant_shipping_config_update" ON tenant_shipping_config
  FOR UPDATE
  USING (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
  );

CREATE POLICY "tenant_shipping_config_delete" ON tenant_shipping_config
  FOR DELETE
  USING (
    tenant_id IN (SELECT user_tenant_ids(auth.uid()))
    OR is_super_admin(auth.uid())
  );
