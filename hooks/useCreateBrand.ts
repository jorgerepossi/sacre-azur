import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { uploadBrandImage } from "@/lib/uploadImage";

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      imageFile,
    }: {
      name: string;
      imageFile: File;
    }) => {
      try {
        const imageUrl = await uploadBrandImage(imageFile);
        
        // Generar slug
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        
        const { data, error } = await supabase.from("brand").insert([
          {
            name,
            slug,
            image: imageUrl,
            active: true,
            // tenant_id eliminado - las marcas son globales
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