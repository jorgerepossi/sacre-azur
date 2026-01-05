"use client";

import { useContext } from "react";

import { BrandFilterContext } from "@/providers/BrandFilterProvider";

import Grid from "@/components/grid";
import ItemPerfume from "@/components/item-perfum";
import SmallLoader from "@/components/loaders/small";
import { SkeletonBox } from "@/components/skeletons";
import SkeletonPerfumeList from "@/components/skeletons/skeleton-perfume-list";
import SkeletonPerfumeListItem from "@/components/skeletons/skeleton-perfume-list-item";

import { Perfume } from "@/types/perfume.type";

import { useFetchPerfumes } from "@/hooks/useFetchPerfumes";

export function PerfumeGrid() {
  const { selectedBrands } = useContext(BrandFilterContext);
  const { data: perfumes, isLoading, error } = useFetchPerfumes(selectedBrands);

  if (isLoading) return <SkeletonPerfumeList />;
  if (error) return <p>Error al cargar perfumes</p>;
  if (!perfumes?.length) return <p>No se encontraron perfumes</p>;

  // Filtrar productos válidos y ordenar
  const validPerfumes = perfumes
    .filter((p: Perfume) => p?.id && p?.name) // <-- FILTRO CRÍTICO
    .sort((a: any, b: any) => a?.brand?.name.localeCompare(b?.brand?.name));

  if (!validPerfumes.length) return <p>No se encontraron perfumes</p>;

  return (
    <Grid className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
      {validPerfumes.map((perfume: Perfume) => (
        <ItemPerfume item={perfume} key={perfume.id} />
      ))}
    </Grid>
  );
}