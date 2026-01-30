import { useQuery } from "@tanstack/react-query";
import { getBaseUrl } from "@/lib/config";
import { useTenant } from "@/providers/TenantProvider";

const fetchPerfumes = async (
  brands?: string[], 
  notes?: string[],
  tenantSlug?: string | null
) => {
  const baseUrl = getBaseUrl();
  
  const params = new URLSearchParams();
  if (brands?.length) params.append("brands", brands.join(","));
  if (notes?.length) params.append("notes", notes.join(","));
  
  const query = params.toString() ? `?${params.toString()}` : "";
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (tenantSlug) {
    headers["x-tenant-slug"] = tenantSlug;
  }
  
  const response = await fetch(`${baseUrl}/api/perfumes${query}`, {
    headers,
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error("Error fetching perfumes");
  }
  return response.json();
};

export const useFetchPerfumes = (brands?: string[], notes?: string[]) => {
  const { tenant } = useTenant();
  
  return useQuery({
    queryKey: ["perfumes", brands, notes, tenant?.slug],
    queryFn: () => fetchPerfumes(brands, notes, tenant?.slug),
    enabled: !!tenant?.slug,
  });
};