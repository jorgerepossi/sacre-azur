import { useMemo } from "react";

import { Perfume } from "@/types/perfume.type";

export const usePerfumeInStockFilter = (
  perfumes: Perfume[] = [],
  inStockOnly: boolean,
) => {
  return useMemo(() => {
    if (!inStockOnly) return perfumes;
    return perfumes.filter((perfume) => perfume.in_stock);
  }, [perfumes, inStockOnly]);
};
