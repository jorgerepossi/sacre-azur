import { useTenant } from "@/providers/TenantProvider";
import { useQuery } from "@tanstack/react-query";

import { getBaseUrl } from "@/lib/config";

const fetchBrands = async (tenantSlug?: string | null) => {
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

  const response = await fetch(`${baseUrl}/api/brands`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const useFetchBrands = () => {
  const { tenant } = useTenant();

  return useQuery({
    queryKey: ["brands", tenant?.slug],
    queryFn: () => fetchBrands(tenant?.slug),
    enabled: !!tenant?.slug,
    retry: 2,
  });
};
