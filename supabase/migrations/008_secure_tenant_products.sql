-- tenant_products never got RLS enabled by 003_setup_rls.sql, even though
-- it's the table holding price/stock/profit_margin — the actual sensitive
-- data. Anyone with the anon key (shipped in every page bundle) could
-- read/insert/update/delete any row directly, and any server route using
-- a session-less client inherited the same exposure.
--
-- This mirrors the exact pattern already used for `brand` and `perfume`
-- in 003_setup_rls.sql: public read (storefronts must stay browsable
-- without login), writes restricted to members of the owning tenant.

ALTER TABLE tenant_products ENABLE ROW LEVEL SECURITY;

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
