"use client";

import Image from "next/image";
import Link from "next/link";

import { useCartStore } from "@/stores/cartStore";
import { ArrowLeft, Copy } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import Flex from "@/components/flex";
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
  const {
    selectedSize,
    setSelectedSize,
    quantity,
    setQuantity,
    totalPrice,
    rawUnitPrice,
    sizes,
  } = usePerfume(perfume.price, perfume.profit_margin);

  const { control, handleSubmit } = useForm();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const onSubmit = () => {
    useCartStore.getState().addItem({
      id: String(perfume.id),
      name: perfume.name,
      price: rawUnitPrice,
      size: selectedSize.value,
      quantity: quantity,
      image: perfume.image,
    });
    toast.success("Added to cart");
  };

  console.log(perfume);

  return (
    <div className="container py-10">
      <Link
        href="/"
        className={`${cn(buttonVariants({ variant: "ghost" }))} mb-6 inline-flex items-center text-primary`}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all perfumes
      </Link>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={perfume.image || "/placeholder.svg"}
              alt={perfume.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-2">
            <Flex className="items-center justify-between">
              <h1 className="md:text-3xl text-xl font-bold">
                {perfume.name} - {perfume.brand.name}
              </h1>
              <Image
                src={perfume.brand.image || "/placeholder.svg"}
                alt={`${perfume.brand.name} logo`}
                width={100}
                height={100}
                className="h-full border object-contain"
              />
            </Flex>

            <Flex className="flex-col space-y-4">
              <h2 className="m-0 text-base md:text-xl font-semibold">Description</h2>
              {perfume.description.length ? (
                <div
                  className="prose max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: perfume.description }}
                />
              ) : (
                <p className="text-muted-foreground">
                  No se encontró descripcióm
                </p>
              )}
            </Flex>

            <Flex className="flex-col space-y-4 border-t-2 py-[2rem] md:space-y-4">
              <h2 className="m-0 text-base md:text-xl  font-semibold">Acordes principales</h2>

              {perfume?.perfume_note_relation?.length ? (
                <Flex className={"flex-wrap gap-[16px]"}>
                  {perfume?.perfume_note_relation.map(
                    (relation) =>
                      relation.perfume_notes && (
                        <div
                          key={relation.perfume_notes.id}
                          className="rounded-full border bg-muted px-[1rem]"
                        >
                          <p className="text-body-small text-muted-foreground">
                            {relation.perfume_notes.name}
                          </p>
                        </div>
                      ),
                  )}
                </Flex>
              ) : (
                <p className="text-muted-foreground">
                  No fragrance notes available
                </p>
              )}
            </Flex>
            <Flex
              className={
                "flex-col gap-[1rem] border-t-2 py-[1rem] md:flex-row md:gap-[3rem] md:py-[3rem]"
              }
            >
              <Flex className="flex-col items-start gap-4">
                <label className="font-semibold">Size:</label>
                <select
                  className="rounded-lg border p-2"
                  value={selectedSize.value}
                  onChange={(e) => {
                    const newSize = sizes.find(
                      (s) => s.value === Number(e.target.value),
                    );
                    if (newSize) setSelectedSize(newSize);
                  }}
                >
                  {sizes.map((s) => (
                    <option key={s.label} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Flex>

              <Flex className="flex-col items-start justify-between gap-4">
                <label className="font-semibold"> Quantity:</label>
                <Flex className={"h-[40px] items-center gap-1"}>
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
            </Flex>

            <div className="space-y-2">
              <p className="text-lg font-semibold">Total: ${totalPrice}</p>
            </div>

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
                Share
              </Button>
              <Link
                href={perfume.external_link || ""}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Fragrantica
              </Link>
            </Flex>

            <div className="space-y-4 pt-6">
              <Button type="submit" size="lg" className="w-full">
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
