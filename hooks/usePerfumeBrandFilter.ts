import { useMemo } from "react";
import { Perfume } from "@/types/perfume.type";

export const usePerfumeBrandFilter = (perfumes: Perfume[], brandId: string | null): Perfume[] => {
    return useMemo(() => {
        if (!brandId) return perfumes;
        return perfumes.filter((perfume) => perfume.brand_id === brandId);
    }, [perfumes, brandId]);
};