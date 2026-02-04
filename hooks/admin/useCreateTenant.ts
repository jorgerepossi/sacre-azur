import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getBaseUrl } from "@/lib/config";

export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      slug: string;
      whatsapp_number: string;
      primary_color: string;
      secondary_color: string;
    }) => {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/admin/tenants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create tenant");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
    },
  });
};
