// hooks/usePerfumeNotes.ts
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabaseClient";

export const usePerfumeNotes = (perfumeId: number) => {
  return useQuery({
    queryKey: ["perfume-notes", perfumeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("perfume_to_notes")
        .select("*, perfume_notes(*)")
        .eq("perfume_id", perfumeId);

      if (error) throw new Error(error.message);
      return data?.map((relation: any) => relation.perfume_notes) || [];
    },
    enabled: !!perfumeId, // Solo se ejecuta si hay un perfumeId válido
  });
};
