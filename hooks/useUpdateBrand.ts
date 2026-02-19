import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { uploadBrandImage } from "@/lib/uploadImage";

interface UpdateBrandParams {
    id: string;
    name: string;
    slug: string;
    imageFile?: File;
    currentImageUrl?: string;
}

export const useUpdateBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            name,
            slug,
            imageFile,
            currentImageUrl,
        }: UpdateBrandParams) => {
            try {
                let imageUrl = currentImageUrl;

                if (imageFile) {
                    imageUrl = await uploadBrandImage(imageFile);
                }

                const { data, error } = await supabase
                    .from("brand")
                    .update({
                        name,
                        slug,
                        image: imageUrl,
                    })
                    .eq("id", id);

                if (error) {
                    console.error("Supabase Error:", error);
                    throw error;
                }

                return data;
            } catch (err) {
                console.error("Unexpected Error:", err);
                throw err;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
    });
};
