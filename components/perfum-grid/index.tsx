"use client";

import { useContext } from "react";

import { BrandFilterContext } from "@/providers/BrandFilterProvider";
import { NoteFilterContext } from "@/providers/NoteFilterProvider";

import Grid from "@/components/grid";
import ItemPerfume from "@/components/item-perfum";
import SkeletonPerfumeList from "@/components/skeletons/skeleton-perfume-list";

import { Perfume } from "@/types/perfume.type";

import { useFetchPerfumes } from "@/hooks/useFetchPerfumes";
import Flex from "@/components/flex";

import { bottlePerfume } from '@lucide/lab';
import { Icon } from 'lucide-react';

export function PerfumeGrid() {
  const { selectedBrands } = useContext(BrandFilterContext);
  const { selectedNotes } = useContext(NoteFilterContext);

  const {
    data: perfumes,
    isPending,
    error,
  } = useFetchPerfumes(selectedBrands, selectedNotes);

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
    return (<Flex className={'flex flex-col items-center justify-center  w-full h-[60vh]'}>
      <Icon iconNode={bottlePerfume} size={48} className={'text-muted-foreground'} />
      <p className={'text-muted-foreground font-bold'}>No se encontraron perfumes</p>
    </Flex>);
  }

  return (
    <Grid className="w-full grid-cols-1 gap-8 xs:grid-cols-1 phablet:grid-cols-2 desktop-sm:grid-cols-4 lg:grid-cols-4">
      {validPerfumes.map((perfume: Perfume) => (
        <ItemPerfume item={perfume} key={perfume.id} />
      ))}
    </Grid>
  );
}
