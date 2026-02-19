"use client";

import { useEffect } from "react";

import Image from "next/image";

import { useCartStore } from "@/stores/cartStore";
import { ArrowLeft, Copy } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import Flex from "@/components/flex";
import { Link } from "@/components/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Perfume } from "@/types/perfume.type";

import { usePerfume } from "@/hooks/usePerfume";

import { cn } from "@/lib/utils";

import { createSlug } from "@/utils/slugGenerator";

type Props = {
  perfume: Perfume;
};

export default function PerfumeDetails({ perfume }: Props) {
  const isDecantSeller = perfume.product_type === "decant" || !perfume.product_type;

  const {
    sizes,
    quantity,
    totalPrice,
    rawUnitPrice,
    selectedSize,
    setQuantity,
    setSelectedSize,
  } = usePerfume(perfume.price || 0, perfume.profit_margin || 0);

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
          <div className="relative aspect-square overflow-hidden rounded-lg bg-white flex items-center  justify-center">
            <Image
              src={perfume.image || "/placeholder.svg"}
              alt={perfume.name}
              width={475}
              height={500}
              className=""
            />
          </div>

          <div className="space-y-2">
            <Flex className="items-center justify-between">
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

            <Flex className="flex-col space-y-4">
              <h2 className="m-0 text-base font-semibold md:text-xl">
                Descripción
              </h2>
              {perfume?.description?.length ? (
                <div
                  className="prose max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: perfume.description }}
                />
              ) : (
                <p className="text-muted-foreground">
                  No se encontró descripción
                </p>
              )}
            </Flex>

            {/* Acordes Principales (Olfactive Families) */}
            <Flex className="flex-col space-y-4 border-t-2 mt-6 pt-6">
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

            {/* Pirámide Olfativa (Notes by Type) */}
            <Flex className="flex-col space-y-6 border-t-2 mt-6 pt-6 mb-6">
              <h2 className="m-0 text-base font-semibold md:text-xl">
                Pirámide Olfativa
              </h2>

              <div className="space-y-4">
                {[
                  { type: "top", label: "Notas de Salida" },
                  { type: "heart", label: "Notas de Corazón" },
                  { type: "base", label: "Notas de Fondo" },
                ].map((section) => {
                  const notes =
                    perfume.perfume_note_relation?.filter(
                      (rel) => rel.note_type === section.type,
                    ) || [];

                  if (notes.length === 0) return null;

                  return (
                    <div key={section.type} className="space-y-2">
                      <h3 className="text-sm font-medium text-primary">
                        {section.label}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {notes.map((rel) => (
                          <span
                            key={rel.note_id}
                            className="bg-secondary/10 text-secondary-foreground text-xs px-2.5 py-1 rounded-md border"
                          >
                            {rel.perfume_notes.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {(!perfume.perfume_note_relation ||
                  perfume.perfume_note_relation.length === 0) && (
                    <p className="text-sm text-muted-foreground italic">
                      Notas no disponibles
                    </p>
                  )}
              </div>
            </Flex>

            <Flex
              className={
                "flex-col gap-[1rem] border-t-2 py-[1rem] xs:flex-row md:gap-[3rem] md:py-[3rem]"
              }
            >
              {perfume.in_stock && (
                <>
                  {isDecantSeller ? (
                    <Flex className="flex-col items-start justify-between gap-4">
                      <Label className="font-semibold">Tamaño:</Label>
                      <Flex className="gap-2">
                        {sizes.map((s) => (
                          <button
                            type={"button"}
                            key={s.label}
                            onClick={() => setSelectedSize(s)}
                            className={`rounded-full border-2 px-2 py-1 text-xs font-medium transition-all ${selectedSize?.label === s.label
                              ? "border-black bg-black text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:border-black"
                              }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </Flex>
                    </Flex>
                  ) : (
                    <Flex className="flex-col items-start justify-between gap-4">
                      <Label className="font-semibold">Tamaño:</Label>
                      <span className="rounded-full border-2 border-black bg-black px-3 py-1 text-xs font-medium text-white">
                        {perfume.size}ml
                      </span>
                    </Flex>
                  )}

                  <Flex className="flex-col items-start justify-between gap-4">
                    <Label className="font-semibold">Cantidad:</Label>
                    <Flex className={"items-center gap-1"}>
                      <button
                        type="button"
                        className="rounded-lg border px-3 py-1"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <span className="px-4">{quantity}</span>
                      <button
                        type="button"
                        className="rounded-lg border px-3 py-1"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </Flex>
                  </Flex>
                </>
              )}
            </Flex>

            {perfume.in_stock && (
              <div className="space-y-2">
                <p className="text-lg font-semibold">Total: ${displayPrice}</p>
              </div>
            )}

            <Flex className="items-center gap-[2rem]">
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

            <div className="space-y-4 pt-6">
              {!perfume.in_stock ? (
                <div> sin stock </div>
              ) : (
                <Button type="submit" size="lg" className="w-full">
                  Agregar al carrito
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}