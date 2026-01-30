"use client";

import { useContext } from "react";

import { BrandFilterContext } from "@/providers/BrandFilterProvider";

import Grid from "@/components/grid";
import ItemPerfume from "@/components/item-perfum";

import SkeletonPerfumeList from "@/components/skeletons/skeleton-perfume-list";
 

import { Perfume } from "@/types/perfume.type";

import { useFetchPerfumes } from "@/hooks/useFetchPerfumes";

export function PerfumeGrid() {
  const { selectedBrands } = useContext(BrandFilterContext);
 
  const { data: perfumes, isPending, error } = useFetchPerfumes(selectedBrands);

 
  if (isPending) {
    return <SkeletonPerfumeList />;
  }

 
  if (error) {
    return <p>Error al cargar perfumes</p>;
  }

 
  const allPerfumes = perfumes || [];

  const validPerfumes = allPerfumes
    .filter((p: Perfume) => p?.id && p?.name)  
    .sort((a: any, b: any) => a?.brand?.name.localeCompare(b?.brand?.name));

 
  if (validPerfumes.length === 0) {
    return <p>No se encontraron perfumes</p>;
  }

  return (
    <Grid className="grid w-full grid-cols-1 gap-8 md:grid-cols-4">
      {validPerfumes.map((perfume: Perfume) => (
        <ItemPerfume item={perfume} key={perfume.id} />
      ))}
    </Grid>
  );
}