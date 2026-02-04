import { useQuery } from "@tanstack/react-query";

import { getBaseUrl } from "@/lib/config";

const fetchTenants = async () => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/admin/tenants`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const useFetchTenants = () => {
  return useQuery({
    queryKey: ["admin-tenants"],
    queryFn: fetchTenants,
  });
};
