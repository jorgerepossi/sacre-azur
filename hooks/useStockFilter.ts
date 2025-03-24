import { useMemo } from "react";
import { Perfume } from "@/types/perfume.type";

export const useStockFilter = (perfumes: Perfume[], onlyInStock: boolean): Perfume[] => {
    return useMemo(() => {
        if (!onlyInStock) return perfumes;
        return perfumes.filter((perfume) => perfume.in_stock);
    }, [perfumes, onlyInStock]);
};
