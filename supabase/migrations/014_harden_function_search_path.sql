-- Pin search_path on SECURITY DEFINER / trigger functions per Supabase's
-- linter recommendation, preventing a caller from shadowing an unqualified
-- table/function reference via a session-level search_path change.
-- set_rls and delete_all_policies also had this warning but were dropped
-- in 013 (they were the actual live vulnerability, not just hardening).

ALTER FUNCTION public.is_super_admin(uuid) SET search_path = public;
ALTER FUNCTION public.user_tenant_ids(uuid) SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.update_tenant_users_updated_at() SET search_path = public;
