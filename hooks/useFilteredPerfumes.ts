import { useMemo } from "react";
import { Perfume } from "@/types/perfume.type";

export const useFilteredPerfumes = (
    perfumes: Perfume[] = [],
    nameFilter: string,
    brandFilter: string | null,
    inStockOnly: boolean
) => {
    return useMemo(() => {
        return perfumes.filter((perfume) => {
            const matchesName = perfume.name.toLowerCase().includes(nameFilter.toLowerCase());
            const matchesBrand = brandFilter ? perfume.brand?.id === brandFilter : true;
            const matchesStock = inStockOnly ? perfume.in_stock : true;
            return matchesName && matchesBrand && matchesStock;
        });
    }, [perfumes, nameFilter, brandFilter, inStockOnly]);
};
