"use client";

import Image from "next/image";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { ArrowLeft, Copy } from "lucide-react";


import { useCartStore } from "@/stores/cartStore";

import Flex from "@/components/flex";
import { Link } from "@/components/link";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";

import { Perfume } from "@/types/perfume.type";
import { usePerfume } from "@/hooks/usePerfume";

import { useTenant } from "@/providers/TenantProvider";
import { cn } from "@/lib/utils";
import { createSlug } from "@/utils/slugGenerator";

type Props = {
  perfume: Perfume;
};

export default function PerfumeDetails({ perfume }: Props) {
  const { tenant } = useTenant();
  const isDecantSeller = perfume.product_type === "decant" || !perfume.product_type;

  const {
    sizes,
    quantity,
    totalPrice,
    rawUnitPrice,
    selectedSize,
    setQuantity,
    setSelectedSize,
    calculatePrice,
  } = usePerfume(perfume.price || 0, perfume.profit_margin || 0, {
    minSize: tenant?.decant_min_size || 2.5,
    has12ml: tenant?.has_1_2ml_option || false,
  });

  const { control, handleSubmit } = useForm();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR").format(price);
  };

  const displayPrice = isDecantSeller
    ? totalPrice
    : formatPrice((perfume.price || 0) * quantity);

  const cartPrice = isDecantSeller ? rawUnitPrice : perfume.price || 0;
  const cartSize = isDecantSeller ? selectedSize?.value : perfume.size || 0;

  const onSubmit = () => {
    useCartStore.getState().addItem({
      id: String(perfume.id),
      name: perfume.name,
      price: cartPrice,
      size: cartSize,
      quantity: quantity,
      image: perfume.image || "",
    });
    toast.success("Agregado al carrito");
  };

  useEffect(() => {
    if (isDecantSeller && sizes.length > 0 && !selectedSize) {
      setSelectedSize(sizes[0]);
    }
  }, [sizes, selectedSize]);

  console.log(perfume)

  return (
    <div className="container py-10">
      <Link
        href="/"
        className={`${cn(buttonVariants({ variant: "ghost" }))} mb-6 inline-flex items-center text-primary`}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al listado
      </Link>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-10 md:grid-cols-2">
          <Flex className="flex-col sticky top-10 self-start">

            <Flex className="relative flex-col aspect-square overflow-hidden rounded-lg bg-white flex items-center  justify-center">
              <Image
                src={perfume.image || "/placeholder.svg"}
                alt={perfume.name}
                width={475}
                height={500}
                className=""
              />

            </Flex>
            <Flex className="flex-col items-center justify-center space-y-4">


              <Flex className="items-center py-4 gap-[2rem]">
                <Button
                  variant="outline"
                  type={"button"}
                  className="flex items-center gap-2"
                  onClick={() => {
                    const link = `${baseUrl}/perfume/${createSlug(perfume.name)}_${perfume.id}`;
                    navigator.clipboard.writeText(link);
                    toast.success("Link copied to clipboard!");
                  }}
                >
                  <Copy className="h-4 w-4" />
                  Compartir
                </Button>
                {perfume.external_link !== null ? (
                  <Link
                    href={perfume.external_link || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Fragrantica
                  </Link>
                ) : (
                  ""
                )}
              </Flex>
            </Flex>
          </Flex>

          <div className="space-y-2">
            <Flex className="items-center justify-between gap-4">
              <h1 className="text-xl font-bold md:text-3xl">
                {perfume.name} - {perfume.brand.name}
              </h1>
              <div className="relative h-20 w-20 overflow-hidden border rounded-md">
                <Image
                  src={perfume.brand.image || "/placeholder.svg"}
                  alt={`${perfume.brand.name} logo`}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </Flex>

            <Flex className="flex-col gap-3 py-4">
              <h2 className="m-0 text-base  font-semibold md:text-xl">
                Descripción
              </h2>
              {perfume?.description?.length ? (
                <div
                  className="prose max-w-none text-muted-foreground text-sm"
                  dangerouslySetInnerHTML={{ __html: perfume.description }}
                />
              ) : (
                <p className="text-muted-foreground">
                  No se encontró descripción
                </p>
              )}
            </Flex>

            {/* Acordes Principales (Olfactive Families) */}
            <Flex className="flex-col space-y-4 border-t-2 mt-6 py-6 ">
              <h2 className="m-0 text-base font-semibold md:text-xl">
                Acordes principales
              </h2>

              {perfume?.perfume_family_relation?.length ? (
                <Flex className={"flex-wrap gap-[12px]"}>
                  {perfume?.perfume_family_relation.map(
                    (relation) =>
                      relation.olfactive_families && (
                        <div
                          key={relation.family_id}
                          className="rounded-full border bg-muted px-[1rem] py-[.4rem]"
                        >
                          <p className="text-body-small text-muted-foreground font-medium">
                            {relation.olfactive_families.name}
                          </p>
                        </div>
                      ),
                  )}
                </Flex>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Acordes no disponibles
                </p>
              )}
            </Flex>


            {/* Pirámide Olfativa */}
            <Flex className="flex-col space-y-4 border-t-2 mt-6 py-6 mb-6">
              <h2 className="m-0 text-base font-semibold md:text-xl">
                Pirámide Olfativa
              </h2>

              {perfume.perfume_note_relation && perfume.perfume_note_relation.length > 0 ? (
                <div className="relative flex flex-col">
                  {/* Línea vertical conectora */}
                  <div className="absolute left-[15px] top-7 bottom-7 w-px bg-gradient-to-b from-gray-300 via-gray-400 to-gray-700 opacity-25" />

                  {[
                    { type: "top", label: "Salida", icon: "triangle" },
                    { type: "heart", label: "Corazón", icon: "heart" },
                    { type: "base", label: "Fondo", icon: "circle" },
                  ].map((section, idx) => {
                    const notes =
                      perfume.perfume_note_relation?.filter(
                        (rel) => rel.note_type === section.type,
                      ) || [];

                    if (notes.length === 0) return null;

                    const iconBg = "bg-muted";
                    const iconColor = "text-muted-foreground";



                    return (
                      <div
                        key={section.type}
                        className={`grid grid-cols-[32px_1fr] gap-4 items-start py-4 `}
                      >
                        <div
                          className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center relative z-10`}
                        >
                          {section.icon === "triangle" && (
                            <svg className={`w-3.5 h-3.5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M12 3L20 17H4L12 3Z" />
                            </svg>
                          )}
                          {section.icon === "heart" && (
                            <svg className={`w-3.5 h-3.5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          )}
                          {section.icon === "circle" && (
                            <svg className={`w-3.5 h-3.5 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <circle cx="12" cy="12" r="9" />
                              <path d="M12 3v18" />
                              <path d="M3 12h18" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-[12px] font-bold   text-gray-400 mb-1.5">
                            {section.label}
                          </p>
                          <div className="flex flex-wrap gap-y-0.5">
                            {notes.map((rel, i) => (
                              <span key={rel.note_id} className="text-sm font-light text-muted-foreground leading-7">
                                {rel.perfume_notes.name}
                                {i < notes.length - 1 && (
                                  <span className="mx-2 text-gray-300">·</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Notas no disponibles
                </p>
              )}
            </Flex>



            <div className="border-t-2 py-6 space-y-6">
              {perfume.in_stock ? (
                <>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-medium tracking-[2.5px]  text-muted-foreground">
                      Elegí tu tamaño
                    </Label>
                    {isDecantSeller ? (
                      <div className="grid grid-cols-3 gap-2">
                        {sizes.map((s) => (
                          <button
                            type="button"
                            key={s.label}
                            onClick={() => setSelectedSize(s)}
                            className={`flex flex-col items-center py-3 px-2 rounded-xl  transition-all ${selectedSize?.label === s.label
                              ? "border-[1.5px]  bg-muted/50"
                              : "border-[1.5px] border-transparent bg-background hover:border-muted-foreground/40"
                              }`}
                          >
                            <Flex className="gap-2 items-center">
                              <span className="text-lg font-normal text-foreground leading-tight">
                                {s.value}
                              </span>
                              <span className="text-[10px] tracking-[1px] uppercase text-muted-foreground">
                                ml
                              </span>
                            </Flex>
                            <span className="text-[11px] text-muted-foreground mt-1">
                              ${formatPrice(calculatePrice(s.value))}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          className="flex flex-col items-center py-3 px-2 rounded-xl border-[1.5px] border-foreground bg-muted/50"
                        >
                          <span className="text-lg font-normal text-foreground leading-tight">
                            {perfume.size}
                          </span>
                          <span className="text-[10px] tracking-[1px] uppercase text-muted-foreground">
                            ml
                          </span>
                          <span className="text-[11px] text-muted-foreground mt-1">
                            ${formatPrice(perfume.price || 0)}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>


                  <Flex className="items-end justify-between">
                    <Flex className="flex-col space-y-2">
                      <Label className="text-[10px] font-medium tracking-[2.5px]  text-muted-foreground">
                        Cantidad
                      </Label>
                      <div className="inline-flex items-center border rounded-lg overflow-hidden">
                        <button
                          type="button"
                          className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          −
                        </button>
                        <span className="w-10 h-10 flex items-center justify-center text-sm font-medium border-x">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </Flex>

                    <div className="text-right">
                      <p className="text-[10px] font-medium tracking-[2.5px]   text-muted-foreground mb-1">
                        Total
                      </p>
                      <p className="text-2xl font-normal text-foreground">
                        <span className="text-base text-muted-foreground">$</span>
                        {displayPrice}
                      </p>
                    </div>
                  </Flex>

                  {/* Botón */}
                  <Button type="submit" size="lg" className="w-full">
                    Agregar al carrito
                  </Button>
                </>
              ) : (
                <div className="text-center py-4 text-muted-foreground">Sin stock</div>
              )}
            </div>




          </div>
        </div>
      </form>
    </div>
  );
}