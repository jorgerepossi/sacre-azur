// hooks/useToggleBrandStatus.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const useToggleBrandStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
            const { error } = await supabase
                .from("brand")
                .update({ active })
                .eq("id", id);

            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
    });
};
