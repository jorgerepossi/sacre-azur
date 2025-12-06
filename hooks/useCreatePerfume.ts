import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePerfumeInputType } from "@/types/create-perfume-input.type";
import { supabase } from "@/lib/supabaseClient";
import { useTenant } from "@/providers/TenantProvider";

export const useCreatePerfume = () => {
  const queryClient = useQueryClient();
  const { tenant } = useTenant();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      price,
      profit_margin,
      external_link,
      imageFile,
      brand_id,
      note_ids,
    }: CreatePerfumeInputType) => {
      if (!tenant?.id) {
        throw new Error("No hay tenant seleccionado");
      }

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
            tenant_id: tenant.id,  // <-- AGREGADO
          },
        ])
        .select("id");

      if (error) throw new Error("Error creando perfume: " + error.message);

      const createdPerfumeId = perfumeData[0].id;

      if (note_ids && note_ids.length > 0) {
        const { error: relationError } = await supabase
          .from("perfume_note_relation")
          .insert(
            note_ids.map((note_id) => ({
              perfume_id: createdPerfumeId,
              note_id: note_id,
            })),
          );

        if (relationError)
          throw new Error("Error guardando notas: " + relationError.message);
      }

      return perfumeData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perfumes"] });
    },
  });
};
