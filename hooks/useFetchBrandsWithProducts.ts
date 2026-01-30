import { useQuery } from "@tanstack/react-query";
import { getBaseUrl } from "@/lib/config";
import { useTenant } from "@/providers/TenantProvider";

const fetchBrandsWithProducts = async (tenantSlug?: string | null) => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error("API base URL not configured");
  }
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (tenantSlug) {
    headers["x-tenant-slug"] = tenantSlug;
  }
  
  const response = await fetch(`${baseUrl}/api/brands/with-products`, {
    headers,
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const useFetchBrandsWithProducts = () => {
  const { tenant } = useTenant();
  
  return useQuery({
    queryKey: ["brands-with-products", tenant?.slug],
    queryFn: () => fetchBrandsWithProducts(tenant?.slug),
    enabled: !!tenant?.slug,
    retry: 2,
  });
};