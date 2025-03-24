// components/brand-select-options.tsx
"use client";
import React from "react";
import { SelectGroup, SelectItem } from "@/components/ui/select";
import { Brand } from "@/types/perfume.type";

type Props = {
    brands: Brand[];
};

const BrandSelectOptions = ({ brands }: Props) => {
    if (!brands?.length) return null;

    return (
        <SelectGroup>
            {brands
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((brand) => (
                    <SelectItem
                        key={brand.id}
                        value={brand.id}
                        disabled={!brand.active}
                    >
                        {brand.name} {!brand.active && "(Inactive)"}
                    </SelectItem>
                ))}
        </SelectGroup>
    );
};

export default BrandSelectOptions;
