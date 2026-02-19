import { useTenant } from "@/providers/TenantProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabaseClient";

interface AddFromCatalogInput {
    perfume_id: string;
    price: number;
    profit_margin?: number;
    size?: number;
}

export const useAddFromCatalog = () => {
    const queryClient = useQueryClient();
    const { tenant } = useTenant();

    return useMutation({
        mutationFn: async ({
            perfume_id,
            price,
            profit_margin,
            size,
        }: AddFromCatalogInput) => {
            if (!tenant?.id) {
                throw new Error("No hay tenant seleccionado");
            }

            const isDecantType =
                tenant.product_type === "decant" || !tenant.product_type;

            const { data, error } = await supabase
                .from("tenant_products")
                .insert([
                    {
                        tenant_id: tenant.id,
                        perfume_id,
                        price: price.toString(),
                        profit_margin: profit_margin?.toString() ?? "0",
                        size: size ?? null,
                        sizes_available: isDecantType
                            ? ["2.5", "5", "10"]
                            : [size?.toString()],
                        stock: 100,
                        active: true,
                    },
                ])
                .select("id")
                .single();

            if (error) {
                throw new Error("Error agregando producto al inventario: " + error.message);
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["perfumes"] });
            queryClient.invalidateQueries({ queryKey: ["tenant-products"] });
        },
    });
};
