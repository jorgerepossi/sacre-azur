"use client"

import type React from "react"

import { useState, useContext, createContext } from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const brands = [
    "Chanel",
    "Dior",
    "Gucci",
    "Tom Ford",
    "Versace",
    "Prada",
    "Armani",
    "Calvin Klein",
    "Burberry",
    "Yves Saint Laurent",
    "Lancôme"
]


export const BrandFilterContext = createContext<{
    selectedBrands: string[]
    setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>
}>({
    selectedBrands: [],
    setSelectedBrands: () => {},
})

export function BrandFilterProvider({ children }: { children: React.ReactNode }) {
    const [selectedBrands, setSelectedBrands] = useState<string[]>([])

    return (
        <BrandFilterContext.Provider value={{ selectedBrands, setSelectedBrands }}>{children}</BrandFilterContext.Provider>
    )
}

interface SidebarProps {
    className?: string
}
const AsideContent = ({ className }: SidebarProps)  => {
    const { selectedBrands, setSelectedBrands } = useContext(BrandFilterContext)
    const [isOpen, setIsOpen] = useState(true)

    const toggleBrand = (brand: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };

    const orderByName = [...brands].sort((a, b) => a.localeCompare(b))


    return (
        <div className={cn("space-y-4", className)}>

            <div className="flex items-center justify-between md:hidden">

                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
                    <ChevronDown
                        className={cn("h-4 w-4 transition-transform", {
                            "transform rotate-180": isOpen,
                        })}
                    />
                    <span className="sr-only">Toggle filters</span>
                </Button>
            </div>

            <div className={cn("space-y-4", !isOpen && "hidden")}>

                <div>
                    <h3 className="mb-2 text-lg font-semibold">Brands</h3>
                    <div className="space-y-2">
                        {orderByName.map((brand) => (
                            <div key={brand} className="flex items-center">
                                <button
                                    className="flex items-center gap-2 text-sm hover:text-primary"
                                    onClick={() => toggleBrand(brand)}
                                >
                                    <div
                                        className="flex h-4 w-4 items-center justify-center rounded border border-primary">
                                        {selectedBrands.includes(brand) && <Check className="h-3 w-3 text-primary"/>}
                                    </div>
                                    <span>{brand}</span>
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