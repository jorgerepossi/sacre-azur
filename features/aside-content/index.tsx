"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

import { Check, ChevronDown } from "lucide-react";

import Flex from "@/components/flex";
import { Button } from "@/components/ui/button";

import { useFetchBrands } from "@/hooks/useFetchBrands";

import { cn } from "@/lib/utils";

export const BrandFilterContext = createContext<{
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
}>({
  selectedBrands: [],
  setSelectedBrands: () => {},
});

export function BrandFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  return (
    <BrandFilterContext.Provider value={{ selectedBrands, setSelectedBrands }}>
      {children}
    </BrandFilterContext.Provider>
  );
}
interface SidebarProps {
  className?: string;
}
const AsideContent = ({ className }: SidebarProps) => {
  const { selectedBrands, setSelectedBrands } = useContext(BrandFilterContext);
  const [isOpen, setIsOpen] = useState(true);
  const { data: brands, isLoading, error } = useFetchBrands();

  const toggleBrand = (brandId: string) => {

    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId],
    );
  };

  const orderedBrands = brands
    ? [...brands].sort((a, b) => a.name.localeCompare(b.name))
    : [];

  if (isLoading) return <p>Cargando marcas...</p>;

  console.log("filtered", { brands, selectedBrands });
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between md:hidden">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", {
              "rotate-180 transform": isOpen,
            })}
          />
          <span className="sr-only">Toggle filters</span>
        </Button>
      </div>

      <div className={cn("space-y-4", !isOpen && "hidden")}>
        <Flex className={"border-b-2"}>
          <p> Filter </p>
        </Flex>
        <div>
          <h3 className="mb-2 text-lg font-semibold">Brands</h3>
          <div className="space-y-2">
            {orderedBrands.map((brand) => (
              <div key={brand.id} className="flex items-center">
                <button
                  key={brand.id}
                  className="flex items-center gap-2 text-sm hover:text-primary"
                  onClick={() => toggleBrand(brand.id)}
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded border border-primary">
                    {selectedBrands.includes(brand.id) && (
                      <Check className="h-3 w-3 text-primary" />
                    )}
                  </div>
                  <span>{brand.name}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsideContent;
