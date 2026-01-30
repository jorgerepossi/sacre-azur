"use client";

import { useState } from "react";

import { Perfume } from "@/types/perfume.type";

import { useFetchPerfumes } from "@/hooks/useFetchPerfumes";
import { usePerfumeBrandFilter } from "@/hooks/usePerfumeBrandFilter";
import { usePerfumeNameFilter } from "@/hooks/usePerfumeNameFilter";
import { useStockFilter } from "@/hooks/useStockFilter";

import PerfumeListContent from "../list/perfume-list";

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
      <PerfumeListContent data={finalPerfumes || []} />
    </div>
  );
};
