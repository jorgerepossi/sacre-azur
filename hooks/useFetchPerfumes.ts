import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

const fetchPerfumes = async () => {
    const { data, error } = await supabase
        .from("perfume")
        .select("*, brand(name, image)").order("created_at")

    if (error) {
        console.error("❌ Error obteniendo perfumes:", error.message);
        throw new Error(error.message);
    }

    console.log("✅ Perfumes obtenidos:", data);
    return data;
};


export const useFetchPerfumes = () => {
    return useQuery({
        queryKey: ["perfumes"],
        queryFn: fetchPerfumes,
    });
};
