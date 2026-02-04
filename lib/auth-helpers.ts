import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function requireRole(tenantId: string, allowedRoles: string[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data } = await supabase
    .from("tenant_users")
    .select("role")
    .eq("user_id", user.id)
    .eq("tenant_id", tenantId)
    .single();

  if (!data || !allowedRoles.includes(data.role)) {
    redirect("/unauthorized");
  }

  return data.role;
}

export async function requireOwner(tenantId: string) {
  return requireRole(tenantId, ["owner"]);
}

export async function requireSuperAdminOrOwner(tenantId: string) {
  return requireRole(tenantId, ["owner", "superadmin"]);
}

export async function getUserRole(tenantId: string, userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("tenant_users")
    .select("role")
    .eq("user_id", userId)
    .eq("tenant_id", tenantId)
    .single();

  return data?.role || null;
}
