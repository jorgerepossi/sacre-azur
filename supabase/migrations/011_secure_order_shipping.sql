-- order_shipping had "Allow manage order shipping" (ALL, role public) with
-- USING(true) — any caller could read/update/delete ANY tenant's shipping
-- address, tracking numbers and internal_notes for ANY order, not just
-- their own. The WITH CHECK was scoped to valid order ids but that's not
-- an ownership check.
--
-- Only touchpoint in the app is the dashboard order shipping dialog
-- (features/dashboard/tenants/orders/components/shipping-form.tsx), an
-- authenticated tenant-member client. The public order-confirmed page
-- (features/confirmed-page/index.tsx) only reads `orders`, never
-- `order_shipping` — so no public access is needed here either.

DROP POLICY IF EXISTS "Allow manage order shipping" ON order_shipping;

CREATE POLICY "order_shipping_select" ON order_shipping
  FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders
      WHERE tenant_id IN (SELECT user_tenant_ids(auth.uid()))
    )
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "order_shipping_insert" ON order_shipping
  FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders
      WHERE tenant_id IN (SELECT user_tenant_ids(auth.uid()))
    )
  );

CREATE POLICY "order_shipping_update" ON order_shipping
  FOR UPDATE
  USING (
    order_id IN (
      SELECT id FROM orders
      WHERE tenant_id IN (SELECT user_tenant_ids(auth.uid()))
    )
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "order_shipping_delete" ON order_shipping
  FOR DELETE
  USING (
    order_id IN (
      SELECT id FROM orders
      WHERE tenant_id IN (SELECT user_tenant_ids(auth.uid()))
    )
    OR is_super_admin(auth.uid())
  );
