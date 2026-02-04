import { useQuery } from "@tanstack/react-query";

import { getBaseUrl } from "@/lib/config";

const fetchBrands = async () => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error("API base URL not configured");
  }

  const response = await fetch(`${baseUrl}/api/brands`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const useFetchBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
    retry: 2,
  });
};
