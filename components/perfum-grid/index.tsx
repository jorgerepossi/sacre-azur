"use client";

import { useContext } from "react";

import { useFetchPerfumes } from "@/hooks/useFetchPerfumes";

import SmallLoader from "@/components/loaders/small";
import ItemPerfume from "@/components/item-perfum";
import { Perfume} from "@/types/perfume.type";
import {BrandFilterContext} from "@/providers/BrandFilterProvider";
import Grid from "@/components/grid";
import { SkeletonBox } from "@/components/skeletons";


export function PerfumeGrid() {
  const { selectedBrands } = useContext(BrandFilterContext);
  const { data: perfumes, isLoading, error } = useFetchPerfumes(selectedBrands);

  if (isLoading) return <SkeletonBox />;
  if (error) return <p>Error al cargar perfumes</p>;
  if (!perfumes?.length) return <p>No se encontraron perfumes</p>;

  const sortedPerfumes = perfumes.sort((a:  any, b: any) =>
      a.brand.name.localeCompare(b.brand.name),
  );

  return (
      <Grid className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
        {sortedPerfumes .map((perfume: Perfume) => (
            <ItemPerfume item={perfume} key={perfume.id}/>
        ))}
      </Grid>
  );
}
