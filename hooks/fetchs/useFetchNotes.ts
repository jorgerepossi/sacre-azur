"use client";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

const fetchNotes = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("perfume_notes")
        .select("id, name, description");

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const useFetchNotes = () => {
    return useQuery({
        queryKey: ["notes"],
        queryFn: fetchNotes,
    });
};

