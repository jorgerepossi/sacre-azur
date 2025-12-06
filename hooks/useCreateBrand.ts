import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabaseClient";
import { uploadBrandImage } from "@/lib/uploadImage";
import { useTenant } from "@/providers/TenantProvider";

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  const { tenant } = useTenant();

  return useMutation({
    mutationFn: async ({
      name,
      imageFile,
    }: {
      name: string;
      imageFile: File;
    }) => {
      if (!tenant?.id) {
        throw new Error("No hay tenant seleccionado");
      }

      try {
        const imageUrl = await uploadBrandImage(imageFile);

        const { data, error } = await supabase.from("brand").insert([
          {
            name,
            image: imageUrl,
            active: true,
            tenant_id: tenant.id,  // <-- AGREGADO
          },
        ]);

        if (error) {
          console.error("Supabase Error:", error);
          throw error;
        }

        return data;
      } catch (err) {
        console.error("Unexpected Error:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};
