"use client";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

const fetchBrands = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("brand")
        .select("id, name, active, image")

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const useFetchBrands = () => {
    return useQuery({
        queryKey: ["brands"],
        queryFn: fetchBrands,
    });
};
