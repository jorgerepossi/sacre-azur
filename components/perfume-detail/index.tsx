import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePerfume } from "@/hooks/usePerfume";

export default function PerfumeDetails({ perfume }: { perfume: any }) {
    const {
        selectedSize,
        setSelectedSize,
        quantity,
        setQuantity,
        profitMargin,
        setProfitMargin,
        totalPrice,
        sizes
    } = usePerfume(perfume.price);

    return (
        <div className="container py-10">
            <Link href="/" className="inline-flex items-center mb-6 text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all perfumes
            </Link>

            <div className="grid md:grid-cols-2 gap-10">
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                    <Image src={perfume.image || "/placeholder.svg"} alt={perfume.name} fill className="object-cover" />
                </div>

                <div className="space-y-6">
                    <div className="h-12 mb-2">
                        <Image src={perfume.logo || "/placeholder.svg"} alt={`${perfume.brand} logo`} width={150} height={50} className="object-contain h-full" />
                    </div>

                    <h1 className="text-3xl font-bold">{perfume.name}</h1>
                    <p className="text-2xl font-semibold">Base Price: ${perfume.price}</p>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Description</h2>
                        <p className="text-muted-foreground">{perfume.description}</p>
                    </div>

                    {/* Profit Margin Selection */}
                    <div className="flex items-center gap-4">
                        <label className="font-semibold">Profit Margin (%):</label>
                        <input
                            type="number"
                            className="border p-2 rounded-lg w-20"
                            value={profitMargin}
                            onChange={(e) => {
                                const newMargin = Number(e.target.value);
                                if (newMargin >= 0) setProfitMargin(newMargin); // Ensure non-negative values
                            }}
                        />
                    </div>

                    {/* Size Selection */}
                    <div className="flex items-center gap-4">
                        <label className="font-semibold">Size:</label>
                        <select className="border p-2 rounded-lg" value={selectedSize.value} onChange={(e) => {
                            const newSize = sizes.find((size) => size.value === Number(e.target.value));
                            if (newSize) setSelectedSize(newSize);
                        }}>
                            {sizes.map((size) => (
                                <option key={size.label} value={size.value}>{size.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity Selection */}
                    <div className="flex items-center gap-4">
                        <label className="font-semibold">Quantity:</label>
                        <button className="px-3 py-1 border rounded-lg" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                        <span className="px-4">{quantity}</span>
                        <button className="px-3 py-1 border rounded-lg" onClick={() => setQuantity((q) => q + 1)}>+</button>
                    </div>

                    {/* Display Total Price */}
                    <div className="space-y-2">
                        <p className="text-lg font-semibold">Total: ${totalPrice}</p>
                    </div>

                    <div className="pt-6 space-y-4">
                        <Button size="lg" className="w-full">Add to Cart</Button>
                        <Button variant="outline" size="lg" className="w-full">Add to Wishlist</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
