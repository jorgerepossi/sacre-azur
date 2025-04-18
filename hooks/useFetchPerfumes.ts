import { useQuery } from "@tanstack/react-query";

import { getBaseUrl } from "@/lib/config";

const fetchPerfumes = async (brands?: string[] | undefined) => {
  const baseUrl = getBaseUrl();
  const query = brands?.length ? `?brands=${brands.join(",")}` : "";

  const response = await fetch(`${baseUrl}/api/perfumes${query}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching perfumes");
  }

  return response.json();
};

export const useFetchPerfumes = (brands?: string[]) => {
  return useQuery({
    queryKey: ["perfumes", brands],
    queryFn: () => fetchPerfumes(brands),
    staleTime: 3600 * 1000,
  });
};
