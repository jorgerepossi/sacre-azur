
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const useFetchFamilies = () => {
    return useQuery({
        queryKey: ["olfactive-families"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("olfactive_families")
                .select("id, name")
                .order("name");

            if (error) throw new Error(error.message);
            return data || [];
        },
    });
};
