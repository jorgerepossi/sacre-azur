import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreatePerfumeInputType } from "@/types/create-perfume-input.type";

import { supabase } from "@/lib/supabaseClient";

export const useCreatePerfume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      price,
      profit_margin,
      external_link,
      imageFile,
      brand_id,
    }: CreatePerfumeInputType) => {
      const { data: imageData, error: imageError } = await supabase.storage
        .from("perfume-images")
        .upload(`perfumes/${Date.now()}-${imageFile.name}`, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (imageError)
        throw new Error("Error subiendo imagen: " + imageError.message);

      const { data } = supabase.storage
        .from("perfume-images")
        .getPublicUrl(imageData.path);
      const imageUrl = data.publicUrl;

      const { data: perfumeData, error } = await supabase
        .from("perfume")
        .insert([
          {
            name,
            description,
            price,
            profit_margin,
            external_link,
            image: imageUrl,
            brand_id,
          },
        ]);

      if (error) throw new Error("Error creando perfume: " + error.message);
      return perfumeData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perfumes"] });
    },
  });
};
