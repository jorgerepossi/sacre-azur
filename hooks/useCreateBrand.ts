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

        const { data, error } = await supabase.from("brand").insert([
          {
            name,
            image: imageUrl,
            active: true,
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
