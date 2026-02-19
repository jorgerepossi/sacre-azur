"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "react-hot-toast";
import Flex from "@/components/flex";
import { Link } from "@/components/link";
import { Button } from "@/components/ui/button";
import { Perfume } from "@/types/perfume.type";
import { SIZE_FACTORS } from "@/lib/pricing-constants";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/providers/TenantProvider";

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

const DECANT_SIZES = [
  { label: "2.5ml", value: 2.5 },
  { label: "5ml", value: 5 },
  { label: "10ml", value: 10 },
];

const ItemPerfume = ({ item }: ItemPerfumeProps) => {
  const [selectedSize, setSelectedSize] = useState<number>(2.5);
  const addItem = useCartStore((state) => state.addItem);
  const { tenant } = useTenant();
  const isDecantSeller = tenant?.product_type === "decant" || !tenant?.product_type;

  if (!item?.id || !item?.name) {
    return null;
  }

  const calculatePrice = (sizeInMl: number) => {
    const basePrice = Number(item.price);
    const profitMargin = Number(item.profit_margin) || 0;

    if (!basePrice) return 0;

    if (isDecantSeller) {
      const priceWithProfit = basePrice * (1 + profitMargin / 100);
      const pricePerMl = priceWithProfit / 100;
      const sizeFactor =
        SIZE_FACTORS[sizeInMl as keyof typeof SIZE_FACTORS] || 1.0;
      return Math.round(pricePerMl * sizeInMl * sizeFactor);
    } else {
      return basePrice;
    }
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
      size: isDecantSeller ? selectedSize : item.size || 0,
      quantity: 1,
      image: item.image || "/placeholder.svg",
    });

    toast.success("Agregado al carrito");
  };

  return (
    <Flex className="!hover:shadow-md w-full overflow-hidden rounded-lg bg-background !shadow-sm transition-all duration-300 hover:-translate-y-1">
      <Flex className="w-full p-4">
        <Flex className={"w-full flex-col"}>
          <Flex className={"relative h-full bg-white items-center justify-center py-4 md:py-2"}>
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              width={200}
              height={200}
              className=" max-w-[150px]"
            />
            <Badge
              variant={isDecantSeller ? "default" : "secondary"}
              className="absolute right-2 top-2"
            >
              {isDecantSeller ? "Decant" : `${item.size || "—"}ml`}
            </Badge>
          </Flex>

          {/* Product Info */}
          <Flex className={"flex-col justify-between py-[1rem] md:flex-row"}>
            <Flex className={"flex-1 flex-col gap-[.25rem]"}>
              <p className="m-0 font-bold">{item.name}</p>
              <p className="m-0 text-body-medium text-muted-foreground">
                by {item?.brand?.name || "Unknown"}
              </p>
            </Flex>
          </Flex>

          {item.in_stock ? (
            <>
              {/* Size Selector (only for decants) */}
              {isDecantSeller && (
                <Flex className="mb-3 flex-col gap-2 sm:flex-row">
                  {DECANT_SIZES.map((size) => (
                    <button
                      key={size.value}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedSize(size.value);
                      }}
                      className={`flex-1 rounded-full border-2 px-2 py-1 text-xs font-medium transition-all ${selectedSize === size.value
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-black"
                        }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </Flex>
              )}

              {/* Price */}
              <Flex className="mb-3">
                <p className="text-md m-0 font-bold">
                  ${formatPrice(currentPrice)}
                  {!isDecantSeller && item.size && (
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      / {item.size}ml
                    </span>
                  )}
                </p>
              </Flex>
            </>
          ) : (
            <Flex
              className={"mb-3 h-[50px] shrink-0 items-center justify-center"}
            >
              <Flex
                className={
                  "h-[25px] shrink-0 items-center rounded-full bg-neutral-100 px-4 py-1 text-muted-foreground"
                }
              >
                Sin Stock
              </Flex>
            </Flex>
          )}

          {/* Action Buttons */}
          <Flex
            className={
              "flex-col items-center justify-between gap-[1rem] border-t-2 border-muted pt-[16px] lg:justify-center xl:flex-row"
            }
          >
            <Link
              href={`/perfume/${createSlug(item.name)}_${item.id}`}
              className="w-[120px]"
            >
              <Button
                className={"w-full !bg-white text-xs text-muted-foreground"}
                color={"bg-button-black"}
              >
                Ver Producto
              </Button>
            </Link>
            {item.in_stock ? (
              <Button
                className={
                  "!hover:bg-[#000000] w-[120px] !bg-muted text-xs text-muted-foreground"
                }
                onClick={handleAddToCart}
              >
                Comprar
              </Button>
            ) : (
              <Button
                className={"w-[120px] text-xs"}
                variant={"ghost"}
                disabled
              >
                Sin stock
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ItemPerfume;