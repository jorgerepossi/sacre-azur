import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getBaseUrl } from "@/lib/config";
import { useTenant } from "@/providers/TenantProvider";

export const useDeletePerfume = () => {
    const queryClient = useQueryClient();
    const { tenant } = useTenant();
    const baseUrl = getBaseUrl();

    return useMutation({
        mutationFn: async (perfumeId: string) => {
            if (!tenant?.slug) throw new Error("Tenant slug is missing");

            const response = await fetch(`${baseUrl}/api/perfumes/${perfumeId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-tenant-slug": tenant.slug,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete perfume");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["perfumes"] });
            toast.success("Perfume eliminado exitosamente");
        },
        onError: (error: any) => {
            console.error("Error deleting perfume:", error);
            toast.error(error.message || "Error al eliminar el perfume");
        },
    });
};
