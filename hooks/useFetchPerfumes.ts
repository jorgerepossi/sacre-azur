import { useQuery } from "@tanstack/react-query";
import { getBaseUrl } from "@/lib/config";
import { useTenant } from "@/providers/TenantProvider";

const fetchPerfumes = async (brands?: string[], tenantSlug?: string | null) => {
  const baseUrl = getBaseUrl();
  const query = brands?.length ? `?brands=${brands.join(",")}` : "";
  
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

export const useFetchPerfumes = (brands?: string[]) => {
  const { tenant } = useTenant();
  
  return useQuery({
    queryKey: ["perfumes", brands, tenant?.slug],
    queryFn: () => fetchPerfumes(brands, tenant?.slug),
    enabled: !!tenant?.slug,
  });
};
