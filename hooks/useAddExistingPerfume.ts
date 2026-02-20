import { useTenant } from "@/providers/TenantProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabaseClient";

export type UseAddExistingPerfumeInput = {
    perfumeId: string;
    price: number;
    profit_margin: number;
    size?: number;
};

export const useAddExistingPerfume = () => {
    const queryClient = useQueryClient();
    const { tenant } = useTenant();

    return useMutation({
        mutationFn: async ({
            perfumeId,
            price,
            profit_margin,
            size,
        }: UseAddExistingPerfumeInput) => {
            if (!tenant?.id) {
                throw new Error("No hay tenant seleccionado");
            }

            const isDecantType = tenant.product_type === "decant" || !tenant.product_type;

            // Verificar si ya existe la relación tenant_products
            const { data: existingRelation } = await supabase
                .from("tenant_products")
                .select("id")
                .eq("tenant_id", tenant.id)
                .eq("perfume_id", perfumeId)
                .single();

            if (existingRelation) {
                throw new Error("Este perfume ya está en tu inventario.");
            }

            const { error } = await supabase
                .from("tenant_products")
                .insert([
                    {
                        tenant_id: tenant.id,
                        perfume_id: perfumeId,
                        price: price.toString(),
                        profit_margin: profit_margin?.toString() || "0",
                        size: size || null,
                        sizes_available: isDecantType ? ["2.5", "5", "10"] : [size?.toString()],
                        stock: 100,
                        active: true,
                    },
                ]);

            if (error) {
                throw new Error("Error agregando perfume al inventario: " + error.message);
            }

            return { perfumeId };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["perfumes"] });
            queryClient.invalidateQueries({ queryKey: ["tenant-products"] });
        },
    });
};