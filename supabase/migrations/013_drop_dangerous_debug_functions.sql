-- set_rls(table_name, enabled) and delete_all_policies(table_name) are
-- SECURITY DEFINER functions with zero internal auth check, exposed via
-- PostgREST RPC to anon/authenticated roles. set_rls in particular lets
-- anyone (no login required) disable RLS entirely on ANY table by name:
--   POST /rest/v1/rpc/set_rls  {"table_name": "tenant_products", "enabled": false}
-- which would undo every policy fix applied in this project regardless of
-- table. Their only caller in the codebase is components/DeletePoliciesButton.tsx,
-- an orphaned dev-debugging component (not imported/rendered anywhere) that
-- was used to unblock local RLS issues on the `perfume` table during
-- development and should never have shipped with prod DB access.
--
-- Dropping both entirely: nothing in the live app calls them, and keeping
-- a "revoke but retain" version around is unnecessary risk for a function
-- whose only purpose was ad-hoc RLS bypass.

DROP FUNCTION IF EXISTS public.set_rls(text, boolean);
DROP FUNCTION IF EXISTS public.delete_all_policies(text);
