"use client"
import { useState } from "react";
import PerfumeListContent from "../list/perfume-list"
import { useStockFilter } from "@/hooks/useStockFilter";
import { usePerfumeBrandFilter } from "@/hooks/usePerfumeBrandFilter";
import { Perfume } from "@/types/perfume.type";
import { usePerfumeNameFilter } from "@/hooks/usePerfumeNameFilter";
import { useFetchPerfumes } from "@/hooks/useFetchPerfumes";

export const PerfumePageContent = () => {
    const { data: perfumes, isLoading, error } = useFetchPerfumes();
    const [nameFilter, setNameFilter] = useState("");
    const [brandFilter, setBrandFilter] = useState<string | null>(null);
    const [onlyInStock, setOnlyInStock] = useState(false);
    
    const nameFiltered: Perfume[] = usePerfumeNameFilter(
        perfumes || [],
        nameFilter,
      );

    const brandFiltered = usePerfumeBrandFilter(nameFiltered, brandFilter);
    const finalPerfumes = useStockFilter(brandFiltered, onlyInStock);
    return (
        <div>
            <h1>Perfume Page</h1>
            <PerfumeListContent  data={finalPerfumes || []} />
        </div>
    )
}
