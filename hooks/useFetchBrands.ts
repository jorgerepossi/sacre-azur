import { useQuery } from "@tanstack/react-query";

const fetchBrands = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('API base URL not configured');
  }

  const response = await fetch(`${baseUrl}/api/brands`, {
    next: { revalidate: 3600 }
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
    staleTime: 300000
  });
};