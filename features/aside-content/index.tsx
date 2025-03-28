"use client";

import {createContext, useContext, useMemo, useState} from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useFetchBrands } from "@/hooks/useFetchBrands";

import { cn } from "@/lib/utils";
import {Brand} from "@/types/perfume.type";
import BrandItem from "@/components/aside/brand-item";
import {BrandFilterContext} from "@/providers/BrandFilterProvider";


interface SidebarProps {
  className?: string;
}
const AsideContent = ({ className }: SidebarProps) => {
  const { selectedBrands, toggleBrand } = useContext(BrandFilterContext);
  const { data: brands, isLoading, error } = useFetchBrands();

  const sortedBrands = useMemo(() => {
    return brands?.slice().sort((a: Brand, b: Brand) => a.name.localeCompare(b.name)) || [];
  }, [brands]);

  if (isLoading) return <div className="p-2 text-sm">Loading brands...</div>;
  if (error) return <div className="p-2 text-sm text-red-500">Error loading brands</div>;

  return (
      <div className={cn("space-y-4", className)}>

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
      </div>
  );
};




export default AsideContent;