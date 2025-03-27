import { useMemo } from "react";

import { Perfume } from "@/types/perfume.type";

export const usePerfumeNameFilter = (
  perfumes: Perfume[],
  name: string,
): Perfume[] => {
  return useMemo(() => {
    if (!name.trim()) return perfumes;
    return perfumes.filter((perfume) =>
      perfume.name.toLowerCase().includes(name.toLowerCase()),
    );
  }, [perfumes, name]);
};
