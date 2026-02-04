import { useQuery } from "@tanstack/react-query";

import { getBaseUrl } from "@/lib/config";

const fetchTenant = async (id: string) => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/admin/tenants/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const useFetchTenant = (id: string) => {
  return useQuery({
    queryKey: ["admin-tenant", id],
    queryFn: () => fetchTenant(id),
    enabled: !!id,
  });
};
