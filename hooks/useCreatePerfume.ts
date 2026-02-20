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
      size,
      external_link,
      imageFile,
      brand_id,
      top_note_ids,
      heart_note_ids,
      base_note_ids,
      family_ids,
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

      // 1. Primero verificar si el perfume ya existe
      const { data: existingPerfume, error: checkError } = await supabase
        .from("perfume")
        .select("id")
        .eq("name", name)
        .eq("brand_id", brand_id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 = no rows found (es lo que esperamos)
        throw new Error("Error buscando perfume: " + checkError.message);
      }

      let createdPerfumeId: string;

      if (existingPerfume) {
        // El perfume ya existe, lanzar error con info del perfume existente
        const error = new Error(`El perfume "${name}" de esta marca ya existe en el catálogo.`);
        (error as any).existingPerfumeId = existingPerfume.id;
        throw error;
      } else {
        // El perfume no existe, crearlo
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

        createdPerfumeId = perfumeData[0].id;
      }

      // 3. Crear relación en tenant_products (inventario del tenant)
      const isDecantType = tenant.product_type === "decant" || !tenant.product_type;

      const { error: tenantProductError } = await supabase
        .from("tenant_products")
        .insert([
          {
            tenant_id: tenant.id,
            perfume_id: createdPerfumeId,
            price: price.toString(),
            profit_margin: profit_margin?.toString() || "0",
            size: size || null,
            sizes_available: isDecantType ? ["2.5", "5", "10"] : [size?.toString()],
            stock: 1,
            active: true,
          },
        ]);

      if (tenantProductError)
        throw new Error(
          "Error agregando producto al inventario: " +
          tenantProductError.message,
        );

      // 4. Guardar notas olfativas (Pirámide Olfativa)
      const allNoteRelations = [
        ...top_note_ids.map((id) => ({
          perfume_id: createdPerfumeId,
          note_id: parseInt(id),
          note_type: "top" as const,
        })),
        ...heart_note_ids.map((id) => ({
          perfume_id: createdPerfumeId,
          note_id: parseInt(id),
          note_type: "heart" as const,
        })),
        ...base_note_ids.map((id) => ({
          perfume_id: createdPerfumeId,
          note_id: parseInt(id),
          note_type: "base" as const,
        })),
      ];

      if (allNoteRelations.length > 0) {
        const { error: noteError } = await supabase
          .from("perfume_to_notes")
          .insert(allNoteRelations);

        if (noteError)
          throw new Error("Error guardando notas: " + noteError.message);
      }

      // 5. Guardar familias olfativas (Acordes principales)
      if (family_ids && family_ids.length > 0) {
        const { error: familyError } = await supabase
          .from("perfume_to_families")
          .insert(
            family_ids.map((family_id) => ({
              perfume_id: createdPerfumeId,
              family_id: parseInt(family_id),
            })),
          );

        if (familyError)
          throw new Error("Error guardando familias: " + familyError.message);
      }

      return { id: createdPerfumeId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perfumes"] });
      queryClient.invalidateQueries({ queryKey: ["tenant-products"] });
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};