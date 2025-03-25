"use client";

import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { getItemTotal } from "@/utils/cartUtils";

export default function CartPage() {
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);

    const total = useMemo(
        () => items.reduce((sum, item) => sum + getItemTotal(item), 0).toFixed(2),
        [items]
    );

    const handleFinish = () => {
        const order = items.map((item: any) => ({
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            total: getItemTotal(item).toFixed(2),
        }));

        const msg = encodeURIComponent(
            `📦 Pedido de Perfumes:\n\n${order
                .map(
                    (o, i) =>
                        `${i + 1}. ${o.name} - ${o.size}ml x${o.quantity} = $${o.total}`
                )
                .join("\n")}\n\n🧾 Total: $${total}`
        );

        const phone = process.env.NEXT_PUBLIC_SITE_PHONE;
        window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    };

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">🛒 Cart</h1>
            {items.length === 0 ? (
                <p className="text-muted-foreground">No items in cart</p>
            ) : (
                <div className="space-y-4">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="border p-4 rounded-md flex justify-between items-center"
                        >
                            <div>
                                <p className="font-bold">{item.name}</p>
                                <p className="text-muted-foreground">
                                    Size: {item.size}ml | Qty: {item.quantity}
                                </p>
                            </div>
                            <p className="font-semibold">${getItemTotal(item).toFixed(2)}</p>
                        </div>
                    ))}

                    <div className="text-xl font-bold text-right">Total: ${total}</div>

                    <div className="flex justify-between mt-6">
                        <Button variant="outline" onClick={clearCart}>
                            Clear
                        </Button>
                        <Button onClick={handleFinish}>Finish and Send via WhatsApp</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
