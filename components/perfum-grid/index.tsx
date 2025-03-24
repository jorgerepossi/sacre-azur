"use client"

import { useState, useEffect, useContext } from "react";
import { BrandFilterContext } from "@/features/aside-content";
import ItemPerfume from "@/components/item-perfum";
import { useFetchPerfumes } from "@/hooks/useFetchPerfumes";
import SmallLoader from "@/components/loaders/small";

export function PerfumeGrid() {
    const [isMobile, setIsMobile] = useState(false);
    const { selectedBrands } = useContext(BrandFilterContext);
    const { data: perfumes, isLoading, error } = useFetchPerfumes();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    if (isLoading) return <SmallLoader />;
    if (error) return <p>Failed to fetch perfumes.</p>;
    if (!perfumes) return null;

    const filteredPerfumes =
        selectedBrands.length > 0
            ? perfumes.filter((perfume) => selectedBrands.includes(perfume.brand.id))
            : perfumes;

    const sortedPerfumes = filteredPerfumes.sort((a, b) =>
        a.brand.name.localeCompare(b.brand.name)
    );

    return (
        <div className="grid  md:grid-cols-[repeat(4,_1fr)] grid-cols-[repeat(1,_1fr)] gap-[32px]">
            {sortedPerfumes.map((perfume) => (
                <ItemPerfume item={perfume} key={perfume.id} />
            ))}
        </div>
    );
}
