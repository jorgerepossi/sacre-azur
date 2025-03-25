
"use client";


import React, {useMemo} from 'react';
import {useCartStore} from "@/stores/cartStore";
import {getItemTotal} from "@/utils/cartUtils";
import {formatNumberWithDots} from "@/lib/formatNumberWithDots";
import {Button} from "@/components/ui/button";

const CartPageContent = () => {
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
            total: formatNumberWithDots(getItemTotal(item)),
        }));

        const msg = encodeURIComponent(
            `📦 Pedido de Perfumes:\n\n${order
                .map(
                    (o, i) =>
                        `${i + 1}. ${o.name} - ${o.size}ml x${o.quantity} = $${o.total}`
                )
                .join("\n")}\n\n🧾 Total: $${formatNumberWithDots(Number(total))}`
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
                            <p className="font-semibold">${formatNumberWithDots(Number(getItemTotal(item)))}</p>
                        </div>
                    ))}

                    <div className="text-xl font-bold text-right">Total: ${formatNumberWithDots(Number(total))}</div>

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
};

export default CartPageContent;