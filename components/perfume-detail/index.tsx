"use client";

import { useForm,  } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { Copy } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Perfume } from "@/types/perfume.type";
import Flex from "@/components/flex";
import { createSlug } from "@/utils/slugGenerator";
import { Label } from "@/components/ui/label";
import { usePerfume } from "@/hooks/usePerfume";



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
        sizes
    } = usePerfume(perfume.price, perfume.profit_margin);

    const { control, handleSubmit } = useForm();

    const onSubmit = () => {
        useCartStore.getState().addItem({
            id: String(perfume.id),
            name: perfume.name,
            price: rawUnitPrice,
            size: String(selectedSize.value),
            quantity: quantity,
            //image: perfume.image,
        });
        toast.success("Added to cart");
    };

    return (
        <div className="container py-10">
            <Link href="/" className="inline-flex items-center mb-6 text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all perfumes
            </Link>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                        <Image
                            src={perfume.image || "/placeholder.svg"}
                            alt={perfume.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="space-y-6">
                        <Flex className="justify-between items-center">
                            <h1 className="text-3xl font-bold">{perfume.name} - {perfume.brand.name}</h1>
                            <Image
                                src={perfume.brand.image || "/placeholder.svg"}
                                alt={`${perfume.brand.name} logo`}
                                width={100}
                                height={100}
                                className="object-contain h-full border"
                            />
                        </Flex>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Description</h2>
                            <div
                                className="text-muted-foreground prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: perfume.description }}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="font-semibold">Size:</label>
                            <select
                                className="border p-2 rounded-lg"
                                value={selectedSize.value}
                                onChange={(e) => {
                                    const newSize = sizes.find((s) => s.value === Number(e.target.value));
                                    if (newSize) setSelectedSize(newSize);
                                }}
                            >
                                {sizes.map((s) => (
                                    <option key={s.label} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        <Flex className="items-center gap-4">
                            <Label className="font-semibold">Quantity:</Label>
                            <button
                                type="button"
                                className="px-3 py-1 border rounded-lg"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                -
                            </button>
                            <span className="px-4">{quantity}</span>
                            <button
                                type="button"
                                className="px-3 py-1 border rounded-lg"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </Flex>

                        <div className="space-y-2">
                            <p className="text-lg font-semibold">Total: ${totalPrice}</p>
                        </div>

                        <Flex className="items-center gap-[2rem]">
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                                onClick={() => {
                                    const link = `${window.location.origin}/perfume/${createSlug(perfume.name)}_${perfume.id}`;
                                    navigator.clipboard.writeText(link);
                                    toast.success("Link copied to clipboard!");
                                }}
                            >
                                <Copy className="w-4 h-4" />
                                Share
                            </Button>
                            <Link href={perfume.external_link || ''} target="_blank" rel="noopener noreferrer">
                                Fragrantica
                            </Link>
                        </Flex>

                        <div className="pt-6 space-y-4">
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
