"use client";

import React, { useState } from "react";

import Image from "next/image";
import { Link } from "@/components/link";

import Flex from "@/components/flex";
import { SkeletonBox } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { SIZE_FACTORS } from "@/lib/pricing-constants";
import { toast } from "react-hot-toast";

import { Perfume } from "@/types/perfume.type";

interface ItemPerfumeProps {
  item: Perfume;
}

const createSlug = (name: string) => {
  if (!name) return "";  
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const SIZES = [
  { label: "2.5ml", value: 2.5 },
  { label: "5ml", value: 5 },
  { label: "10ml", value: 10 },
];

const ItemPerfume = ({ item }: ItemPerfumeProps) => {
  const [selectedSize, setSelectedSize] = useState<number>(2.5);
  const addItem = useCartStore((state) => state.addItem);
 
  if (!item?.id || !item?.name) {
    return null; 
  }

 
  const calculatePrice = (sizeInMl: number) => {
    const basePrice = Number(item.price);
    const profitMargin = Number(item.profit_margin);
    
    if (!basePrice || !profitMargin) return 0;
    
    const priceWithProfit = basePrice * (1 + profitMargin / 100);
    const pricePerMl = priceWithProfit / 100;
    const sizeFactor = SIZE_FACTORS[sizeInMl as keyof typeof SIZE_FACTORS] || 1.0;
    
    return Math.floor(pricePerMl * sizeInMl * sizeFactor);
  };

  const currentPrice = calculatePrice(selectedSize);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR").format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: String(item.id),
      name: item.name,
      price: currentPrice,
      size: selectedSize,
      quantity: 1,
      image: item.image,
    });
    
    toast.success("Added to cart");
  };

  return (
    <Flex className="!hover:shadow-md w-full overflow-hidden rounded-lg  bg-background !shadow-sm transition-all duration-300 hover:-translate-y-1 max-h-[540px]">
      <Flex className="w-full p-4">
        <Flex className={"w-full flex-col max-h-[540px]"}>
          <Flex className={"flex-1 items-center justify-center py-4 md:py-2"}>
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              width={200}
              height={200}
              className="object-cover"
            />
          </Flex>
          <Flex className={"flex-col justify-between py-[1rem] md:flex-row"}>
            <Flex className={"flex-1 flex-col gap-[.25rem]"}>
              <p className="m-0 font-bold">{item.name}</p>
              <p className="m-0 text-body-medium text-muted-foreground">
                by {item?.brand?.name || "Unknown"}
              </p>
            </Flex>
          </Flex>

          {/* Pills de tamaños */}
          <Flex className="gap-2 mb-3">
            {SIZES.map((size) => (
              <button
                key={size.value}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(size.value);
                }}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium rounded-md border-2 transition-all
                  ${selectedSize === size.value
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-black"
                  }
                `}
              >
                {size.label}
              </button>
            ))}
          </Flex>

     
          <Flex className="mb-3">
            <p className="text-md font-bold m-0">${formatPrice(currentPrice)}</p>
          </Flex>

          <Flex className={"lg:justify-center justify-between items-center flex-col xl:flex-row gap-[1rem] border-t-2 border-muted pt-[16px]"}>
            <Button 
              className={"w-[120px]"} 
              variant={"ghost"}
              onClick={handleAddToCart}
            >
              Comprar
            </Button>

            <Link
              href={`/perfume/${createSlug(item.name)}_${item.id}`}
              className="w-[120px]"
            >
              <Button className={"!bg-muted w-full text-muted-foreground text-xs"} color={"bg-button-black"}>
                Ver Producto
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ItemPerfume;