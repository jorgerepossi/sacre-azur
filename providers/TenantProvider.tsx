"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { Tenant } from "@/types/tenant";

import { supabase } from "@/lib/supabaseClient";

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  isLoading: true,
  error: null,
});

interface TenantProviderProps {
  children: ReactNode;
  tenantSlug: string | null;
}

export function TenantProvider({ children, tenantSlug }: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantSlug) {
      setError("No se especificó ninguna tienda");
      setIsLoading(false);
      return;
    }

    const fetchTenant = async () => {
      try {
        const { data, error } = await supabase
          .from("tenants")
          .select("*")
          .eq("slug", tenantSlug)
          .eq("is_active", true)
          .single();

        if (error || !data) {
          setError("Tienda no encontrada o inactiva");
          setTenant(null);
        } else {
          setTenant(data);

          // Apply tenant branding to CSS variables
          document.documentElement.style.setProperty(
            "--tenant-primary",
            data.primary_color || "#000000",
          );
          document.documentElement.style.setProperty(
            "--tenant-secondary",
            data.secondary_color || "#ffffff",
          );

          // Update page title
          if (data.name) {
            document.title = data.name;
          }
        }
      } catch (err) {
        console.error("Error fetching tenant:", err);
        setError("Error al cargar la tienda");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenant();
  }, [tenantSlug]);

  return (
    <TenantContext.Provider value={{ tenant, isLoading, error }}>
      {children}
    </TenantContext.Provider>
  );
}

/**
 * Hook to access tenant context
 * Must be used within TenantProvider
 */
export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within TenantProvider");
  }
  return context;
};
