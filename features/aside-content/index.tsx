"use client";

import { useContext, useMemo } from "react";

import { BrandFilterContext } from "@/providers/BrandFilterProvider";
import { NoteFilterContext } from "@/providers/NoteFilterProvider";

import BrandItem from "@/components/aside/brand-item";
import NoteItem from "@/components/aside/note-item";
import Box from "@/components/box";
import Flex from "@/components/flex";
import SkeletonAsideList from "@/components/skeletons/skeleton-aside-list";

import { Brand } from "@/types/perfume.type";

import { useFetchNotes } from "@/hooks/fetchs/useFetchNotes";
import { useFetchBrandsWithProducts } from "@/hooks/useFetchBrandsWithProducts";

import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const AsideContent = ({ className }: SidebarProps) => {
  const { selectedBrands, toggleBrand } = useContext(BrandFilterContext);
  const { selectedNotes, toggleNote } = useContext(NoteFilterContext);

  const {
    data: brands,
    isLoading: brandsLoading,
    error: brandsError,
  } = useFetchBrandsWithProducts();
  const {
    data: notes,
    isLoading: notesLoading,
    error: notesError,
  } = useFetchNotes();

  const sortedBrands = useMemo(() => {
    return (
      brands
        ?.filter((brand: Brand) => brand.active === true)
        .sort((a: Brand, b: Brand) => a.name.localeCompare(b.name)) || []
    );
  }, [brands]);

  const sortedNotes = useMemo(() => {
    return notes?.sort((a: any, b: any) => a.name.localeCompare(b.name)) || [];
  }, [notes]);

  if (brandsLoading || notesLoading) return <SkeletonAsideList />;
  if (brandsError || notesError)
    return (
      <div className="p-2 text-sm text-red-500">Error loading filters</div>
    );

  return (
    <Box className={cn("space-y-4", className)}>
      <Flex className={"border-b-2 py-4"}>
        <p className="font-semibold">Filtrar</p>
      </Flex>

      {/* Brands Section con scroll */}
      <div className="space-y-2">
        <p className="mb-2 text-sm font-semibold">Marcas</p>
        <div className="max-h-[250px] space-y-2 overflow-y-auto pr-2">
          {sortedBrands.map((brand: Brand) => (
            <BrandItem
              key={brand.id}
              brand={brand}
              selected={selectedBrands.includes(brand.id)}
              onToggle={toggleBrand}
            />
          ))}
        </div>
      </div>

      {/* Notes Section con scroll */}
      <div className="space-y-2 border-t-2 pt-4">
        <p className="mb-2 text-sm font-semibold">Notas Olfativas</p>
        <div className="max-h-[400px] space-y-2 overflow-y-auto pr-2">
          {sortedNotes.map((note: any) => (
            <NoteItem
              key={note.id}
              note={note}
              selected={selectedNotes.includes(note.id.toString())}
              onToggle={toggleNote}
            />
          ))}
        </div>
      </div>
    </Box>
  );
};

export default AsideContent;
