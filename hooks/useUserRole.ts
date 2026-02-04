"use client";

import { useEffect, useState } from "react";

import { useTenant } from "@/providers/TenantProvider";

import { UserRole } from "@/types/user-roles.type";

import { createClient } from "@/lib/supabase/client";

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { tenant } = useTenant();
  const supabase = createClient();

  useEffect(() => {
    async function fetchRole() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || !tenant?.id) {
          setRole(null);
          setLoading(false);
          return;
        }

        const { data } = await supabase
          .from("tenant_users")
          .select("role")
          .eq("user_id", user.id)
          .eq("tenant_id", tenant.id)
          .single();

        setRole((data?.role as UserRole) || null);
      } catch (error) {
        console.error("Error fetching role:", error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [tenant?.id]);

  return {
    role,
    loading,
    isOwner: role === "owner",
    isSuperAdmin: role === "superadmin",
    isTenant: role === "tenant",
  };
}
