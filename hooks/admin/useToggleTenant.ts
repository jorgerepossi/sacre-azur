import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getBaseUrl } from "@/lib/config";

export const useToggleTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: string;
      is_active: boolean;
    }) => {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/admin/tenants/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle tenant");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
    },
  });
};
