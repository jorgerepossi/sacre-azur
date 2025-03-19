"use client"

import {useState, useEffect, useContext} from "react"

import {BrandFilterContext} from "@/features/aside-content";
 import ItemPerfume from "@/components/item-perfum";
import {perfumes} from "@/constants/perfumes";



export function PerfumeGrid() {
    const [isMobile, setIsMobile] = useState(false)
    const {selectedBrands} = useContext(BrandFilterContext)

    useEffect(() => {
        if (typeof window === "undefined") return;

        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 640)
        }

        checkIfMobile()
        window.addEventListener("resize", checkIfMobile)

        return () => {
            window.removeEventListener("resize", checkIfMobile)
        }
    }, [])


    const filteredPerfumes =
        (selectedBrands.length > 0 ? perfumes.filter((perfume) => selectedBrands.includes(perfume.brand)) : perfumes)
            .sort((a, b) => a.brand.localeCompare(b.brand))


    return (
        <div className="grid  grid-cols-[repeat(5,_1fr)] gap-[32px]">
            {filteredPerfumes.map((perfume) => (
                <ItemPerfume item={perfume} key={perfume.id}/>
            ))}
        </div>
    )
}


