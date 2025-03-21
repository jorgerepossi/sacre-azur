import { supabase } from "@/lib/supabaseClient";

export const uploadBrandImage = async (file: File) => {
    const filePath = `brands/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
        .from("brand-images")
        .upload(filePath, file);

    if (error) throw error;

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/brand-images/${filePath}`;
};
