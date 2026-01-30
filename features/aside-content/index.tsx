"use client";

import { useContext, useMemo } from "react";



import { BrandFilterContext } from "@/providers/BrandFilterProvider";

import BrandItem from "@/components/aside/brand-item";

import { Brand } from "@/types/perfume.type";

import { useFetchBrands } from "@/hooks/useFetchBrands";

import { cn } from "@/lib/utils";
import SkeletonAsideList from "@/components/skeletons/skeleton-aside-list";
import Flex from "@/components/flex";
import Box from "@/components/box";
import { useFetchBrandsWithProducts } from "@/hooks/useFetchBrandsWithProducts";

interface SidebarProps {
  className?: string;
}
const AsideContent = ({ className }: SidebarProps) => {
  const { selectedBrands, toggleBrand } = useContext(BrandFilterContext);
  const { data: brands, isLoading, isPending, error } = useFetchBrandsWithProducts();

  const sortedBrands = useMemo(() => {
  return (
    brands
      ?.filter((brand: Brand) => brand.active === true)
      .sort((a: Brand, b: Brand) => a.name.localeCompare(b.name)) || []
  );
}, [brands]);

 

  if (isPending) return <SkeletonAsideList />;
  if (error)
    return <div className="p-2 text-sm text-red-500">Error loading brands</div>;

  return (
    <Box className={cn("space-y-4", className)}>
      <Flex className={'py-4 border-b-2'}>
        <p> Filtrar</p>
      </Flex>
      <div className="space-y-2">
        {sortedBrands.map((brand: Brand) => (
          <BrandItem
            key={brand.id}
            brand={brand}
            selected={selectedBrands.includes(brand.id)}
            onToggle={toggleBrand}
          />
        ))}
      </div>
    </Box>
  );
};

export default AsideContent;
