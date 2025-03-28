"use client";

import { useQuery } from "@tanstack/react-query";

const fetchBrands = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/brands`);

  if (!response.ok) {
    throw new Error('Failed to fetch brands');
  }

  return response.json();
};

export const useFetchBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
    staleTime: 3600 * 1000 // 1 hora de caché
  });
};