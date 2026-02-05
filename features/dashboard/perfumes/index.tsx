"use client";

import { useState } from "react";

import ContentBlock from "@/components/content-block";

import { Perfume } from "@/types/perfume.type";

import { useFetchPerfumes } from "@/hooks/useFetchPerfumes";
import { usePerfumeBrandFilter } from "@/hooks/usePerfumeBrandFilter";
import { usePerfumeNameFilter } from "@/hooks/usePerfumeNameFilter";
import { useStockFilter } from "@/hooks/useStockFilter";

import PerfumeListContent from "../list/perfume-list";
import PerfumeSearchList from "@/components/perfume-search-filter";

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
  const totalPerfume = finalPerfumes.length;

  return (
    <ContentBlock title="Perfumes" quantity={totalPerfume} >
      <PerfumeSearchList
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        brandFilter={brandFilter}
        setBrandFilter={setBrandFilter}
        onlyInStock={onlyInStock}
        setOnlyInStock={setOnlyInStock}
      />
      <PerfumeListContent data={finalPerfumes || []} />
    </ContentBlock>
  );
};
