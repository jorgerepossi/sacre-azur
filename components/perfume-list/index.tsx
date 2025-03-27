"use client";

import { useState } from "react";

import PerfumeListContent from "@/features/dashboard/list/perfume-list";

import ContentBlock from "@/components/content-block";
import PerfumeSearchList from "@/components/perfume-search-filter";

import { Perfume } from "@/types/perfume.type";

import { useFetchPerfumes } from "@/hooks/useFetchPerfumes";
import { usePerfumeBrandFilter } from "@/hooks/usePerfumeBrandFilter";
import { usePerfumeNameFilter } from "@/hooks/usePerfumeNameFilter";
import { useStockFilter } from "@/hooks/useStockFilter";
import Flex from "@/components/flex";
import SalesOverview from "@/components/analytics";

export default function PerfumeList() {
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
    <ContentBlock title="Perfumes">
        <Flex className={'w-full'}>
            <SalesOverview />
        </Flex>
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
}
