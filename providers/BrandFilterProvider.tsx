"use client";

import { createContext, Suspense, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

type BrandFilterContextType = {
  selectedBrands: string[];
  toggleBrand: (brandId: string) => void;
};

export const BrandFilterContext = createContext<BrandFilterContextType>({
  selectedBrands: [],
  toggleBrand: () => {},
});

export function BrandFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-2 text-sm text-muted-foreground">
          Loading filters...
        </div>
      }
    >
      <BrandFilterProviderContent>{children}</BrandFilterProviderContent>
    </Suspense>
  );
}

function BrandFilterProviderContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    () => searchParams.get("brands")?.split(",").filter(Boolean) || [],
  );

  const toggleBrand = (brandId: string) => {
    const newBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId];

    setSelectedBrands(newBrands);

    const newParams = new URLSearchParams(searchParams.toString());
    newBrands.length > 0
      ? newParams.set("brands", newBrands.join(","))
      : newParams.delete("brands");

    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  return (
    <BrandFilterContext.Provider value={{ selectedBrands, toggleBrand }}>
      {children}
    </BrandFilterContext.Provider>
  );
}
