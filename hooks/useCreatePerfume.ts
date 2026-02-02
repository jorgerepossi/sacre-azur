import { useTenant } from "@/providers/TenantProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreatePerfumeInputType } from "@/types/create-perfume-input.type";

import { supabase } from "@/lib/supabaseClient";

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

      const { data: perfumeData, error: perfumeError } = await supabase
        .from("perfume")
        .insert([
          {
            name,
            description,
            external_link,
            image: imageUrl,
            brand_id,
          },
        ])
        .select("id");

      if (perfumeError)
        throw new Error("Error creando perfume: " + perfumeError.message);

      const createdPerfumeId = perfumeData[0].id;

      // 3. Crear relación en tenant_products (inventario del tenant)
      const { error: tenantProductError } = await supabase
        .from("tenant_products")
        .insert([
          {
            tenant_id: tenant.id,
            perfume_id: createdPerfumeId,
            price: price.toString(),
            profit_margin: profit_margin.toString(),
            sizes_available: ["2.5", "5", "10"], // Default sizes
            stock: 100, // Default stock
            active: true,
          },
        ]);

      if (tenantProductError)
        throw new Error(
          "Error agregando producto al inventario: " +
            tenantProductError.message,
        );

      // 4. Guardar notas olfativas
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
      queryClient.invalidateQueries({ queryKey: ["tenant-products"] });
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};
